// src/components/SearchResults.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from './Card';
import '../styles/SearchResults.css';
import { NODE_API_URL } from '../apiConfig';

interface CardData {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  type: 'movie' | 'serial';
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tmdbIds: number[] = location.state?.tmdbIds || [];

  useEffect(() => {
    const fetchMovies = async () => {
      if (tmdbIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const fetchedMovies: CardData[] = await Promise.all(
          tmdbIds.map(async (id) => {
            const response = await fetch(`${NODE_API_URL}/api/movies/${id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch movie with ID: ${id}`);
            }
            const data = await response.json();
            return {
              id: data.id,
              title: data.title,
              poster_path: data.poster_path,
              vote_average: data.vote_average,
              type: 'movie'
            };
          })
        );
        setMovies(fetchedMovies);
      } catch (error) {
        console.error('Ошибка при получении фильмов:', error);
        setError('Ошибка при получении фильмов.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [tmdbIds]);

  if (loading) {
    return <div>Загрузка результатов поиска...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (movies.length === 0) {
    return <div>Ничего не найдено по вашему запросу.</div>;
  }

  return (
    <div className="search-results">
      <h2>Результаты продвинутого поиска</h2>
      <div className="card-list">
        {movies.map((movie) => (
          <Card
            key={`search-${movie.id}`}
            id={movie.id}
            title={movie.title ?? movie.name ?? 'No Title Available'}
            poster={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
            rating={movie.vote_average}
            type={movie.type}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
