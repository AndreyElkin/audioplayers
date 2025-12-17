import React from 'react';
import type { Track } from '../../../../../models/Track.model';
import { formatDate } from '../../../../../utils/helpers';
import { CalendarIcon, ClockIcon, HeartIcon, DotsIcon } from '../../../../components/icons';
import './TracksTable.css';

interface TracksTableProps {
  tracks: Track[];
  currentPage: number;
  onPlay: (trackId: string) => void;
  onToggleFavorite: (trackId: string, isFavorite: boolean) => void;
}

export const TracksTable: React.FC<TracksTableProps> = ({
  tracks,
  currentPage,
  onPlay,
  onToggleFavorite,
}) => {
  return (
    <div className="tracks-table">
      <div className="tracks-table__header">
        <div className="tracks-table__col tracks-table__col--number">№</div>
        <div className="tracks-table__col tracks-table__col--name">НАЗВАНИЕ</div>
        <div className="tracks-table__col tracks-table__col--album">АЛЬБОМ</div>
        <div className="tracks-table__col tracks-table__col--date">
          <CalendarIcon />
        </div>
        <div className="tracks-table__col tracks-table__col--duration">
          <ClockIcon />
        </div>
        <div className="tracks-table__col tracks-table__col--actions"></div>
      </div>
      <div className="tracks-table__body">
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            className="tracks-table__row"
            onClick={() => onPlay(track.id)}
          >
            <div className="tracks-table__col tracks-table__col--number">
              {(currentPage - 1) * 20 + index + 1}
            </div>
            <div className="tracks-table__col tracks-table__col--name">
              <div className="tracks-table__track-info">
                <div className="tracks-table__artwork">
                  {track.album ? (
                    <img src={track.album} alt={track.title} />
                  ) : (
                    <div className="tracks-table__artwork--placeholder" />
                  )}
                </div>
                <div className="tracks-table__track-details">
                  <div className="tracks-table__track-title">{track.title}</div>
                  <div className="tracks-table__track-artist">{track.artist}</div>
                </div>
              </div>
            </div>
            <div className="tracks-table__col tracks-table__col--album">
              {track.artist || '-'}
            </div>
            <div className="tracks-table__col tracks-table__col--date">
              {track.addedDate ? formatDate(track.addedDate) : '-'}
            </div>
           
            <div className="tracks-table__col tracks-table__col--actions">
              <button
                className={`tracks-table__favorite ${track.isFavorite ? 'tracks-table__favorite--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('[TracksTable] Click on favorite button:', {
                    trackId: track.id,
                    trackTitle: track.title,
                    isFavorite: track.isFavorite,
                    willToggleTo: !track.isFavorite
                  });
                  onToggleFavorite(track.id, !!track.isFavorite);
                }}
                aria-label={track.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                <HeartIcon 
                  filled={!!track.isFavorite} 
                  isActive={!!track.isFavorite}
                  activeColor="#FC6D3E"
                />
              </button>
              <div className="tracks-table__col tracks-table__col--duration">
                {track.duration}
              </div>
              <button
                className="tracks-table__play"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(track.id);
                }}
                aria-label="Воспроизвести"
              >
                <DotsIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

