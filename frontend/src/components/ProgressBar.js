import React from 'react';

const ProgressBar = ({ current, total }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
    <div 
      className="bg-blue-600 h-2.5 rounded-full" 
      style={{ width: `${(current / total) * 100}%` }}
    ></div>
  </div>
);

export default ProgressBar;