import React from 'react';

type PixelSize = `${number}px` | number;

interface DeliveryIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> {
  /** Размер иконки в пикселях или как строку с px */
  size?: PixelSize;
  /** Цвет обводки иконки в формате HEX, RGB, или названием цвета */
  color?: string;
  /** Толщина линий обводки */
  strokeWidth?: number;
  /** CSS-класс для дополнительного стилизации */
  className?: string;
  /** Инлайн-стили */
  style?: React.CSSProperties;
}

const DeliveryIcon: React.FC<DeliveryIconProps> = ({ 
  size = 32,
  color = "#FC6D3E",
  strokeWidth = 2,
  className,
  style,
  ...props 
}) => {
  // Преобразуем размер в число, если он пришел в формате "32px"
  const iconSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <svg 
      width={iconSize}
      height={iconSize}
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Иконка доставки"
      role="img"
      {...props}
    >
      <path 
        d="M22.5 25C24.433 25 26 23.433 26 21.5C26 19.567 24.433 18 22.5 18C20.567 18 19 19.567 19 21.5C19 23.433 20.567 25 22.5 25Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M6.5 29C8.433 29 10 27.433 10 25.5C10 23.567 8.433 22 6.5 22C4.567 22 3 23.567 3 25.5C3 27.433 4.567 29 6.5 29Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M26 10L10 14" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M10 25.5V8L26 4V21.5" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DeliveryIcon;