import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracksStore } from '../../../stores/tracks.store';
import { tracksController } from '../../../controllers/Tracks.controller';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tracks, isLoading } = useTracksStore();

  useEffect(() => {
    tracksController.loadTracks();
  }, []);

  useEffect(() => {
    // Перенаправляем на страницу треков после загрузки
    if (!isLoading && tracks.length > 0) {
      navigate('/tracks', { replace: true });
    }
  }, [isLoading, tracks, navigate]);

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="home-page__loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1 className="home-page__title">Добро пожаловать в VibeCast Studio</h1>
      <p className="home-page__subtitle">Ваша музыкальная библиотека</p>
    </div>
  );
};

