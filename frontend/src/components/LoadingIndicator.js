import React from 'react';
import { motion } from 'framer-motion';

const LoadingIndicator = () => (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
    />
  </div>
);

export default LoadingIndicator;