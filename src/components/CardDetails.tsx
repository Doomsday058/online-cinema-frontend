// src/components/CardDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CardDetails.css';
import { NODE_API_URL, PYTHON_AI_URL } from '../apiConfig';

interface CardDetailsProps {
  type: 'movie' | 'serial';
}

interface CardDetailsData {
  id: number;
  title?: string;  // Для фильмов
  name?: string;   // Для сериалов
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date?: string;  // Для фильмов
  first_air_date?: string;  // Для сериалов
  runtime?: number;
  episode_run_time?: number[];  // Время эпизода для сериалов
  genres: { name: string }[];
}

const CardDetails: React.FC<CardDetailsProps> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CardDetailsData | null>(null);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [loadingReview, setLoadingReview] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = type === 'movie' ? 'movies' : 'series'; 
        const response = await fetch(`${NODE_API_URL}/api/${endpoint}/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type}`);
        }
  
        const data: CardDetailsData = await response.json();
        setData(data);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        setError(`Не удалось получить данные о ${type}.`);
      }
    };
  
    if (id) {
      fetchData();
    }
  }, [id, type]);

  const handleGenerateReview = async () => {
    if (!id || !data) return;

    setLoadingReview(true);
    setError(null);
    setAiReview(null);

    try {
      const response = await fetch(`${PYTHON_AI_URL}/generate_review/${id}?type=${type === 'serial' ? 'serial' : 'movie'}`);
      if (!response.ok) {
        throw new Error('Failed to generate review');
      }

      const result = await response.json();
      setAiReview(result.review);
    } catch (err: any) {
      console.error('Error generating review:', err);
      setError(err.message || 'Error generating review');
    } finally {
      setLoadingReview(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container">
      <div className="details__img-wrapper">
        <img className="details-poster" src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`} alt={data.title || data.name} />
      </div>
      <div className="details-content">
        <h2 className="details-title">{data.title || data.name}</h2>
        <p className="details-summary">{data.overview}</p>
        <div className="details-wrapper">
          <dl className="details-dl">
            <dt className="details-dt">Rating</dt>
            <dd className="details-dd">{data.vote_average}</dd>
            <dt className="details-dt">{type === 'movie' ? 'Release Date' : 'First Air Date'}</dt>
            <dd className="details-dd">{data.release_date || data.first_air_date}</dd>
            <dt className="details-dt">Runtime</dt>
            <dd className="details-dd">{type === 'movie' ? `${data.runtime} minutes` : `${data.episode_run_time ? data.episode_run_time[0] : ''} minutes`}</dd>
            <dt className="details-dt">Genres</dt>
            <dd className="details-dd">
              {data.genres.map((genre) => (
                <div key={genre.name}>{genre.name}</div>
              ))}
            </dd>
          </dl>
        </div>
        <button onClick={handleGenerateReview} disabled={loadingReview} className="ai-review-button">
          {loadingReview ? 'Генерация обзора...' : 'Обзор от AI'}
        </button>
        {error && <div className="error-message">{error}</div>}
        {aiReview && (
          <div className="ai-review">
            <h3>Обзор от AI:</h3>
            <p>{aiReview}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetails;
