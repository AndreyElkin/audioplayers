import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

interface ClockIconProps extends BaseIconProps {
  /** Показывать ли циферблат */
  showDial?: boolean;
  /** Цвет стрелок (если отличается от общего цвета) */
  handColor?: string;
}

const ClockIcon: React.FC<ClockIconProps> = ({
  size = 16,
  strokeColor = '#A4A4A4',
  strokeWidth = 1,
  fillColor = 'none',
  showDial = true,
  handColor,
  isActive = false,
  className = '',
  style,
  label = 'Часы',
  variant = 'default',
  ...props
}) => {
  const computedHandColor = handColor || strokeColor;
  const activeColor = isActive ? '#FC6D3E' : strokeColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      className={`icon clock-icon ${className}`.trim()}
      style={style}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      
      {showDial && (
        <path
          d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
        />
      )}
      
      <path
        d="M8 4.5V8H11.5"
        stroke={computedHandColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClockIcon;