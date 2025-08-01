// src/components/LoginButton.tsx
import React from 'react';
import '../styles/LoginButton.css';

interface LoginButtonProps {
  onClick: () => void; // Добавляем тип для нового пропа onClick
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <button className="login-btn" onClick={onClick}>
      Вход/Регистрация
    </button>
  );
};

export default LoginButton;
