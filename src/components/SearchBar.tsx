// src/components/SearchBar.tsx

import React, { useState } from 'react';
import '../styles/SearchBar.css';
import { useNavigate } from 'react-router-dom';
import { FaMagic, FaSearch } from 'react-icons/fa';
import { NODE_API_URL, PYTHON_AI_URL } from '../apiConfig';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const navigate = useNavigate();

  const handleToggleAdvanced = () => {
    setIsAdvanced(!isAdvanced);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!isAdvanced) {
      // Базовый поиск
      try {
        const response = await fetch(`${NODE_API_URL}/api/search/movies?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          const tmdbIds = data.results.map((movie: any) => movie.id);
          navigate(`/search-results`, { state: { tmdbIds: tmdbIds, searchType: 'basic' } });
        } else {
          alert('Фильм не найден.');
        }
      } catch (error) {
        console.error('Ошибка при поиске фильма:', error);
        alert('Ошибка при поиске фильма.');
      }
    } else {
      // Продвинутый поиск
      try {
        const response = await fetch(`${PYTHON_AI_URL}/advanced_search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data && data.tmdbIds && data.tmdbIds.length > 0) {
          navigate(`/search-results`, { state: { tmdbIds: data.tmdbIds, searchType: 'advanced' } });
        } else {
          alert('Не найдено фильмов по вашим критериям.');
        }
      } catch (error) {
        console.error('Ошибка при продвинутом поиске:', error);
        alert('Ошибка при продвинутом поиске.');
      }
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Поиск фильмов..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit"><FaSearch /></button>
      <div className="advanced-icon-container" onClick={handleToggleAdvanced} title="Переключить продвинутый поиск">
        <FaMagic className={`advanced-icon ${isAdvanced ? 'active' : ''}`} />
        <span className="advanced-label">{isAdvanced ? 'Расширен.' : 'Обычн.'}</span>
      </div>
    </form>
  );
};

export default SearchBar;
