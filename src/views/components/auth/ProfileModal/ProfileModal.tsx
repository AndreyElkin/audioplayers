import React, { useEffect } from 'react';
import { useAuthStore } from '../../../../stores/auth.store';
import { Button } from '../../ui/Button/Button';
import './ProfileModal.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2 className="profile-modal-title">Профиль пользователя</h2>
          <button className="profile-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="profile-modal-body">
          <div className="profile-modal-avatar">
            {user?.username.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-modal-info">
            <div className="profile-modal-field">
              <span className="profile-modal-label">Имя пользователя:</span>
              <span className="profile-modal-value">{user?.username || 'Не указано'}</span>
            </div>
          </div>
          <div className="profile-modal-actions">
            <Button onClick={handleLogout} className="profile-modal-logout-button">
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
