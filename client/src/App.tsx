import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import RegisterButton from './components/RegisterButton';
import Footer from './components/Footer';
import CardList from './components/CardList';
import CardDetails from './components/CardDetails';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1 className="page-title">FilmAdviser</h1>
            <RegisterButton />
          </div>
        </header>
        <NavBar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<CardList type="movie" />} />
            <Route path="/movies/:id" element={<CardDetails type="movie" />} />
            <Route path="/serials" element={<CardList type="serial" />} />
            <Route path="/serials/:id" element={<CardDetails type="serial" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
