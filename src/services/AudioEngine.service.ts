class AudioEngineService {
  private audio: HTMLAudioElement | null = null;
  private listeners: Map<string, ((data?: unknown) => void)[]> = new Map();
  private currentBlobUrl: string | null = null;
  private lastPlayTime: number = 0; // Время последнего вызова play()
  private playProtectionTimeout: NodeJS.Timeout | null = null; // Таймер защиты от случайного pause()

  init(): void {
    this.audio = new Audio();
    this.audio.volume = 1; // Устанавливаем громкость по умолчанию
    this.audio.muted = false; // Убеждаемся, что не заглушен
    
    // Добавляем аудио элемент в DOM (скрытый) для лучшей совместимости с браузерами
    this.audio.style.display = 'none';
    this.audio.setAttribute('preload', 'auto');
    this.audio.setAttribute('crossorigin', 'anonymous');
    document.body.appendChild(this.audio);
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('loadedmetadata', () => {
      this.emit('durationchange', this.audio?.duration || 0);
    });

    this.audio.addEventListener('canplay', () => {
      this.emit('canplay');
    });

    this.audio.addEventListener('pause', () => {
      // Если pause() вызван сразу после play() (в течение 500ms), это может быть браузер блокирует автоплей
      const timeSincePlay = Date.now() - this.lastPlayTime;
      if (timeSincePlay < 500) {
        // Пробуем воспроизвести еще раз через небольшую задержку
        setTimeout(() => {
          if (this.audio && this.audio.paused) {
            this.audio.play().catch(() => {
              // Игнорируем ошибки автоплея
            });
          }
        }, 100);
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.emit('timeupdate', this.audio?.currentTime || 0);
    });

    this.audio.addEventListener('ended', () => {
      this.emit('ended');
    });

    this.audio.addEventListener('error', (e) => {
      const error = this.audio?.error;
      console.error('[AudioEngine] Audio error:', error?.code, error?.message);
      this.emit('error', error?.message || 'Ошибка воспроизведения аудио');
    });

    this.audio.addEventListener('stalled', () => {
      // Игнорируем stalled события
    });

    this.audio.addEventListener('waiting', () => {
      // Игнорируем waiting события
    });
  }

  load(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audio) {
        reject(new Error('Audio engine not initialized'));
        return;
      }

      // Останавливаем текущее воспроизведение только если оно действительно играет
      if (!this.audio.paused) {
        this.audio.pause();
      }
      
      // Очищаем предыдущий blob URL, если есть
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
        this.currentBlobUrl = null;
      }

      // Сохраняем новый blob URL, если это blob URL
      if (src.startsWith('blob:')) {
        this.currentBlobUrl = src;
      }

      const onCanPlay = () => {
        this.audio?.removeEventListener('canplay', onCanPlay);
        this.audio?.removeEventListener('error', onError);
        resolve();
      };

      const onError = () => {
        const error = this.audio?.error;
        this.audio?.removeEventListener('canplay', onCanPlay);
        this.audio?.removeEventListener('error', onError);
        
        // Очищаем blob URL при ошибке
        if (this.currentBlobUrl) {
          URL.revokeObjectURL(this.currentBlobUrl);
          this.currentBlobUrl = null;
        }
        
        reject(new Error(error?.message || 'Ошибка загрузки аудио'));
      };

      this.audio.addEventListener('canplay', onCanPlay, { once: true });
      this.audio.addEventListener('error', onError, { once: true });

      this.audio.src = src;
      this.audio.load();
      
      // Убеждаемся, что громкость установлена (по умолчанию 1)
      if (this.audio.volume === 0) {
        this.audio.volume = 1;
      }
    });
  }

  play(): Promise<void> {
    if (!this.audio) {
      return Promise.reject(new Error('Audio element is not initialized'));
    }
    
    // Убеждаемся, что громкость не равна 0
    if (this.audio.volume === 0) {
      this.audio.volume = 1;
    }
    
    // Убеждаемся, что не заглушен
    if (this.audio.muted) {
      this.audio.muted = false;
    }
    
    // Убеждаемся, что src установлен
    if (!this.audio.src) {
      return Promise.reject(new Error('No audio source'));
    }
    
    // Убеждаемся, что readyState достаточен для воспроизведения
    if (this.audio.readyState < 2) {
      // Ждем, пока данные загрузятся
      return new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          this.audio?.removeEventListener('canplay', onCanPlay);
          this.audio?.removeEventListener('error', onError);
          this.play().then(resolve).catch(reject);
        };
        const onError = () => {
          this.audio?.removeEventListener('canplay', onCanPlay);
          this.audio?.removeEventListener('error', onError);
          reject(new Error('Error loading audio data'));
        };
        this.audio.addEventListener('canplay', onCanPlay, { once: true });
        this.audio.addEventListener('error', onError, { once: true });
      });
    }
    
    // Запоминаем время вызова play() для защиты от случайного pause()
    this.lastPlayTime = Date.now();
    
    // Очищаем предыдущий таймер защиты, если есть
    if (this.playProtectionTimeout) {
      clearTimeout(this.playProtectionTimeout);
      this.playProtectionTimeout = null;
    }
    
    // Устанавливаем защиту от случайного pause() на 500ms
    this.playProtectionTimeout = setTimeout(() => {
      this.playProtectionTimeout = null;
    }, 500);
    
    const playPromise = this.audio.play();
    
    if (playPromise !== undefined) {
      return playPromise.catch((error) => {
        throw error;
      });
    }
    
    return Promise.resolve();
  }

  pause(): void {
    if (this.audio) {
      // Не паузим, если уже на паузе
      if (this.audio.paused) {
        return;
      }
      
      // Защита от случайного pause() сразу после play()
      const timeSincePlay = Date.now() - this.lastPlayTime;
      if (timeSincePlay < 500 && this.playProtectionTimeout) {
        return;
      }
      
      this.audio.pause();
    }
  }

  seek(time: number): void {
    if (!this.audio) return;
    this.audio.currentTime = time;
  }

  setVolume(volume: number): void {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  getVolume(): number {
    return this.audio?.volume || 0;
  }

  on(event: string, callback: (data?: unknown) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: (data?: unknown) => void): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        if (typeof callback === 'function') {
          callback(data);
        }
      });
    }
  }

  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      // Удаляем элемент из DOM
      if (this.audio.parentNode) {
        this.audio.parentNode.removeChild(this.audio);
      }
      this.audio = null;
    }
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    this.listeners.clear();
  }
}

export const audioEngine = new AudioEngineService();

