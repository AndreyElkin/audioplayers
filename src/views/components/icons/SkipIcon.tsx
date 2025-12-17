import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

interface SkipIconProps extends BaseIconProps {
  /** Направление: forward (вперед) или backward (назад) */
  direction?: 'forward' | 'backward';
  /** Отключенное состояние */
  disabled?: boolean;
  /** Анимировать при активной перемотке */
  animate?: boolean;
}

const SkipIcon: React.FC<SkipIconProps> = ({
  size = 24,
  strokeColor = '#000000',
  strokeWidth = 1,
  fillColor = '#000000',
  direction = 'forward',
  disabled = false,
  animate = false,
  isActive = false,
  className = '',
  style,
  label = 'Быстрая перемотка',
  variant = 'default',
  ...props
}) => {
  const iconColor = disabled ? '#CCCCCC' : (isActive ? '#FC6D3E' : fillColor);
  
  // Поворот для направления "backward" (быстрая перемотка назад)
  const rotation = direction === 'backward' ? 180 : 0;
  
  const getLabel = () => {
    return direction === 'forward' ? 'Быстрая перемотка вперед' : 'Быстрая перемотка назад';
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill={iconColor}
      xmlns="http://www.w3.org/2000/svg"
      className={`icon fast-forward-icon ${direction} ${animate ? 'animate' : ''} ${disabled ? 'disabled' : ''} ${className}`.trim()}
      style={{
        transform: `rotate(${rotation}deg)`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        ...style,
      }}
      aria-label={label || getLabel()}
      role="img"
      {...props}
    >
      <title>{label || getLabel()}</title>
      
      <path
        d="M825.8 498L538.4 249.9c-10.7-9.2-26.4-.9-26.4 14v496.3c0 14.9 15.7 23.2 26.4 14L825.8 526c8.3-7.2 8.3-20.8 0-28zm-320 0L218.4 249.9c-10.7-9.2-26.4-.9-26.4 14v496.3c0 14.9 15.7 23.2 26.4 14L505.8 526c4.1-3.6 6.2-8.8 6.2-14 0-5.2-2.1-10.4-6.2-14z"
      />
    </svg>
  );
};

SkipIcon.displayName = 'FastForwardIcon';

export default SkipIcon;
