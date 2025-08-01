// src/components/CardList.tsx
import React, { useEffect, useState } from 'react';
import Card from './Card';
import '../styles/CardList.css';
import { useUser } from './UserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NODE_API_URL } from '../apiConfig';

interface CardData {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  type: 'movie' | 'serial';
}

interface CardListProps {
  type: 'movie' | 'serial' | 'favorites';
}

const CardList: React.FC<CardListProps> = ({ type }) => {
  const [items, setItems] = useState<CardData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { userId, favoriteMovies, setFavoriteMovies } = useUser();

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${NODE_API_URL}/api/favorites/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch favorites');

      const favorites = await response.json();

      const enrichedFavorites = await Promise.all(
        favorites.map(async (favorite: { tmdbId: number; type: string }) => {
          const endpoint = favorite.type === 'movie' ? 'movies' : 'series';
          const tmdbResponse = await fetch(`${NODE_API_URL}/api/${endpoint}/${favorite.tmdbId}`);
          if (!tmdbResponse.ok) throw new Error('Failed to fetch details from TMDb');

          const tmdbData = await tmdbResponse.json();
          return {
            id: tmdbData.id,
            title: tmdbData.title || tmdbData.name,
            poster_path: tmdbData.poster_path,
            vote_average: tmdbData.vote_average,
            type: favorite.type as 'movie' | 'serial',
          };
        })
      );

      // Убираем дубликаты перед установкой состояния
      const uniqueFavorites = Array.from(new Map(enrichedFavorites.map(item => [`${item.type}-${item.id}`, item])).values());

      setItems(uniqueFavorites);
    } catch (error) {
      console.error('Error fetching and enriching favorites:', error);
    }
  };

  const fetchPopular = async (pageNumber: number) => {
    try {
      const endpoint = type === 'movie' ? 'movies/popular' : 'series/popular';
      const response = await fetch(`${NODE_API_URL}/api/${endpoint}?page=${pageNumber}`);
      if (!response.ok) throw new Error(`Failed to fetch ${type}s`);
      const data: any[] = await response.json();

      const formattedData: CardData[] = data.map(item => ({
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        type: type as 'movie' | 'serial',
      }));

      setItems((prevItems) => {
        const newItems = formattedData.filter(
          (item) => !prevItems.some((prevItem) => prevItem.id === item.id && prevItem.type === item.type)
        );
        return [...prevItems, ...newItems];
      });

      if (formattedData.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(`Error fetching ${type}s:`, error);
    }
  };

  useEffect(() => {
    if (type === 'favorites' && userId) {
      fetchFavorites();
    } else {
      setItems([]);
      setPage(1);
      setHasMore(true);
      fetchPopular(1);
    }
    // Удалили favoriteMovies из зависимостей, чтобы избежать лишних перезагрузок
  }, [type, userId]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    fetchPopular(nextPage);
    setPage(nextPage);
  };

  const removeFromFavorites = async (tmdbId: number, itemType: 'movie' | 'serial') => {
    try {
      const response = await fetch(`${NODE_API_URL}/api/favorites/${userId}/${tmdbId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove from favorites');

      setFavoriteMovies((prev) =>
        prev.filter((item) => !(item.tmdbId === tmdbId && item.type === itemType))
      );

      setItems((prevItems) => prevItems.filter((item) => !(item.id === tmdbId && item.type === itemType)));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  if (type === 'favorites') {
    return (
      <div className="card-list">
        {items.map((item) => (
          <Card
            key={`${item.type}-${item.id}`} // Убедитесь, что комбинация type и id уникальна
            id={item.id}
            title={item.title ?? item.name ?? 'No Title Available'}
            poster={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
            rating={item.vote_average}
            type={item.type}
            onRemove={() => removeFromFavorites(item.id, item.type)}
          />
        ))}
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={<p style={{ textAlign: 'center' }}>No more items</p>}
      className="card-list"
    >
      {items.map((item) => (
        <Card
          key={`${item.type}-${item.id}`}
          id={item.id}
          title={item.title ?? item.name ?? 'No Title Available'}
          poster={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
          rating={item.vote_average}
          type={item.type}
        />
      ))}
    </InfiniteScroll>
  );
};

export default CardList;
