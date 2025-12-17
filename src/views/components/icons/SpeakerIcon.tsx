import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

interface SpeakerIconProps extends BaseIconProps {
  /** Уровень звука (0-3) */
  volumeLevel?: 0 | 1 | 2 | 3;
  /** Показывать перечеркнутый значок при volumeLevel = 0 */
  showMuteIcon?: boolean;
}

const SpeakerIcon: React.FC<SpeakerIconProps> = ({
  size = 20,
  strokeColor = '#AAAAAA',
  strokeWidth = 1,
  fillColor = 'none',
  volumeLevel = 1,
  showMuteIcon = true,
  isActive = false,
  className = '',
  style,
  label = 'Звук',
  variant = 'default',
  ...props
}) => {
  const activeColor = isActive ? '#FC6D3E' : strokeColor;
  const isMuted = volumeLevel === 0;
  
  // Определяем, какие волны показывать
  const showWave1 = volumeLevel >= 1;  // Самая маленькая волна (ближе к динамику)
  const showWave2 = volumeLevel >= 2;  // Средняя волна
  const showWave3 = volumeLevel >= 3;  // Самая большая волна

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      className={`icon speaker-icon volume-${volumeLevel} ${isMuted ? 'muted' : ''} ${className}`.trim()}
      style={style}
      aria-label={`${label}: уровень ${volumeLevel}`}
      role="img"
      {...props}
    >
      <title>{`${label}: ${isMuted ? 'Выкл' : `Уровень ${volumeLevel}/3`}`}</title>
      
      {/* ===== ВОЛНЫ (от самой большой к самой маленькой) ===== */}
      
      {/* ВОЛНА 3: Самая большая внешняя дуга */}
      {showWave3 && (
        <path
          d="M15 5C15.6341 5.65661 16.1371 6.43612 16.4802 7.29402C16.8234 8.15192 17 9.07141 17 10C17 10.9286 16.8234 11.8481 16.4802 12.706C16.1371 13.5639 15.6341 14.3434 15 15"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="speaker-wave wave-large"
        />
      )}
      
      {/* ВОЛНА 2: Средняя дуга */}
      {showWave2 && (
        <path
          d="M14 7C14.317 7.39397 14.5685 7.86167 14.7401 8.37641C14.9117 8.89115 15 9.44285 15 10C15 10.5572 14.9117 11.1088 14.7401 11.6236C14.5685 12.1383 14.317 12.606 14 13"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="speaker-wave wave-medium"
        />
      )}
      
      {/* ===== ДИНАМИК (основная часть) ===== */}
      
      {/* Корпус динамика (треугольная часть) */}
      <path
        d="M6 12.5H3C2.86739 12.5 2.74021 12.4473 2.64645 12.3536C2.55268 12.2598 2.5 12.1326 2.5 12V8C2.5 7.86739 2.55268 7.74021 2.64645 7.64645C2.74021 7.55268 2.86739 7.5 3 7.5H6L10.5 4V16L6 12.5Z"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="speaker-body"
      />
      
      {/* Внутренняя перегородка динамика */}
      <path
        d="M6 7.5V12.5"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="speaker-inner"
      />
      
      {/* ===== ВОЛНА 1: Самая маленькая волна (исходит из динамика) ===== */}
      {showWave1 && (
        <path
          d="M12.9124 8.58582C13.0981 8.77153 13.2454 8.99201 13.3459 9.23466C13.4464 9.47731 13.4981 9.73739 13.4981 10C13.4981 10.2627 13.4464 10.5227 13.3459 10.7654C13.2454 11.008 13.0981 11.2285 12.9124 11.4142"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="speaker-wave wave-small"
        />
      )}
      
      {/* ===== КРЕСТИК (только при volumeLevel = 0) ===== */}
      {isMuted && showMuteIcon && (
        <g className="speaker-mute-cross">
          <line
            x1="12"
            y1="5"
            x2="16"
            y2="9"
            stroke="#FF3333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="5"
            x2="12"
            y2="9"
            stroke="#FF3333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
};

SpeakerIcon.displayName = 'SpeakerIcon';

export default SpeakerIcon;