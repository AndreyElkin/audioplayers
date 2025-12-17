import React from 'react';
import { useAuthStore } from '../../../stores/auth.store';
import { Button } from '../../components/ui/Button/Button';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">Профиль пользователя</h1>
      <div className="profile-page__content">
        <div className="profile-page__avatar">
          {user?.username.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="profile-page__info">
          <div className="profile-page__field">
            <span className="profile-page__label">Имя пользователя:</span>
            <span className="profile-page__value">{user?.username || 'Не указано'}</span>
          </div>
        </div>
        <div className="profile-page__actions">
          <Button onClick={handleLogout} className="profile-page__logout-button">
            Выйти из аккаунта
          </Button>
        </div>
      </div>
    </div>
  );
};

