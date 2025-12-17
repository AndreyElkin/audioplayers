import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

interface ArrowIconProps extends BaseIconProps {
  /** Направление стрелки */
  direction?: 'up' | 'down' | 'left' | 'right';
}

const ArrowIcon: React.FC<ArrowIconProps> = ({
  size = 16,
  strokeColor = '#666',
  strokeWidth = 2,
  fillColor = 'none',
  direction = 'right',
  isActive = false,
  className = '',
  style,
  label = 'Стрелка',
  variant = 'default',
  ...props
}) => {
  const activeColor = isActive ? '#FC6D3E' : strokeColor;
  
  // Поворот в зависимости от направления
  const rotation = {
    up: 90,
    right: 0,
    down: 270,
    left: 180,
  }[direction];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      className={`icon arrow-icon ${className}`.trim()}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.2s ease',
        ...style,
      }}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      
      <path
        d="M6 12l4-4-4-4"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;