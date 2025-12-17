import { useAuthStore } from '../stores/auth.store';

export class AuthController {
  async login(username: string, password: string): Promise<void> {
    const { login } = useAuthStore.getState();
    await login(username, password);
  }

  async register(username: string, password: string): Promise<void> {
    const { register } = useAuthStore.getState();
    await register(username, password);
  }

  logout(): void {
    const { logout } = useAuthStore.getState();
    logout();
  }

  checkAuth(): void {
    const { checkAuth } = useAuthStore.getState();
    checkAuth();
  }
}

export const authController = new AuthController();

