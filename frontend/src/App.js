import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import ReactGA from 'react-ga';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiExternalLink, FiShare2 } from 'react-icons/fi';

// Lazy load components
const LoadingIndicator = lazy(() => import('./components/LoadingIndicator'));
const SwipeHandler = lazy(() => import('./components/SwipeHandler'));
const VolumeControl = lazy(() => import('./components/VolumeControl'));
const FavoriteButton = lazy(() => import('./components/FavoriteButton'));
const ProgressBar = lazy(() => import('./components/ProgressBar'));
const DarkModeToggle = lazy(() => import('./components/DarkModeToggle'));

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function App() {
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5002';

  console.log('API URL:', apiUrl);

  const fetchVideo = useCallback(async () => {
    console.log('Fetching video from:', `${apiUrl}/api/video`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/api/video`, { withCredentials: true });
      console.log('Received video data:', response.data);
      if (!response.data || (!response.data.oembedData && !response.data.url)) {
        console.log('Invalid video data received:', response.data);
        setError('Invalid video data received');
      } else {
        setVideo(response.data);
        setCurrentVideoIndex(prev => prev + 1);
        ReactGA.event({
          category: 'Video',
          action: 'Fetch',
          label: response.data.id
        });
      }
    } catch (err) {
      console.error('Error fetching video:', err.response?.data || err.message);
      setError('Failed to load video. Please try again.');
      ReactGA.exception({
        description: `Video fetch error: ${err.message}`,
        fatal: false
      });
    }
    setIsLoading(false);
  }, [apiUrl]);

  const debouncedFetchVideo = useCallback(debounce(fetchVideo, 300), [fetchVideo]);

  useEffect(() => {
    debouncedFetchVideo();
    console.log('Fetching video count from:', `${apiUrl}/api/video-count`);
    axios.get(`${apiUrl}/api/video-count`, { withCredentials: true })
      .then(response => {
        console.log('Received video count:', response.data.count);
        setTotalVideos(response.data.count);
      })
      .catch(error => {
        console.error('Error fetching video count:', error);
      });
  }, [debouncedFetchVideo, apiUrl]);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleNextVideo = useCallback(() => {
    debouncedFetchVideo();
    ReactGA.event({
      category: 'Button',
      action: 'Click',
      label: 'Next Video'
    });
  }, [debouncedFetchVideo]);

  const handleOpenLink = useCallback(() => {
    if (video) {
      window.open(video.url, '_blank');
      ReactGA.event({
        category: 'Button',
        action: 'Click',
        label: 'Open Original'
      });
    }
  }, [video]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this T20 World Cup moment!',
        text: 'Relive the greatest night of Indian cricket:',
        url: window.location.href
      }).then(() => {
        ReactGA.event({
          category: 'Button',
          action: 'Click',
          label: 'Share'
        });
      }).catch(console.error);
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?text=Relive%20the%20greatest%20night%20of%20Indian%20cricket!&url=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, '_blank');
      ReactGA.event({
        category: 'Button',
        action: 'Click',
        label: 'Share (Fallback)'
      });
    }
  }, []);

  const handleSwipe = useCallback((direction) => {
    if (direction === 'left') {
      handleNextVideo();
    }
  }, [handleNextVideo]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  const renderVideoContent = useCallback(() => {
    console.log('Rendering video content. Video data:', video);
    if (!video) {
      console.log('No video data available');
      return <div>No video data available</div>;
    }
  

    if (video.oembedData && video.oembedData.html) {
      console.log('Rendering with oEmbed data');
      return (
        <div className="absolute top-0 left-0 w-full h-full">
          <iframe
            srcDoc={`
              <style>
                body, html { margin: 0; padding: 0; height: 100%; }
                iframe { width: 100%; height: 100%; border: 0; }
              </style>
              ${video.oembedData.html}
            `}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            title="Instagram embed"
          ></iframe>
        </div>
      );
    } else if (video.oembedData && video.oembedData.shortcode) {
      console.log('Rendering with shortcode:', video.oembedData.shortcode);
      return (
        <iframe
          src={`https://www.instagram.com/p/${video.oembedData.shortcode}/embed/`}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allowFullScreen
          title="Instagram embed"
        ></iframe>
      );
    }

    console.log('No valid video content found');
    return <div>No video content available</div>;
  }, [video]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-between p-4`}>
      <Suspense fallback={<div>Loading...</div>}>
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </Suspense>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-lg"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center text-gray-800 dark:text-white">Champions: T20 World Cup 🇮🇳</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ProgressBar current={currentVideoIndex} total={totalVideos} />
          <SwipeHandler onSwipe={handleSwipe}>
            <div className="relative">
              {isLoading && <LoadingIndicator />}
              <AnimatePresence mode="wait">
              {video && (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full aspect-[9/16] sm:aspect-video max-w-lg mx-auto overflow-hidden rounded-lg shadow-lg"
                >
                  {renderVideoContent()}
                  <VolumeControl />
                  <FavoriteButton videoId={video.id} />
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </SwipeHandler>
        </Suspense>
        {error && <div className="text-red-500 text-center font-semibold mt-4">{error}</div>}
        <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextVideo}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FiRefreshCw className="mr-2" /> Next Reel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenLink}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FiExternalLink className="mr-2" /> Original
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FiShare2 className="mr-2" /> Share
          </motion.button>
        </div>
      </motion.div>
      <footer className="mt-8 text-center text-white">
        <p>Made with ❤️ by <a href="https://x.com/manan_0308" target="_blank" rel="noopener noreferrer" className="underline">Manan Agarwal</a></p>
        <p className="mt-2">All credits to original owners. This is just made for reliving the greatest night Indian cricket saw in a long time.</p>
      </footer>
    </div>
  );
}

export default App;