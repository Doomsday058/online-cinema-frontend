import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/UserMenu.css';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  username: string;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ username, onLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  return (
    <div className="user-menu">
      <div className="user-info">
        <FaUserCircle size={24} className="avatar-icon" />
        <span className="username">{username}</span>
      </div>
      <div className="dropdown-menu">
        <button className="dropdown-item" onClick={handleProfileClick}>Профиль</button>
        <button className="dropdown-item" onClick={handleFavoritesClick}>Избранное</button>
        <button className="dropdown-item" onClick={onLogout}>Выход</button>
      </div>
    </div>
  );
};

export default UserMenu;
