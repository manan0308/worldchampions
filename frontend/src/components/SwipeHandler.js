import React from 'react';
import { motion } from 'framer-motion';

const SwipeHandler = ({ children, onSwipe }) => (
  <motion.div
    drag="x"
    dragConstraints={{ left: 0, right: 0 }}
    onDragEnd={(e, { offset, velocity }) => {
      const swipe = offset.x;
      if (Math.abs(swipe) > 50) {
        onSwipe(swipe > 0 ? 'right' : 'left');
      }
    }}
  >
    {children}
  </motion.div>
);

export default SwipeHandler;