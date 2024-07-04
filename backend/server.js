process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const NodeCache = require('node-cache');
const axios = require('axios');
const path = require('path');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { performance } = require('perf_hooks');
require('dotenv').config();

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const allowedOrigins = ['http://localhost:3000', 'https://cricket-reels-27bad7c1686b.herokuapp.com'];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    if(!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.instagram.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://cricket-reels-27bad7c1686b.herokuapp.com", "http://localhost:5002", "https://api.instagram.com"],
      frameSrc: ["'self'", "https://www.instagram.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// JSON parsing
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Video data
const videos = [
  { id: 1, url: 'https://www.instagram.com/reel/C8yxEl5PRN4/', platform: 'instagram' },
  // ... (rest of the video objects)
];

// Optimized getOEmbedData function
async function getOEmbedData(url) {
  const cacheKey = `oembed_${url}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${url}`);
    return cachedData;
  }

  console.log(`Fetching oEmbed data for ${url}`);
  try {
    const response = await axios.get(`https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}&maxwidth=658&hidecaption=true&omitscript=true`, {
      timeout: 5000 // 5 second timeout
    });
    const oembedData = response.data;
    
    const shortcode = url.split('/').slice(-2)[0];
    
    const data = {
      shortcode,
      html: oembedData.html,
      thumbnail_url: oembedData.thumbnail_url
    };
    cache.set(cacheKey, data);
    console.log(`oEmbed data fetched and cached for ${url}`);
    return data;
  } catch (error) {
    console.error(`Error fetching oEmbed data for ${url}:`, error.message);
    const shortcode = url.split('/').slice(-2)[0];
    console.log(`Returning fallback data with shortcode ${shortcode} for ${url}`);
    return { shortcode };
  }
}

// Profiling middleware
const profileMiddleware = (req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
  });
  next();
};

app.use(profileMiddleware);

// API routes
app.get('/api/video', async (req, res) => {
  console.log('Received request for /api/video');
  try {
    if (videos.length === 0) {
      console.log('No videos available');
      return res.status(404).json({ error: 'No videos available' });
    }

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    console.log('Selected video:', randomVideo);

    if (!randomVideo || !randomVideo.url) {
      console.log('Invalid video data');
      return res.status(500).json({ error: 'Invalid video data' });
    }

    const oembedData = await getOEmbedData(randomVideo.url);
    
    const responseData = {
      id: randomVideo.id,
      url: randomVideo.url,
      platform: randomVideo.platform,
      oembedData: oembedData
    };

    console.log('Sending video data:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error in /api/video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/video-count', (req, res) => {
  console.log('Received request for /api/video-count');
  res.json({ count: videos.length });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});