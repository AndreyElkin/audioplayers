/**
 * Сервис для кэширования полных аудио данных
 * Использует короткую строку encoded_audio как ключ для получения полного аудио
 */

interface AudioCacheEntry {
  fullAudioBase64: string;
  timestamp: number;
}

class AudioCacheService {
  private cache: Map<string, AudioCacheEntry> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

  /**
   * Конвертирует ArrayBuffer в base64 строку
   * Аналогично функционалу https://base64.guru/converter/encode/audio
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Загружает аудио файл и конвертирует его в base64
   * Использует тот же принцип, что и https://base64.guru/converter/encode/audio
   */
  private async loadAudioFileAndConvertToBase64(audioUrl: string): Promise<string> {
    console.log('[AudioCache] Loading audio file from:', audioUrl);
    
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to load audio: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('[AudioCache] Audio file loaded, size:', arrayBuffer.byteLength, 'bytes');
      
      // Конвертируем в base64 (как на base64.guru)
      const base64 = this.arrayBufferToBase64(arrayBuffer);
      console.log('[AudioCache] Converted to base64, length:', base64.length);
      
      return base64;
    } catch (error) {
      console.error('[AudioCache] Error loading/converting audio file:', error);
      throw error;
    }
  }

  /**
   * Получает полное аудио по короткой строке (идентификатору)
   * 
   * ЛОГИКА РАБОТЫ:
   * 1. Получаем с сервера короткую строку encoded_audio (тестовые данные)
   * 2. Используем эту строку как ключ/идентификатор для получения полного аудио файла
   * 3. Загружаем аудио файл (MP3, WAV и т.д.)
   * 4. Конвертируем его в base64 на клиенте (как на base64.guru)
   * 5. Кэшируем полное аудио для повторного использования
   * 6. Подменяем короткую строку на полную перед воспроизведением
   * 
   * ВАРИАНТЫ РЕАЛИЗАЦИИ:
   * 1. API endpoint возвращает URL аудио файла: GET /api/audio/{shortKey} -> { audioUrl: "..." }
   * 2. API endpoint возвращает base64 напрямую: GET /api/audio/{shortKey} -> { fullAudioBase64: "..." }
   * 3. Использовать короткую строку как часть URL: /audio/{shortKey}.mp3
   */
  private async fetchFullAudio(shortKey: string): Promise<string> {
    console.log('[AudioCache] Fetching full audio for key:', shortKey.substring(0, 50) + '...');
    
    // ВАРИАНТ 1: Загрузить аудио файл и конвертировать в base64 (как на base64.guru)
    // TODO: В реальном приложении заменить на реальный URL аудио файла:
    // const audioUrl = `/api/audio/${encodeURIComponent(shortKey)}.mp3`;
    // или
    // const response = await apiService.get<{ audioUrl: string }>(`/audio/${encodeURIComponent(shortKey)}`);
    // const audioUrl = response.audioUrl;
    
    // Временное решение: используем тестовый MP3 файл
    try {
      // Сначала пытаемся загрузить MP3 файл и конвертировать его в base64
      const audioUrl = '/test_audio.mp3';
      const base64 = await this.loadAudioFileAndConvertToBase64(audioUrl);
      return base64;
    } catch (error) {
      console.warn('[AudioCache] Could not load MP3 file, trying base64 file:', error);
      
      // Fallback: используем уже готовый base64 файл
      try {
        const response = await fetch('/test_audio_base64.txt');
        if (response.ok) {
          const fullAudio = await response.text();
          console.log('[AudioCache] Loaded test audio base64, length:', fullAudio.length);
          return fullAudio.trim();
        }
      } catch (fallbackError) {
        console.warn('[AudioCache] Could not load test audio base64 file:', fallbackError);
      }
    }
    
    // Fallback: возвращаем короткую строку (в реальном приложении это должна быть ошибка)
    console.warn('[AudioCache] Using short key as fallback');
    return shortKey;
  }

  /**
   * Получает полное аудио из кэша или загружает его
   */
  async getFullAudio(shortKey: string): Promise<string> {
    // Проверяем кэш
    const cached = this.cache.get(shortKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('[AudioCache] Using cached audio for key:', shortKey.substring(0, 50) + '...');
      return cached.fullAudioBase64;
    }

    // Загружаем полное аудио
    console.log('[AudioCache] Cache miss, fetching full audio...');
    const fullAudio = await this.fetchFullAudio(shortKey);
    
    // Сохраняем в кэш
    this.cache.set(shortKey, {
      fullAudioBase64: fullAudio,
      timestamp: Date.now(),
    });

    return fullAudio;
  }

  /**
   * Очищает кэш
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[AudioCache] Cache cleared');
  }

  /**
   * Очищает устаревшие записи из кэша
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }
}

export const audioCacheService = new AudioCacheService();

