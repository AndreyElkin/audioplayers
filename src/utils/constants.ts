// В режиме разработки используем прокси через Vite, в продакшене - прямой URL
export const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:8000/api';

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user',
} as const;

export const SKIP_TIME = 10; // seconds

export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  MOBILE_ITEMS_PER_PAGE: 10,
} as const;

