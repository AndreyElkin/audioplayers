import React from 'react';
import type { BaseIconProps } from '../../../types/icon';

interface PlayIconProps extends BaseIconProps {
  /** Состояние: play (треугольник) или pause (две линии) */
  state?: 'play' | 'pause';
  /** Размер круга-фона */
  circleSize?: number;
  /** Цвет круга-фона */
  circleColor?: string;
  /** Цвет иконки внутри */
  iconColor?: string;
  /** Показывать круг-фон */
  showCircle?: boolean;
}

const PlayIcon: React.FC<PlayIconProps> = ({
  size = 40,
  strokeColor = '#AAAAAA',
  strokeWidth = 1,
  fillColor = 'none',
  state = 'play',
  circleSize = 40,
  circleColor = '#AAAAAA',
  iconColor = 'white',
  showCircle = true,
  isActive = false,
  className = '',
  style,
  label = 'Воспроизвести',
  variant = 'default',
  ...props
}) => {
  const activeCircleColor = isActive ? '#FC6D3E' : circleColor;
  const computedIconColor = iconColor || 'white';
  const isPaused = state === 'pause';

  // Для pause состояния нужен другой путь
  const getIconPath = () => {
    if (isPaused) {
      // Две вертикальные линии для pause
      return (
        <>
          <rect x="15" y="12" width="4" height="16" rx="1" fill={computedIconColor} />
          <rect x="21" y="12" width="4" height="16" rx="1" fill={computedIconColor} />
        </>
      );
    }
    
    // Треугольник для play - увеличиваем только когда нет круга
    const triangleScale = showCircle ? 1 : 1.25;
    return (
      <g transform={`translate(20 20) scale(${triangleScale}) translate(-20 -20)`}>
        <path
          d="M27.0385 21.4138C26.9679 21.4862 26.7012 21.7962 26.4528 22.0512C24.9963 23.655 21.197 26.28 19.2085 27.0813C18.9065 27.21 18.143 27.4825 17.735 27.5C17.3441 27.5 16.9715 27.41 16.6159 27.2275C16.1727 26.9725 15.8171 26.5713 15.6223 26.0975C15.4968 25.7688 15.302 24.785 15.302 24.7675C15.1072 23.6913 15 21.9425 15 20.01C15 18.1688 15.1072 16.4913 15.2667 15.3988C15.2849 15.3812 15.4798 14.1588 15.6929 13.74C16.0838 12.975 16.8473 12.5 17.6644 12.5H17.735C18.2672 12.5187 19.3863 12.9938 19.3863 13.0113C21.2677 13.8138 24.9793 16.31 26.471 17.9688C26.471 17.9688 26.8911 18.395 27.0738 18.6613C27.3587 19.0437 27.5 19.5175 27.5 19.9913C27.5 20.52 27.3405 21.0125 27.0385 21.4138Z"
          fill={computedIconColor}
        />
      </g>
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon play-icon ${state} ${showCircle ? 'with-circle' : ''} ${className}`.trim()}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style,
      }}
      aria-label={isPaused ? 'Пауза' : label}
      role="button"
      {...props}
    >
      <title>{isPaused ? 'Пауза' : label}</title>
      
      {/* Круг-фон */}
      {showCircle && (
        <rect
          width={circleSize}
          height={circleSize}
          rx={circleSize / 2}
          fill={activeCircleColor}
        />
      )}
      
      {/* Иконка внутри */}
      {getIconPath()}
    </svg>
  );
};

PlayIcon.displayName = 'PlayIcon';

export default PlayIcon;