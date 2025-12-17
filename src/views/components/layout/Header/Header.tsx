import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../stores/auth.store';
import { ArrowIcon, SearchIcon } from '../../icons';
import logo from '../../../../assets/logo-vcs.png';
import './Header.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, setShowProfileAfterAuth } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileClick = () => {
    setShowProfileAfterAuth(true);
  };

  return (
    <header className="header">
      <div className="header__logo" onClick={() => navigate('/')}>
        <img src={logo} alt="VibeCast Studio" className="header__logo-img" />
      </div>

      <div className="header__search">
        <SearchIcon />
        <input
          type="text"
          placeholder="ЧТО БУДЕМ ИСКАТЬ?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="header__search-input"
        />
      </div>

      <div className="header__user" onClick={handleProfileClick}>
        <div className="header__user-avatar">
          {user?.username.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="header__user-name">{user?.username || 'username'}</span>
        <ArrowIcon
          strokeColor='#FC6D3E'
        />
      </div>
    </header>
  );
};

