// src/components/RegisterButton.tsx
import React from 'react';
import '../styles/RegisterButton.css';

const RegisterButton: React.FC = () => {
  // Функция, которая будет вызвана при клике на кнопку
  const handleRegister = () => {
    // Тут будет логика открытия формы регистрации
    console.log('Open registration form');
  };

  return (
    <button className="register-btn" onClick={handleRegister}>
      Register
    </button>
  );
};

export default RegisterButton;
export {};