import { useTracksStore } from '../stores/tracks.store';
import { usePlayerStore } from '../stores/player.store';

export class TracksController {
  async loadTracks(): Promise<void> {
    const { fetchTracks } = useTracksStore.getState();
    await fetchTracks();
  }

  async loadFavorites(): Promise<void> {
    const { fetchFavorites } = useTracksStore.getState();
    await fetchFavorites();
  }

  async toggleFavorite(trackId: string, isFavorite: boolean): Promise<void> {
    const { addToFavorites, removeFromFavorites } = useTracksStore.getState();
    try {
      if (isFavorite) {
        await removeFromFavorites(trackId);
      } else {
        await addToFavorites(trackId);
      }
    } catch (error) {
      throw error;
    }
  }

  async playTrack(trackId: string, playlist: string[]): Promise<void> {
    const { setPlaylist, setCurrentTrack, play, pause, isPlaying, currentTrack, next } = usePlayerStore.getState();
    const { tracks } = useTracksStore.getState();
    const track = tracks.find((t) => t.id === trackId);
    
    console.log('[TracksController] playTrack called:', { 
      trackId, 
      hasTrack: !!track, 
      hasAudio: !!track?.encoded_audio,
      isCurrentlyPlaying: currentTrack === trackId && isPlaying
    });
    
    if (!track || !track.encoded_audio) {
      console.warn('[TracksController] Track not found or no audio:', { trackId, hasTrack: !!track });
      // Пытаемся перейти к следующему треку в плейлисте
      const index = playlist.indexOf(trackId);
      if (index >= 0 && index < playlist.length - 1) {
        console.log('[TracksController] Trying to play next track in playlist');
        setPlaylist(playlist);
        usePlayerStore.setState({ currentIndex: index });
        try {
          await next();
        } catch {
          // Игнорируем ошибки при переходе к следующему треку
        }
      }
      return;
    }
    
    // Если это тот же трек, который уже играет, просто продолжаем воспроизведение
    if (currentTrack === trackId && isPlaying) {
      console.log('[TracksController] Track is already playing');
      return;
    }
    
    try {
      // Останавливаем текущий трек, если он играет и это другой трек
      if (isPlaying && currentTrack !== trackId) {
        pause();
      }
      
      // Устанавливаем плейлист
      setPlaylist(playlist);
      const index = playlist.indexOf(trackId);
      console.log('[TracksController] Setting playlist and index:', { playlistLength: playlist.length, index });
      
      // Устанавливаем currentIndex
      usePlayerStore.setState({ currentIndex: index });
      
      // Устанавливаем текущий трек (это загрузит аудио)
      console.log('[TracksController] Setting current track...');
      await setCurrentTrack(trackId);
      console.log('[TracksController] Current track set, starting playback...');
      
      // Небольшая задержка для гарантии загрузки аудио
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Затем воспроизводим
      try {
        await play();
        console.log('[TracksController] Playback started successfully');
      } catch (playError) {
        console.error('[TracksController] Play error (may be autoplay blocked):', playError);
        // Если это ошибка автоплея, не пробрасываем её дальше
        // Пользователь может нажать кнопку play вручную
        if (playError instanceof Error && playError.name === 'NotAllowedError') {
          console.warn('[TracksController] Autoplay blocked by browser, user interaction required');
        } else {
          throw playError;
        }
      }
    } catch (error) {
      console.error('[TracksController] Error in playTrack:', error);
      
      // Если ошибка связана с невалидным аудио, пытаемся перейти к следующему треку
      if (error instanceof Error && error.message.includes('не являются валидным аудио')) {
        console.warn('[TracksController] Track has invalid audio, trying next track');
        const index = playlist.indexOf(trackId);
        if (index >= 0 && index < playlist.length - 1) {
          try {
            await next();
            return; // Успешно перешли к следующему треку
          } catch (nextError) {
            console.error('[TracksController] Error playing next track:', nextError);
            // Пробрасываем исходную ошибку, если не удалось перейти к следующему
          }
        }
      }
      
      // Для других ошибок просто пробрасываем их дальше
      throw error;
    }
  }
}

export const tracksController = new TracksController();

