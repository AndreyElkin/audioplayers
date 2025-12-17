import React, { useState, useRef } from 'react';
import { usePlayerStore } from '../../../../stores/player.store';
import { playerController } from '../../../../controllers/Player.controller';
import { SpeakerIcon } from '../../icons'
import './VolumeControl.css';

export const VolumeControl: React.FC = () => {
  const { volume } = usePlayerStore();
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(volume);

  // Преобразуем volume (0-1) в volumeLevel (0-3)
  const getVolumeLevel = (vol: number): 0 | 1 | 2 | 3 => {
    if (vol === 0) return 0;
    if (vol <= 0.33) return 1;
    if (vol <= 0.66) return 2;
    return 3;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    playerController.setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      playerController.setVolume(previousVolume.current || 0.5);
      setIsMuted(false);
    } else {
      previousVolume.current = volume;
      playerController.setVolume(0);
      setIsMuted(true);
    }
  };

  const displayVolume = isMuted || volume === 0 ? 0 : volume;
  const volumeLevel = getVolumeLevel(displayVolume);

  return (
    <div className="volume-control">
      <button
        className="volume-control__button"
        onClick={handleMuteToggle}
        aria-label={isMuted || volume === 0 ? 'Включить звук' : 'Выключить звук'}
      >
        <SpeakerIcon 
          volumeLevel={volumeLevel}
          size={30}
          showMuteIcon={true}
        />
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        className="volume-control__slider"
        aria-label="Громкость"
      />
    </div>
  );
};

