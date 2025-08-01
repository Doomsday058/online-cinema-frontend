// src/components/AuthForm.tsx
import React, { useState } from 'react';
import '../styles/AuthForm.css';
import { useUser } from './UserContext';
import { NODE_API_URL } from '../apiConfig';

interface AuthFormProps {
  onAuthenticate: (username: string, userId: number) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticate }) => {
  const { setFavoriteMovies } = useUser();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthentication = async (data: { username: string, userId: number }) => {
    const { username, userId } = data;
    onAuthenticate(username, userId);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('username', username);
  };

  const loadFavorites = async (userId: number) => {
    try {
      // Здесь уже все правильно!
      const response = await fetch(`${NODE_API_URL}/api/favorites/${userId}`);
      if (response.ok) {
        const favorites = await response.json();
        const favoriteItems = favorites.map((fav: any) => ({ tmdbId: fav.tmdbId, type: fav.type }));
        setFavoriteMovies(favoriteItems);
      }
    } catch (error) {
      console.error("Ошибка при загрузке избранного:", error);
    }
  };

  const register = async () => {
    const url = `${NODE_API_URL}/api/register`;
    const body = JSON.stringify({ username, password });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'User already exists');
      }

      const data = await response.json();
      handleAuthentication(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const login = async () => {
    const url = `${NODE_API_URL}/api/login`;
    const body = JSON.stringify({ username, password });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      if (data && data.userId) {
        handleAuthentication({ username: data.username, userId: data.userId });
        await loadFavorites(data.userId);
        localStorage.setItem('authToken', data.token || '');
      } else {
        throw new Error('User ID is not provided in the response data');
      }

    } catch (error: any) {
      setError(error.message);
    }
  };

  const submitAuthForm = async () => {
    setError('');
    if (isRegistering) {
      register();
    } else {
      login();
    }
  };

  const handleAuth = (event: React.FormEvent) => {
    event.preventDefault();
    submitAuthForm();
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="auth-modal">
      <div className="auth-form-container">
        <form onSubmit={handleAuth} className="auth-form">
          <h2>{isRegistering ? 'Регистрация' : 'Вход'}</h2>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Введите имя пользователя"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="auth-buttons">
            <button type="submit" className="auth-button">
              {isRegistering ? 'Зарегистрироваться' : 'Войти'}
            </button>
            <button type="button" onClick={toggleForm} className="toggle-button">
              {isRegistering ? 'Уже есть аккаунт?' : "Нет аккаунта?"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;