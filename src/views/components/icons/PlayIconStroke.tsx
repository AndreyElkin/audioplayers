import React from 'react';
import type{ BaseIconProps } from '../../../types/icon';

interface PlayIconStrokeProps extends BaseIconProps {
  /** Направление стрелки: right (вправо) или left (влево) */
  direction?: 'right' | 'left';
  /** Отключенное состояние */
  disabled?: boolean;
}

const PlayIconStroke: React.FC<PlayIconStrokeProps> = ({
  size = 24,
  strokeColor = 'white',
  strokeWidth = 2,
  fillColor = 'none',
  direction = 'right',
  disabled = false,
  isActive = false,
  className = '',
  style,
  label = 'Воспроизвести',
  variant = 'default',
  ...props
}) => {
  const iconColor = disabled ? '#CCCCCC' : (isActive ? '#FC6D3E' : strokeColor);
  const rotation = direction === 'left' ? 180 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      className={`icon play-icon-stroke ${direction} ${disabled ? 'disabled' : ''} ${className}`.trim()}
      style={{
        transform: `rotate(${rotation}deg)`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.2s ease, stroke 0.2s ease',
        ...style,
      }}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      
      <path
        d="M21.3889 11.36L7.8911 3.11111C7.77741 3.04163 7.64726 3.00369 7.51404 3.0012C7.38083 2.9987 7.24935 3.03174 7.13314 3.09692C7.01692 3.16209 6.92017 3.25705 6.85283 3.37202C6.7855 3.48699 6.75 3.61783 6.75 3.75107V20.2489C6.75 20.3822 6.7855 20.513 6.85283 20.628C6.92017 20.743 7.01692 20.8379 7.13314 20.9031C7.24935 20.9683 7.38083 21.0013 7.51404 20.9988C7.64726 20.9963 7.77741 20.9584 7.8911 20.8889L21.3889 12.64C21.4985 12.573 21.5891 12.4789 21.652 12.3669C21.7148 12.2548 21.7478 12.1285 21.7478 12C21.7478 11.8715 21.7148 11.7452 21.652 11.6331C21.5891 11.5211 21.4985 11.427 21.3889 11.36Z"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

PlayIconStroke.displayName = 'PlayIconStroke';

export default PlayIconStroke;