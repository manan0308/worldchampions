import React, { useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const VolumeControl = () => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Here you would typically interact with the video player API to mute/unmute
    // Since we're using an embedded Instagram player, we can't directly control it
    // You might want to add a visual indicator or message for the user
  };

  return (
    <button
      onClick={toggleMute}
      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
    </button>
  );
};


export default VolumeControl;