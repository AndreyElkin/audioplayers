import React, { useRef, useState } from 'react';
import { usePlayerStore } from '../../../../stores/player.store';
import { playerController } from '../../../../controllers/Player.controller';
import { formatTime } from '../../../../utils/helpers';
import './ProgressBar.css';

export const ProgressBar: React.FC = () => {
  const { currentTime, duration } = usePlayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    playerController.seek(newTime);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;
    playerController.seek(newTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="progress-bar">
      <span className="progress-bar__time">{formatTime(currentTime)}</span>
      <div
        ref={progressRef}
        className="progress-bar__track"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="progress-bar__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="progress-bar__time">{formatTime(duration)}</span>
    </div>
  );
};

