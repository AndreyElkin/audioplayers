import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

interface DotsIconProps extends BaseIconProps {
  /** Расположение точек */
  orientation?: 'horizontal' | 'vertical';
}

const DotsIcon: React.FC<DotsIconProps> = ({
  size = 23,
  strokeColor = '#C4C4C4',
  strokeWidth = 1,
  fillColor = '#C4C4C4',
  orientation = 'horizontal',
  isActive = false,
  className = '',
  style,
  label = 'Меню',
  variant = 'default',
  ...props
}) => {
  const activeColor = isActive ? '#FC6D3E' : fillColor;
  
  // Горизонтальная версия (по умолчанию)
  const horizontalSVG = (
    <svg
      width={size}
      height="4"
      viewBox="0 0 23 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon dots-icon horizontal ${className}`.trim()}
      style={style}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      <circle cx="2" cy="2" r="2" fill={activeColor} />
      <circle cx="11.5" cy="2" r="2" fill={activeColor} />
      <circle cx="21" cy="2" r="2" fill={activeColor} />
    </svg>
  );

  // Вертикальная версия
  const verticalSVG = (
    <svg
      width="4"
      height={size}
      viewBox="0 0 4 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon dots-icon vertical ${className}`.trim()}
      style={style}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      <circle cx="2" cy="2" r="2" fill={activeColor} />
      <circle cx="2" cy="11.5" r="2" fill={activeColor} />
      <circle cx="2" cy="21" r="2" fill={activeColor} />
    </svg>
  );

  return orientation === 'horizontal' ? horizontalSVG : verticalSVG;
};

export default DotsIcon;