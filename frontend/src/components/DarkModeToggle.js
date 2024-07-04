import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => (
  <button
    onClick={toggleDarkMode}
    className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-full z-30"
  >
    {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
  </button>
);

export default DarkModeToggle;