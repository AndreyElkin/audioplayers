import { create } from 'zustand';
import type { PlayerState, RepeatMode } from '../models/Player.model';
import { audioEngine } from '../services/AudioEngine.service';
import { loadAudioFromEncoded } from '../utils/audioHelpers';
import { useTracksStore } from './tracks.store';

interface PlayerStore extends PlayerState {
  setCurrentTrack: (trackId: string) => Promise<void>;
  setPlaylist: (playlist: string[]) => void;
  play: () => Promise<void>;
  pause: () => void;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  updateTime: (time: number) => void;
  updateDuration: (duration: number) => void;
}

const getNextRepeatMode = (current: RepeatMode): RepeatMode => {
  switch (current) {
    case 'none':
      return 'all';
    case 'all':
      return 'one';
    case 'one':
      return 'none';
  }
};

export const usePlayerStore = create<PlayerStore>((set, get) => {
  // Initialize audio engine
  audioEngine.init();
  // Устанавливаем начальную громкость
  audioEngine.setVolume(1);

  // Setup audio engine listeners
  audioEngine.on('timeupdate', (data?: unknown) => {
    if (typeof data === 'number') {
      get().updateTime(data);
    }
  });

  audioEngine.on('durationchange', (data?: unknown) => {
    if (typeof data === 'number') {
      get().updateDuration(data);
    }
  });

  audioEngine.on('ended', () => {
    const { repeatMode, next, playlist, currentIndex } = get();
    if (repeatMode === 'one') {
      // Повторяем текущий трек
      get().play().catch(() => {
        // Игнорируем ошибки воспроизведения
      });
    } else if (repeatMode === 'all') {
      // Переходим к следующему треку (или к первому, если это последний)
      next().catch(() => {
        // Игнорируем ошибки перехода к следующему треку
      });
    } else {
      // repeatMode === 'none'
      // Проверяем, является ли текущий трек последним
      const isLastTrack = currentIndex >= 0 && currentIndex === playlist.length - 1;
      if (isLastTrack) {
        // Останавливаем воспроизведение, если это последний трек
        get().pause();
      } else {
        // Переходим к следующему треку
        next().catch(() => {
          // Игнорируем ошибки перехода к следующему треку
        });
      }
    }
  });

  return {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    repeatMode: 'none',
    shuffleMode: false,
    playlist: [],
    currentIndex: -1,

    setCurrentTrack: async (trackId: string) => {
      set({ currentTrack: trackId });
      // Загружаем аудио для нового трека
      const { tracks } = useTracksStore.getState();
      const track = tracks.find((t) => t.id === trackId);
      if (track?.encoded_audio) {
        try {
          await loadAudioFromEncoded(track.encoded_audio);
        } catch (error) {
          // Если это текстовые данные, не пытаемся воспроизводить
          if (error instanceof Error && error.message.includes('текстовую строку')) {
            set({ isPlaying: false });
            throw error; // Пробрасываем ошибку, чтобы next() мог пропустить этот трек
          }
          throw error;
        }
      }
    },

    setPlaylist: (playlist: string[]) => {
      set({ playlist });
    },

    play: async () => {
      try {
        await audioEngine.play();
        set({ isPlaying: true });
      } catch (error) {
        set({ isPlaying: false });
        throw error;
      }
    },

    pause: () => {
      audioEngine.pause();
      set({ isPlaying: false });
    },

    next: async () => {
      const { playlist, currentIndex, shuffleMode } = get();
      if (playlist.length === 0) return;

      // Пытаемся найти следующий трек с валидным аудио
      let attempts = 0;
      const maxAttempts = playlist.length;
      const usedIndices = new Set<number>();
      
      while (attempts < maxAttempts) {
        let nextIndex: number;
        if (shuffleMode) {
          // В режиме shuffle выбираем случайный трек, но не текущий
          do {
            nextIndex = Math.floor(Math.random() * playlist.length);
          } while (nextIndex === currentIndex && playlist.length > 1);
        } else {
          nextIndex = (currentIndex + 1 + attempts) % playlist.length;
        }

        // Избегаем повторного выбора одного и того же индекса в этой итерации
        if (usedIndices.has(nextIndex)) {
          attempts++;
          continue;
        }
        usedIndices.add(nextIndex);

        const nextTrack = playlist[nextIndex];
        if (nextTrack) {
          set({ currentIndex: nextIndex });
          try {
            await get().setCurrentTrack(nextTrack);
            await get().play();
            return; // Успешно загрузили и воспроизводим
          } catch (error) {
            attempts++;
            // Продолжаем попытки найти валидный трек
          }
        } else {
          break;
        }
      }
      
      set({ isPlaying: false });
    },

    previous: async () => {
      const { playlist, currentIndex, shuffleMode } = get();
      if (playlist.length === 0) return;

      let prevIndex: number;
      if (shuffleMode) {
        // В режиме shuffle выбираем случайный трек, но не текущий
        do {
          prevIndex = Math.floor(Math.random() * playlist.length);
        } while (prevIndex === currentIndex && playlist.length > 1);
      } else {
        prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
      }

      const prevTrack = playlist[prevIndex];
      if (prevTrack) {
        set({ currentIndex: prevIndex });
        try {
          await get().setCurrentTrack(prevTrack);
          await get().play();
        } catch (error) {
          // Если трек не может быть воспроизведен, пытаемся найти другой
          console.warn('[PlayerStore] Error playing previous track in shuffle mode, trying another');
          if (shuffleMode && playlist.length > 1) {
            // Пытаемся найти другой случайный трек
            let attempts = 0;
            while (attempts < playlist.length) {
              const randomIndex = Math.floor(Math.random() * playlist.length);
              if (randomIndex !== currentIndex && randomIndex !== prevIndex) {
                const randomTrack = playlist[randomIndex];
                if (randomTrack) {
                  set({ currentIndex: randomIndex });
                  try {
                    await get().setCurrentTrack(randomTrack);
                    await get().play();
                    return;
                  } catch {
                    attempts++;
                  }
                }
              }
              attempts++;
            }
          }
        }
      }
    },

    seek: (time: number) => {
      audioEngine.seek(time);
      set({ currentTime: time });
    },

    setVolume: (volume: number) => {
      audioEngine.setVolume(volume);
      set({ volume });
    },

    toggleRepeat: () => {
      const { repeatMode } = get();
      set({ repeatMode: getNextRepeatMode(repeatMode) });
    },

    toggleShuffle: () => {
      const { shuffleMode } = get();
      set({ shuffleMode: !shuffleMode });
    },

    skipForward: () => {
      const { currentTime } = get();
      get().seek(currentTime + 10);
    },

    skipBackward: () => {
      const { currentTime } = get();
      get().seek(Math.max(0, currentTime - 10));
    },

    updateTime: (time: number) => {
      set({ currentTime: time });
    },

    updateDuration: (duration: number) => {
      set({ duration });
    },
  };
});

