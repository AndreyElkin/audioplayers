import { create } from 'zustand';
import type { User } from '../models/User.model';
import { authService } from '../services/Auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showProfileAfterAuth: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
  setShowProfileAfterAuth: (show: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  showProfileAfterAuth: false,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ username, password });
      if (response.token) {
        const user = { username };
        authService.setAuth(response.token, user);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          showProfileAfterAuth: false,
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Ошибка авторизации',
      });
    }
  },

  register: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({ username, password });
      // Сервер при регистрации не возвращает токен, нужно логиниться после регистрации
      if (response.user) {
        // После успешной регистрации автоматически логинимся
        const loginResponse = await authService.login({ username, password });
        if (loginResponse.token) {
          authService.setAuth(loginResponse.token, response.user);
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          showProfileAfterAuth: false,
        });
        } else {
          throw new Error('Регистрация прошла успешно, но не удалось войти. Попробуйте войти вручную.');
        }
      } else {
        throw new Error(response.message || 'Ошибка регистрации');
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Ошибка регистрации',
      });
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      showProfileAfterAuth: false,
    });
  },

  checkAuth: () => {
    const user = authService.getUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user, isAuthenticated });
  },

  clearError: () => set({ error: null }),
  setShowProfileAfterAuth: (show: boolean) => set({ showProfileAfterAuth: show }),
}));

