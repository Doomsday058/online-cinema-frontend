import React, { useEffect, useState } from 'react';
import Card from './Card';
import '../styles/CardList.css';

interface CardData {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  rating: number;
}

interface CardListProps {
  type: 'movie' | 'serial'; // Добавлено поле для определения типа контента
}

const CardList: React.FC<CardListProps> = ({ type }) => {
  const [items, setItems] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/${type}s`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type}s`);
        }
        const data: CardData[] = await response.json();
        setItems(data);
      } catch (error) {
        console.error(`Error fetching ${type}s:`, error);
      }
    };

    fetchData();
  }, [type]);

  return (
    <div className="card-list">
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          poster={item.poster_url}
          rating={item.rating}
          type={type}
        />
      ))}
    </div>
  );
};

export default CardList;
