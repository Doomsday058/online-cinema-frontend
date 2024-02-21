/* src/components/NavBar.tsx */
import React from 'react';
import '../styles/NavBar.css';
import { Link } from 'react-router-dom';
 // Создайте и настройте соответствующие стили

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
      <li>
          <Link to="/" className="nav9-link">Movies</Link> {/* используйте класс 'nav-link', если он у вас есть */}
        </li>
        <li>
          <Link to="/serials" className="nav-link">Serials</Link>
        </li>
        <li><a href="/rated">Rated</a></li>
        {/* Добавьте дополнительные ссылки по мере необходимости */}
      </ul>
    </nav>
  );
}

export default NavBar;
