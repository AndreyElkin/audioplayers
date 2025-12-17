import { apiService } from './Api.service';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/User.model';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/register', data);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/login', data);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setAuth(token: string, user: User): void {
    console.log('[AuthService] setAuth called:', {
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...',
      user,
      storageKey: STORAGE_KEYS.TOKEN
    });
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    console.log('[AuthService] Token saved to localStorage');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

