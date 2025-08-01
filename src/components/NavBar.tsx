// src/components/NavBar.tsx
import React from 'react';
import '../styles/NavBar.css';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/movies" className="nav-link">Films</Link>
        </li>
        <li>
          <Link to="/serials" className="nav-link">Serials</Link>
        </li>
        {/* Удаляем ссылку на профиль */}
        {/* <li>
          <Link to="/profile" className="nav-link">Профиль</Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default NavBar;
