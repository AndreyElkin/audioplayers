import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import { useAuthStore } from '../stores/auth.store';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Проверяет, является ли ошибка ошибкой авторизации
   * и автоматически разлогинивает пользователя
   */
  private handleAuthError(status: number, errorMessage: string): void {
    const isAuthError = 
      status === 401 || 
      status === 403 || 
      (status === 400 && (
        errorMessage.includes('токен') || 
        errorMessage.includes('некорректный') ||
        errorMessage.includes('доступ запрещен')
      ));

    if (isAuthError) {
      console.warn('[ApiService] Authentication error detected, logging out user');
      // Разлогиниваем пользователя (очищает localStorage и обновляет store)
      const { logout } = useAuthStore.getState();
      logout();
    }
  }

  private getAuthToken(): string | null {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    console.log('[ApiService] getAuthToken:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      storageKey: STORAGE_KEYS.TOKEN
    });
    return token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[ApiService] Authorization header set:', {
        headerValue: `Bearer ${token.substring(0, 20)}...`,
        tokenLength: token.length
      });
    } else {
      console.warn('[ApiService] No token found! Request will be unauthenticated.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log('[ApiService] Request:', {
      method: options.method || 'GET',
      url,
      endpoint,
      hasToken: !!token,
      body: options.body
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'omit',
      });

      console.log('[ApiService] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Произошла ошибка при запросе',
        }));
        console.error('[ApiService] Error response:', error);
        
        // Обработка ошибок авторизации
        this.handleAuthError(response.status, error.message || '');
        
        throw new Error(error.message || 'Произошла ошибка');
      }

      const data = await response.json();
      console.log('[ApiService] Response data:', data);
      return data;
    } catch (error) {
      console.error('[ApiService] Request error:', error);
      if (error instanceof TypeError) {
        if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
          throw new Error('Не удалось подключиться к серверу. Проверьте, что сервер запущен на http://localhost:8000 и CORS настроен правильно.');
        }
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Произошла неизвестная ошибка');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);

