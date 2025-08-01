// src/components/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

import { NODE_API_URL } from '../apiConfig'; 
interface FavoriteItem {
  tmdbId: number;
  type: 'movie' | 'serial';
}

interface UserContextType {
  userId: number | null;
  setUserId: Dispatch<SetStateAction<number | null>>;
  favoriteMovies: FavoriteItem[];
  setFavoriteMovies: Dispatch<SetStateAction<FavoriteItem[]>>;
  removeFavorite: (tmdbId: number, type: 'movie' | 'serial') => void;
}

interface UserProviderProps {
  userId: number | null;
  setUserId: Dispatch<SetStateAction<number | null>>;
  children: ReactNode;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => null,
  favoriteMovies: [],
  setFavoriteMovies: () => [],
  removeFavorite: () => null,
});

export const UserProvider: React.FC<UserProviderProps> = ({ userId, setUserId, children }) => {
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteItem[]>([]);

  const removeFavorite = (tmdbId: number, type: 'movie' | 'serial') => {
    setFavoriteMovies((prev) =>
      prev.filter((item) => !(item.tmdbId === tmdbId && item.type === type))
    );
  };

  useEffect(() => {
    if (userId) {
      fetch(`${NODE_API_URL}/api/favorites/${userId}`)
        .then((response) => response.json())
        .then((data: any[]) => {
          // Преобразуем полученные данные в массив FavoriteItem
          const favoriteItems: FavoriteItem[] = data.map((favorite: any) => ({
            tmdbId: favorite.tmdbId,
            type: favorite.type as 'movie' | 'serial',
          }));

          // Убираем дубликаты
          const uniqueFavorites: FavoriteItem[] = Array.from(
            new Map<string, FavoriteItem>(
              favoriteItems.map((item: FavoriteItem) => [`${item.type}-${item.tmdbId}`, item])
            ).values()
          );

          setFavoriteMovies(uniqueFavorites);
        })
        .catch((error) => console.error('Error loading favorites:', error));
    } else {
      setFavoriteMovies([]);
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        favoriteMovies,
        setFavoriteMovies,
        removeFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
