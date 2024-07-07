require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const NodeCache = require('node-cache');
const axios = require('axios');
const path = require('path');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const allowedOrigins = ['http://localhost:3000', 'https://cricket-reels-27bad7c1686b.herokuapp.com' , 'https://champions.mananagarwal.in'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.instagram.com", "https://*.cdninstagram.com", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://www.instagram.com", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "https://*.cdninstagram.com"],
      fontSrc: ["'self'", "data:", "https://www.instagram.com", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://cricket-reels-27bad7c1686b.herokuapp.com", "http://localhost:5002", "https://api.instagram.com", "https://*.cdninstagram.com", "https://www.google-analytics.com"],
      frameSrc: ["'self'", "https://www.instagram.com", "https://*.cdninstagram.com"],
      mediaSrc: ["'self'", "https://*.cdninstagram.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

const videos = [
  { id: 1, url: 'https://www.instagram.com/reel/C8wdSflxpEB/', platform: 'instagram' },
  { id: 2, url: 'https://www.instagram.com/reel/C8z8-McSV5T/', platform: 'instagram' },
  { id: 5, url: 'https://www.instagram.com/reel/C8z0F7CyxO6/', platform: 'instagram' },
  { id: 6, url: 'https://www.instagram.com/reel/C8zq64uIDmQ/', platform: 'instagram' },
  { id: 7, url: 'https://www.instagram.com/reel/C81HIudJ6Tl/', platform: 'instagram' },
  { id: 8, url: 'https://www.instagram.com/reel/C81-sEWvS3f/', platform: 'instagram' },
  { id: 9, url: 'https://www.instagram.com/reel/C8z9h0Qyl7A/', platform: 'instagram' },
  { id: 10, url: 'https://www.instagram.com/reel/C80awOzy6qK/', platform: 'instagram' },
  { id: 11, url: 'https://www.instagram.com/reel/C82CfTDijL-/', platform: 'instagram' },
  { id: 12, url: 'https://www.instagram.com/reel/C8m2G_9SpMa/', platform: 'instagram' },
  { id: 13, url: 'https://www.instagram.com/reel/C9ApFfESyRP/', platform: 'instagram' },
  { id: 14, url: 'https://www.instagram.com/reel/C9DElw6ylww/', platform: 'instagram' },
  { id: 16, url: 'https://www.instagram.com/reel/C7MeAySSNPa/', platform: 'instagram' }
];

async function getEmbedData(url) {
  const cacheKey = `embed_${url}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${url}`);
    return cachedData;
  }

  console.log(`Generating embed data for ${url}`);
  try {
    const shortcode = url.split('/').slice(-2)[0];
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed`;
    
    const embedData = {
      shortcode,
      html: `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`,
    };
    
    cache.set(cacheKey, embedData);
    console.log(`Embed data generated and cached for ${url}`);
    return embedData;
  } catch (error) {
    console.error(`Error generating embed data for ${url}:`, error.message);
    const shortcode = url.split('/').slice(-2)[0];
    console.log(`Returning fallback data with shortcode ${shortcode} for ${url}`);
    return { shortcode };
  }
}

app.get('/api/video', async (req, res) => {
  console.log('Received request for /api/video');
  try {
    const videoId = req.query.videoId ? parseInt(req.query.videoId) : null;
    let video;
    
    if (videoId !== null) {
      video = videos.find(v => v.id === videoId);
      if (!video) {
        console.log(`Video with ID ${videoId} not found`);
        return res.status(404).json({ error: 'Video not found' });
      }
    } else {
      video = videos[Math.floor(Math.random() * videos.length)];
    }
    
    console.log('Selected video:', video);

    if (!video || !video.url) {
      console.log('Invalid video data');
      return res.status(500).json({ error: 'Invalid video data' });
    }

    const embedData = await getEmbedData(video.url);
    
    const responseData = {
      id: video.id,
      url: video.url,
      platform: video.platform,
      embedData: embedData
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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
