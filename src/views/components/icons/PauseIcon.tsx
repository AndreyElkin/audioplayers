import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

const PauseIcon: React.FC<BaseIconProps> = ({
  size = 24,
  strokeColor = '#AAAAAA',
  strokeWidth = 1,
  fillColor = '#AAAAAA',
  isActive = false,
  className = '',
  style,
  label = 'Пауза',
  variant = 'default',
  ...props
}) => {
  const iconColor = isActive ? '#FC6D3E' : fillColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon pause-icon ${className}`.trim()}
      style={style}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      
      {/* Две вертикальные линии */}
      <rect x="6" y="5" width="4" height="14" rx="1" fill={iconColor} />
      <rect x="14" y="5" width="4" height="14" rx="1" fill={iconColor} />
    </svg>
  );
};

export default PauseIcon;