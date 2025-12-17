import React from 'react';
import { usePlayerStore } from '../../../../stores/player.store';
import { useTracksStore } from '../../../../stores/tracks.store';
import { favoritesController } from '../../../../controllers/Favorites.controller';
import { HeartIcon } from '../../icons';
import './TrackInfo.css';

export const TrackInfo: React.FC = () => {
  const { currentTrack } = usePlayerStore();
  const { tracks } = useTracksStore();
  const track = tracks.find((t: typeof tracks[0]) => t.id === currentTrack);

  if (!track) {
    return (
      <div className="track-info">
        <div className="track-info__artwork track-info__artwork--placeholder" />
        <div className="track-info__details">
          <div className="track-info__title">Выберите трек</div>
          <div className="track-info__artist">—</div>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await favoritesController.toggleFavorite(track.id, !!track.isFavorite);
  };

  return (
    <div className="track-info">
      <div className="track-info__artwork">
        {track.album ? (
          <img src={track.album} alt={track.title} />
        ) : (
          <div className="track-info__artwork--placeholder" />
        )}
      </div>
      <div className="track-info__details">
        <div className="track-info__title">{track.title}</div>
        <div className="track-info__artist">{track.artist}</div>
      </div>
      <button
        className={`track-info__favorite ${track.isFavorite ? 'track-info__favorite--active' : ''}`}
        onClick={handleToggleFavorite}
        aria-label={track.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      >
        <HeartIcon 
          filled={!!track.isFavorite} 
          isActive={!!track.isFavorite}
          activeColor="#FC6D3E"
        />
      </button>
    </div>
  );
};

