import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

interface CalendarIconProps extends BaseIconProps {
  /** Цвет выделения дня (если отличается) */
  dayMarkerColor?: string;
  /** Цвет заголовка/верха календаря */
  headerColor?: string;
}

const CalendarIcon: React.FC<CalendarIconProps> = ({
  size = 16,
  strokeColor = '#A4A4A4',
  strokeWidth = 1,
  fillColor = 'none',
  dayMarkerColor,
  headerColor,
  isActive = false,
  className = '',
  style,
  label = 'Календарь',
  variant = 'default',
  ...props
}) => {
  const computedDayMarkerColor = dayMarkerColor || strokeColor;
  const computedHeaderColor = headerColor || strokeColor;
  const activeColor = isActive ? '#FC6D3E' : strokeColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      className={`icon calendar-icon ${className}`.trim()}
      style={style}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      
      {/* Основная рамка календаря */}
      <path
        d="M13 2.5H3C2.72386 2.5 2.5 2.72386 2.5 3V13C2.5 13.2761 2.72386 13.5 3 13.5H13C13.2761 13.5 13.5 13.2761 13.5 13V3C13.5 2.72386 13.2761 2.5 13 2.5Z"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Правая подвеска/крепление */}
      <path
        d="M11 1.5V3.5"
        stroke={computedHeaderColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Левая подвеска/крепление */}
      <path
        d="M5 1.5V3.5"
        stroke={computedHeaderColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Линия разделения заголовка и дней */}
      <path
        d="M2.5 5.5H13.5"
        stroke={computedDayMarkerColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

CalendarIcon.displayName = 'CalendarIcon';

export default CalendarIcon;