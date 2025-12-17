export type IconSize = 16 | 20 | 24 | 32 | 40 | 48 | 64;
export type StrokeWidth = 1 | 2 | 3 | 4;
export type IconColor = `#${string}` | 'currentColor' | 'inherit';
export type IconVariant = 'default' | 'bold' | 'outline' | 'filled';

export interface BaseIconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'width' | 'height' | 'stroke' | 'strokeWidth' | 'fill'
> {
  /** Размер иконки */
  size?: IconSize | number;
  /** Цвет обводки */
  strokeColor?: IconColor;
  /** Толщина обводки */
  strokeWidth?: StrokeWidth | number;
  /** Цвет заливки (если используется) */
  fillColor?: IconColor | 'none';
  /** CSS класс */
  className?: string;
  /** Инлайн стили */
  style?: React.CSSProperties;
  /** Активное состояние */
  isActive?: boolean;
  /** Текст для accessibility */
  label?: string;
  /** Вариант иконки */
  variant?: IconVariant;
}