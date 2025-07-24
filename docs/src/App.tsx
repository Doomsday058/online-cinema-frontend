// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CardDetails from './components/CardDetails';
import CardList from './components/CardList';
import Footer from './components/Footer';
import RecommendationsPage from './components/RecommendationsPage';
import NavBar from './components/NavBar';
import AuthForm from './components/AuthForm';
import LoginButton from './components/LoginButton';
import { UserProvider } from './components/UserContext';
import UserMenu from './components/UserMenu';
import UserProfile from './components/UserProfile';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults'; // Импортируем новый компонент

const App: React.FC = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedUserId = localStorage.getItem('userId');
    if (savedUsername && savedUserId) {
      setUser(savedUsername);
      setUserId(parseInt(savedUserId));
    }
  }, []);

  const onAuthenticate = (username: string, userId: number) => {
    setUser(username);
    setUserId(userId);
    setShowAuthForm(false);
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  };

  const toggleAuthForm = () => {
    setShowAuthForm(!showAuthForm);
  };

  return (
    <Router>
      <UserProvider userId={userId} setUserId={setUserId}>
        <div className="App">
          <header className="App-header">
            <div className="header-top">
              <h1 className="page-title">FilmAdviser</h1>
              <div className="auth-elements">
                {user ? (
                  <UserMenu username={user} onLogout={logout} />
                ) : (
                  <LoginButton onClick={toggleAuthForm} />
                )}
                {showAuthForm && <AuthForm onAuthenticate={onAuthenticate} />}
              </div>
            </div>
            <SearchBar /> {/* Строка поиска теперь под названием */}
          </header>
          <NavBar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<RecommendationsPage />} />
              <Route path="/movies" element={<CardList type="movie" />} />
              <Route path="/movies/:id" element={<CardDetails type="movie" />} />
              <Route path="/serials" element={<CardList type="serial" />} />
              <Route path="/serials/:id" element={<CardDetails type="serial" />} />
              <Route path="/favorites" element={<CardList type="favorites" />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/search-results" element={<SearchResults />} /> {/* Добавляем маршрут для результатов поиска */}
            </Routes>
          </div>
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;
