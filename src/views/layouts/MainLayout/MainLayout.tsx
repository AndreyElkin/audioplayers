import React from 'react';
import { useAuthStore } from '../../../stores/auth.store';
import { Header } from '../../components/layout/Header/Header';
import { Sidebar } from '../../components/layout/Sidebar/Sidebar';
import { AudioPlayer } from '../../components/player/AudioPlayer/AudioPlayer';
import { AuthModal } from '../../components/auth/AuthModal/AuthModal';
import { ProfileModal } from '../../components/auth/ProfileModal/ProfileModal';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, showProfileAfterAuth, setShowProfileAfterAuth } = useAuthStore();

  const handleCloseProfile = () => {
    setShowProfileAfterAuth(false);
  };

  return (
    <div className="main-layout">
      <div className="main-layout__wrapper">
        <Sidebar />
        <div className="main-layout__content">
          <Header />
          <main className="main-layout__main">{children}</main>
        </div>
      </div>
      <AudioPlayer />
      <AuthModal isOpen={!isAuthenticated} />
      {isAuthenticated && (
        <ProfileModal isOpen={showProfileAfterAuth} onClose={handleCloseProfile} />
      )}
    </div>
  );
};

