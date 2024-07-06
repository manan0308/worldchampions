import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiExternalLink, FiShare2 } from 'react-icons/fi';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';

const backgroundImages = [
  'images/GRqc4pjbMAAPDT9.jpeg',
  'images/GRQyDiwawAA2rvu.jpeg',
  'images/GRRCuppW4AArAF2.jpeg',
  'images/GRREaRvXwAAGCx-.jpeg',
  'images/tea,.jpeg',
  'images/IMG9844.JPG',
  'images/IMG9845.JPG',
  'images/IMG9846.JPG',
  'images/IMG9847.JPG',
  'images/IMG9848.JPG',
  'images/IMG9849.JPG',
  'images/IMG9850.JPG',
  'images/IMG9851.JPG'
];

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  fade: true
};

const App = () => {
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5002';

  const fetchVideo = useCallback(async (index = null) => {
    console.log('Fetching video from:', `${apiUrl}/api/video`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/api/video${index !== null ? `?index=${index}` : ''}`, { withCredentials: true });
      console.log('Received video data:', response.data);
      if (!response.data || (!response.data.embedData && !response.data.url)) {
        console.log('Invalid video data received:', response.data);
        setError('Invalid video data received');
      } else {
        setVideo(response.data);
      }
    } catch (err) {
      console.error('Error fetching video:', err.response?.data || err.message);
      setError('Failed to load video. Please try again.');
    }
    setIsLoading(false);
  }, [apiUrl]);

  useEffect(() => {
    fetchVideo(0);
  }, [fetchVideo]);

  const handleNextVideo = useCallback(() => {
    fetchVideo();
  }, [fetchVideo]);

  const handleOpenLink = useCallback(() => {
    if (video) {
      window.open(video.url, '_blank');
    }
  }, [video]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this T20 World Cup moment!',
        text: 'Relive the greatest night of Indian cricket:',
        url: window.location.href
      }).catch(console.error);
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?text=Relive%20the%20greatest%20night%20of%20Indian%20cricket!&url=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, '_blank');
    }
  }, []);

  const renderVideoContent = useCallback(() => {
    if (!video || !video.embedData) {
      return <div>No video data available</div>;
    }

    const { shortcode } = video.embedData;
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/`;

    return (
      <div className="w-full h-full">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          allowFullScreen={true}
          title="Instagram embed"
        ></iframe>
      </div>
    );
  }, [video]);

  return (
    <div className="app-container">
      <Slider {...settings} className="background-slider">
        {backgroundImages.map((img, index) => (
          <div key={index}>
            <div className="background-image" style={{ backgroundImage: `url(${img})` }}></div>
          </div>
        ))}
      </Slider>
      <div className="content-container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-lg mx-auto my-8"
        >
          <div className="relative">
            {isLoading && <div>Loading...</div>}
            <AnimatePresence mode="wait">
              {video && (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full aspect-[9/16] max-w-lg mx-auto overflow-hidden rounded-lg shadow-lg"
                >
                  {renderVideoContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {error && <div className="text-red-500 text-center font-semibold mt-4">{error}</div>}
          <div className="flex justify-between mt-4">
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
        <footer className="text-center text-gray-600 mt-8">
          <p>Made with ❤️ by <a href="https://x.com/manan_0308" target="_blank" rel="noopener noreferrer" className="underline">Manan Agarwal</a></p>
          <p className="mt-2">All credits to original owners. This is just made for reliving the greatest night Indian cricket saw in a long time.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
