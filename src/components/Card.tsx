// src/components/Card.tsx
import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcLike } from 'react-icons/fc';
import { useUser } from './UserContext';
import '../styles/Card.css';
import { NODE_API_URL } from '../apiConfig'; // --- ИЗМЕНЕНИЕ ---

interface CardProps {
  id: number;
  title: string;
  poster: string;
  rating?: number;
  type: 'movie' | 'serial';
  onRemove?: () => void;
}

const Card: React.FC<CardProps> = ({ id, title, poster, rating, type, onRemove }) => {
  const navigate = useNavigate();
  const { userId, favoriteMovies, setFavoriteMovies } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const found = favoriteMovies.some((fav) => fav.tmdbId === id && fav.type === type);
    setIsFavorite(found);
  }, [favoriteMovies, id, type]);

  const handleClick = () => {
    navigate(`/${type}s/${id}`);
  };

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (userId === null) {
      console.error('Пользователь не авторизован.');
      return;
    }

    try {
      if (isFavorite) {
        await fetch(`${NODE_API_URL}/api/favorites/${userId}/${id}`, { method: 'DELETE' });
        setFavoriteMovies((prevFavorites) => prevFavorites.filter((movie) => !(movie.tmdbId === id && movie.type === type)));

        if (onRemove) {
          onRemove();
        }
      } else {
        const response = await fetch(`${NODE_API_URL}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, tmdbId: id, type }),
        });

        if (response.ok) {
          setFavoriteMovies((prevFavorites) => [...prevFavorites, { tmdbId: id, type }]);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error adding to favorites');
        }
      }

      setIsFavorite((prev) => !prev);
      triggerAnimation();
    } catch (error: any) {
      console.error('Ошибка при обновлении избранного:', error);
    }
  };

  const triggerAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  const formattedRating = rating ? rating.toFixed(1) : 'N/A';

  return (
    <div className="card" onClick={handleClick}>
      <div className="card-favorite" onClick={handleFavoriteClick}>
        <FcLike
          size={24}
          className={`favorite-icon ${isFavorite ? 'selected' : ''} ${animating ? 'animate' : ''}`}
        />
      </div>
      <div className="card__img-wrapper">
        <img src={poster} alt={title} className="card-poster" />
      </div>
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        {formattedRating && <div className="card-rating">⭐ {formattedRating}</div>}
      </div>
    </div>
  );
};

export default memo(Card);