import React, { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';

const FavoriteButton = ({ videoId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(videoId));
  }, [videoId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== videoId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(videoId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <FiHeart size={24} color={isFavorite ? "red" : "white"} />
    </button>
  );
};


export default FavoriteButton;