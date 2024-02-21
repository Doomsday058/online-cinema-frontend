// src/components/Footer.tsx

import React from 'react';
import { FaVk, FaTelegram } from 'react-icons/fa'; // Импортируем иконку Telegram
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
          <FaVk className="footer-icon" />
        </a>
        <a href="https://t.me/your_channel" target="_blank" rel="noopener noreferrer"> {/* Замените ссылку на ваш канал в Telegram */}
          <FaTelegram className="footer-icon" /> {/* Используем иконку Telegram */}
        </a>
        <span className="footer-text">DoomsProject</span>
        <span className="footer-text">© 2024 FilmAdviser. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
