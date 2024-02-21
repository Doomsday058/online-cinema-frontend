import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CardDetails.css';

interface CardDetailsProps {
  type: 'movie' | 'serial'; // Добавлено поле для определения типа контента
}

interface CardDetailsData {
  id: number;
  title: string;
  poster_url: string;
  rating: number;
  description: string;
  production_year: number;
  duration: number;
  country: string;
  genre: string;
  director: string;
  age_rating: number;
  main_roles: string;
}

const CardDetails: React.FC<CardDetailsProps> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CardDetailsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error(`${type} ID is missing`);
        }

        const response = await fetch(`http://localhost:8000/api/${type}s/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type}`);
        }

        const data: CardDetailsData = await response.json();
        setData(data);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, type]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container">
      <img className="details-poster" src={data.poster_url} alt={data.title} />
      <div className="details-content">
        <h2 className="details-title">{data.title}</h2>
        <p className="details-summary">{data.description}</p>
        <p>Rating: {data.rating}</p>
        <p>Production Year: {data.production_year}</p>
        <p>Duration: {data.duration} minutes</p>
        <p>Country: {data.country}</p>
        <p>Genre: {data.genre}</p>
        <p>Director: {data.director}</p>
        <p>Age Rating: {data.age_rating}</p>
        <p>Main Roles: {data.main_roles}</p>
      </div>
    </div>
  );
};

export default CardDetails;
