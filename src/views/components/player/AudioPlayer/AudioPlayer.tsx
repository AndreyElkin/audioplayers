import React, { useEffect } from 'react';
import { TrackInfo } from '../TrackInfo/TrackInfo';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { VolumeControl } from '../VolumeControl/VolumeControl';
import { usePlayerStore } from '../../../../stores/player.store';
import { playerController } from '../../../../controllers/Player.controller';
import { PlayIcon, PauseIcon } from '../../icons';
import './AudioPlayer.css';

export const AudioPlayer: React.FC = () => {
  const { isPlaying } = usePlayerStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          playerController.togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          playerController.skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          playerController.skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          {
            const { volume } = usePlayerStore.getState();
            playerController.setVolume(Math.min(1, volume + 0.1));
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          {
            const { volume } = usePlayerStore.getState();
            playerController.setVolume(Math.max(0, volume - 0.1));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="audio-player">
      <div className="audio-player__container">
        <div className="audio-player__mobile-wrapper">
          <TrackInfo />
          <button
            className={`audio-player__mobile-play player-controls__button player-controls__button--play ${isPlaying ? 'player-controls__button--playing' : ''}`}
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
        </div>
        <div className="audio-player__center">
          <PlayerControls />
          <ProgressBar />
        </div>
        <VolumeControl />
      </div>
    </div>
  );
};

