import React from 'react';
import { usePlayerStore } from '../../../../stores/player.store';
import { playerController } from '../../../../controllers/Player.controller';
import { PlayIcon, PauseIcon, NextTrackIcon, RandomIcon, RepeatIcon, SkipIcon } from '../../icons';
import './PlayerControls.css';

export const PlayerControls: React.FC = () => {
  const { isPlaying, repeatMode, shuffleMode, playlist, currentIndex } = usePlayerStore();
  
  // Проверяем, является ли трек первым или последним
  // Учитываем режим повтора: при repeatMode === 'all' кнопки всегда активны
  const isFirstTrack = currentIndex === 0 && repeatMode !== 'all';
  const isLastTrack = currentIndex === playlist.length - 1 && repeatMode === 'none';

  return (
    <div className="player-controls">
      <button
        className={`player-controls__button player-controls__button--mobile ${shuffleMode ? 'player-controls__button--active' : ''}`}
        onClick={() => playerController.toggleShuffle()}
        aria-label="Перемешать"
      >
        <RandomIcon 
          size={20} 
          isActive={shuffleMode}
          fillColor={shuffleMode ? '#FC6D3E' : '#AAAAAA'}
        />
      </button>

      <button
        className={`player-controls__button player-controls__button--mobile player-controls__button--prev ${isFirstTrack ? 'player-controls__button--disabled' : ''}`}
        onClick={() => !isFirstTrack && playerController.previous()}
        aria-label="Предыдущий трек"
        disabled={isFirstTrack}
      >
        <NextTrackIcon 
          size={20} 
          direction="left"
          fillColor={isFirstTrack ? "#CCCCCC" : "#AAAAAA"}
        />
      </button>

      <button
        className="player-controls__button player-controls__button--mobile player-controls__button--skip-backward"
        onClick={() => playerController.skipBackward()}
        aria-label="Перемотка назад на 10 секунд"
      >
        <SkipIcon 
          size={30} 
          direction="backward"
          fillColor="#AAAAAA"
        />
      </button>

      <button
        className={`player-controls__button player-controls__button--play ${isPlaying ? 'player-controls__button--playing' : ''}`}
        onClick={() => playerController.togglePlayPause()}
        aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}
      >
        {isPlaying ? (
          <PauseIcon 
            size={40}
            fillColor="#FFFFFF"
          />
        ) : (
          <PlayIcon 
            size={40}
            state="play"
            showCircle={true}
            iconColor="currentColor"
          />
        )}
      </button>

      <button
        className="player-controls__button player-controls__button--mobile player-controls__button--skip-forward"
        onClick={() => playerController.skipForward()}
        aria-label="Перемотка вперед на 10 секунд"
      >
        <SkipIcon 
          size={30} 
          direction="forward"
          fillColor="#AAAAAA"
        />
      </button>

      <button
        className={`player-controls__button player-controls__button--mobile player-controls__button--next ${isLastTrack ? 'player-controls__button--disabled' : ''}`}
        onClick={() => !isLastTrack && playerController.next()}
        aria-label="Следующий трек"
        disabled={isLastTrack}
      >
        <NextTrackIcon 
          size={20} 
          direction="right"
          fillColor={isLastTrack ? "#CCCCCC" : "#AAAAAA"}
        />
      </button>

      <button
        className={`player-controls__button player-controls__button--mobile ${repeatMode !== 'none' ? 'player-controls__button--active' : ''}`}
        onClick={() => playerController.toggleRepeat()}
        aria-label={repeatMode === 'one' ? 'Повтор одного трека' : 'Повтор'}
        style={{ position: 'relative' }}
      >
        <RepeatIcon 
          size={20}
          isActive={repeatMode !== 'none'}
          fillColor={repeatMode !== 'none' ? '#FC6D3E' : '#AAAAAA'}
          label={repeatMode === 'one' ? 'Повтор одного трека' : 'Повтор'}
        />
        {repeatMode === 'one' && (
          <span style={{
            position: 'absolute',
            fontSize: '8px',
            fontWeight: 'bold',
            color: '#FC6D3E',
            bottom: '4px',
            right: '4px',
            lineHeight: '1'
          }}>1</span>
        )}
      </button>
    </div>
  );
};

