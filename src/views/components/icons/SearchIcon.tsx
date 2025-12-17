import React from 'react';
import type{ BaseIconProps } from '../../../types/icon';

interface SearchIconProps extends BaseIconProps {
  /** Цвет ручки (если отличается) */
  handleColor?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({
  size = 24,
  strokeColor = '#AAAAAA',
  strokeWidth = 2,
  fillColor = 'none',
  handleColor,
  isActive = false,
  className = '',
  style,
  label = 'Поиск',
  variant = 'default',
  ...props
}) => {
  const computedHandleColor = handleColor || strokeColor;
  const activeColor = isActive ? '#FC6D3E' : strokeColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      className={`icon search-icon ${className}`.trim()}
      style={style}
      aria-label={label}
      role="img"
      {...props}
    >
      <title>{label}</title>
      
      <path
        d="M11.5 20C16.1944 20 20 16.1944 20 11.5C20 6.80558 16.1944 3 11.5 3C6.80558 3 3 6.80558 3 11.5C3 16.1944 6.80558 20 11.5 20Z"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <path
        d="M20.9999 21L17.5 17.5001"
        stroke={computedHandleColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;