import React, { memo } from 'react';
import { FaVk, FaTelegram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a href="https://vk.com/cheer1o" target="_blank" rel="noopener noreferrer">
          <FaVk className="footer-icon" />
        </a>
        <a href="https://t.me/+mz4yDgvs0FY2YzQ6" target="_blank" rel="noopener noreferrer">
          <FaTelegram className="footer-icon" />
        </a>
        <span className="footer-text">DoomsProject</span>
        <span className="footer-text">© 2024 FilmAdviser. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default memo(Footer);
