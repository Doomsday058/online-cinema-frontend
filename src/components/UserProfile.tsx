import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import '../styles/UserProfile.css'; // Создадим этот файл ниже
import { NODE_API_URL } from '../apiConfig';


const UserProfile: React.FC = () => {
  const { userId } = useUser();
  const [userData, setUserData] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId === null) return;

      try {
        const response = await fetch(`${NODE_API_URL}/api/users/${userId}`);
        if (!response.ok) throw new Error('Не удалось получить данные пользователя');

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (userId === null) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="user-profile-container">
      <h2>Профиль пользователя</h2>
      {userData ? (
        <div className="user-info">
          <p><strong>Имя пользователя:</strong> {userData.username}</p>
          {/* Добавьте дополнительные поля по необходимости */}
        </div>
      ) : (
        <div>Загрузка данных пользователя...</div>
      )}
    </div>
  );
};

export default UserProfile;