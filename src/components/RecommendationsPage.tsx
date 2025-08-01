// src/components/RecommendationsPage.tsx
import React, { useEffect, useState } from 'react';
import Card from './Card';
import '../styles/CardList.css';
import { useUser } from './UserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PYTHON_AI_URL } from '../apiConfig';

interface RecommendationData {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
}

const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { userId } = useUser();
  const [fadeClass, setFadeClass] = useState('fade-in');

  const fetchRecommendations = async (pageNumber: number) => {
    try {
      const response = await fetch(`${PYTHON_AI_URL}/recommendations/${userId}?page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Не удалось получить рекомендации');
      }
      const data: RecommendationData[] = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      }

      setFadeClass('fade-out');
      setTimeout(() => {
        setRecommendations((prev) => {
          const newItems = data.filter((item) =>
            !prev.some((prevItem) => prevItem.id === item.id && prevItem.media_type === item.media_type)
          );
          const updatedItems = [...prev, ...newItems];
          // Убираем дубликаты
          const uniqueItems = Array.from(new Map(updatedItems.map(item => [`${item.media_type}-${item.id}`, item])).values());
          return uniqueItems;
        });
        setFadeClass('fade-in');
      }, 500);
    } catch (error) {
      console.error('Ошибка при получении рекомендаций:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecommendations(1); // Загружаем первую страницу
    }
  }, [userId]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    fetchRecommendations(nextPage);
    setPage(nextPage);
  };

  return (
    <InfiniteScroll
      dataLength={recommendations.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Загрузка...</h4>}
      endMessage={<p style={{ textAlign: 'center' }}>Больше нет рекомендаций</p>}
      className={`card-list ${fadeClass}`}
    >
      {recommendations.map((item) => (
        <Card
          key={`${item.media_type}-${item.id}`} // Уникальный ключ
          id={item.id}
          title={item.title ?? item.name ?? 'Нет названия'}
          poster={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
          rating={item.vote_average}
          type={item.media_type === 'tv' ? 'serial' : 'movie'}
        />
      ))}
    </InfiniteScroll>
  );
};

export default RecommendationsPage;
