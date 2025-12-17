import { formatTime } from './helpers';

export const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return '0:00';
  return formatTime(seconds);
};

export const formatFileSize = (mb: number | undefined): string => {
  if (!mb) return '0 MB';
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  return `${mb.toFixed(2)} MB`;
};

