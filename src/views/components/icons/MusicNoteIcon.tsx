import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

interface MusicNoteIconProps extends BaseIconProps {
  /** Цвет нотных головок (если отличается) */
  noteHeadColor?: string;
  /** Цвет нотных штилей (если отличается) */
  stemColor?: string;
}

const MusicNoteIcon: React.FC<MusicNoteIconProps> = ({
  size = 32,
  strokeColor = '#FC6D3E',
  strokeWidth = 2,
  fillColor = 'none',
  noteHeadColor,
  stemColor,
  isActive = false,
  className = '',
  style,
  label = 'Музыкальная нота',
  variant = 'default',
  ...props
}) => {
  const computedNoteHeadColor = noteHeadColor || (isActive ? '#FF4500' : strokeColor);
  const computedStemColor = stemColor || (isActive ? '#FF4500' : strokeColor);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      className={`icon music-note-icon ${className}`.trim()}
      style={style}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      
      {/* Правая нота (более крупная) */}
      <path
        d="M22.5 25C24.433 25 26 23.433 26 21.5C26 19.567 24.433 18 22.5 18C20.567 18 19 19.567 19 21.5C19 23.433 20.567 25 22.5 25Z"
        stroke={computedNoteHeadColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Левая нота (меньше) */}
      <path
        d="M6.5 29C8.433 29 10 27.433 10 25.5C10 23.567 8.433 22 6.5 22C4.567 22 3 23.567 3 25.5C3 27.433 4.567 29 6.5 29Z"
        stroke={computedNoteHeadColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Лига (соединение между нотами) */}
      <path
        d="M26 10L10 14"
        stroke={computedStemColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Штили нот */}
      <path
        d="M10 25.5V8L26 4V21.5"
        stroke={computedStemColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

MusicNoteIcon.displayName = 'MusicNoteIcon';

export default MusicNoteIcon;