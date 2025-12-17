import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../../../assets/logo-vcs.png';
import { MusicNoteIcon, PlayIconStroke } from '../../icons';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  strokeIcon?: React.ComponentType<any>;
}

const sidebarItems: SidebarItem[] = [
  {
    path: '/tracks',
    label: 'Аудиокомпозиции',
    icon: MusicNoteIcon,
    strokeIcon: PlayIconStroke,
  },
  {
    path: '/favorites',
    label: 'Избранное',
    icon: MusicNoteIcon,
  },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar__logo" onClick={() => navigate('/')}>
        <img src={logo} alt="Логотип компании" />
      </div>
      <nav className="sidebar__nav">
        {sidebarItems.map((item) => {
          // Для /tracks также активна главная страница /
          const isActive = location.pathname === item.path || (item.path === '/tracks' && location.pathname === '/');
          return (
            <button
              key={item.path}
              className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
              onClick={() => navigate(item.path)}
              data-path={item.path}
            >
              <span className="sidebar__icon">
                {React.createElement(item.icon, {
                  size: 32,
                  strokeColor: isActive ? '#ff6b35' : '#11253D',
                  isActive: isActive,
                })}
              </span>
              {item.strokeIcon && (
                <span className="sidebar__icon sidebar__icon--stroke">
                  {React.createElement(item.strokeIcon, {
                    size: 24,
                    strokeColor: isActive ? '#FFFFFF' : '#11253D',
                    isActive: false, // false чтобы использовать strokeColor вместо активного цвета
                  })}
                </span>
              )}
              <span className="sidebar__label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

