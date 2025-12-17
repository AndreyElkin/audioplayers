import { useAuthStore } from '../stores/auth.store';
import { usePlayerStore } from '../stores/player.store';
import { useTracksStore } from '../stores/tracks.store';

/**
 * Главный контроллер приложения
 * Координирует работу всех модулей
 */
export class AppController {
  /**
   * Инициализация приложения
   * Проверяет авторизацию и загружает начальные данные
   */
  async initialize(): Promise<void> {
    const { checkAuth } = useAuthStore.getState();
    checkAuth();

    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      await this.loadInitialData();
    }
  }

  /**
   * Загрузка начальных данных для авторизованного пользователя
   */
  private async loadInitialData(): Promise<void> {
    const { fetchTracks, fetchFavorites } = useTracksStore.getState();
    
    try {
      // Сначала загружаем избранное, потом треки для правильной синхронизации
      await fetchFavorites();
      await fetchTracks();
    } catch (error) {
      console.error('Ошибка загрузки начальных данных:', error);
    }
  }

  /**
   * Очистка данных при выходе
   */
  cleanup(): void {
    const { pause } = usePlayerStore.getState();
    pause();
  }
}

export const appController = new AppController();

