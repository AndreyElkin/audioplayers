import { create } from 'zustand';
import type { Track } from '../models/Track.model';
import { tracksService } from '../services/Tracks.service';

interface TracksState {
  tracks: Track[];
  favorites: Track[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchTracks: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  addToFavorites: (trackId: string) => Promise<void>;
  removeFromFavorites: (trackId: string) => Promise<void>;
  setPage: (page: number) => void;
  clearError: () => void;
}

export const useTracksStore = create<TracksState>((set, get) => ({
  tracks: [],
  favorites: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,

  fetchTracks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tracks = await tracksService.getTracks();
      const { favorites } = get();
      // Синхронизируем isFavorite с массивом favorites
      const tracksWithFavorites = tracks.map((track) => ({
        ...track,
        isFavorite: favorites.some((fav) => fav.id === track.id),
      }));
      const totalPages = Math.ceil(tracksWithFavorites.length / 20);
      set({
        tracks: tracksWithFavorites,
        totalPages,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Ошибка загрузки треков',
      });
    }
  },

  fetchFavorites: async () => {
    console.log('[tracks.store] fetchFavorites called');
    set({ isLoading: true, error: null });
    try {
      const favorites = await tracksService.getFavorites();
      console.log('[tracks.store] fetchFavorites: received', favorites.length, 'favorites');
      const favoritesWithFlag = favorites.map((fav) => ({ ...fav, isFavorite: true }));
      const { tracks } = get();
      console.log('[tracks.store] fetchFavorites: current tracks count', tracks.length);
      // Обновляем isFavorite в основном массиве треков
      const updatedTracks = tracks.map((track) => ({
        ...track,
        isFavorite: favoritesWithFlag.some((fav) => fav.id === track.id),
      }));
      const favoriteCount = updatedTracks.filter(t => t.isFavorite).length;
      console.log('[tracks.store] fetchFavorites: updated tracks, favorite count', favoriteCount);
      set({
        favorites: favoritesWithFlag,
        tracks: updatedTracks,
        isLoading: false,
        error: null,
      });
      console.log('[tracks.store] fetchFavorites: state updated, favorites count', favoritesWithFlag.length);
    } catch (error) {
      console.error('[tracks.store] fetchFavorites error:', error);
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Ошибка загрузки избранного',
      });
    }
  },

  addToFavorites: async (trackId: string) => {
    console.log('[tracks.store] addToFavorites called:', trackId);
    try {
      console.log('[tracks.store] Calling API to add to favorites...');
      await tracksService.addToFavorites(trackId);
      console.log('[tracks.store] API call successful, reloading favorites...');
      // Перезагружаем избранное с сервера для синхронизации
      const favorites = await tracksService.getFavorites();
      console.log('[tracks.store] Favorites loaded from server:', favorites.length, 'items');
      const favoritesWithFlag = favorites.map((fav) => ({ ...fav, isFavorite: true }));
      const { tracks } = get();
      console.log('[tracks.store] Current tracks count:', tracks.length);
      // Обновляем isFavorite в основном массиве треков
      const updatedTracks = tracks.map((track) => ({
        ...track,
        isFavorite: favoritesWithFlag.some((fav) => fav.id === track.id),
      }));
      const favoriteCount = updatedTracks.filter(t => t.isFavorite).length;
      console.log('[tracks.store] Updated tracks with favorites. Favorite count:', favoriteCount);
        set({
        favorites: favoritesWithFlag,
        tracks: updatedTracks,
      });
      console.log('[tracks.store] State updated. New favorites count:', favoritesWithFlag.length);
    } catch (error) {
      console.error('[tracks.store] Error adding to favorites:', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Ошибка добавления в избранное',
      });
      throw error;
    }
  },

  removeFromFavorites: async (trackId: string) => {
    console.log('[tracks.store] removeFromFavorites called:', trackId);
    try {
      console.log('[tracks.store] Calling API to remove from favorites...');
      await tracksService.removeFromFavorites(trackId);
      console.log('[tracks.store] API call successful, reloading favorites...');
      // Перезагружаем избранное с сервера для синхронизации
      const favorites = await tracksService.getFavorites();
      console.log('[tracks.store] Favorites loaded from server:', favorites.length, 'items');
      const favoritesWithFlag = favorites.map((fav) => ({ ...fav, isFavorite: true }));
      const { tracks } = get();
      console.log('[tracks.store] Current tracks count:', tracks.length);
      // Обновляем isFavorite в основном массиве треков
      const updatedTracks = tracks.map((track) => ({
        ...track,
        isFavorite: favoritesWithFlag.some((fav) => fav.id === track.id),
      }));
      const favoriteCount = updatedTracks.filter(t => t.isFavorite).length;
      console.log('[tracks.store] Updated tracks with favorites. Favorite count:', favoriteCount);
      set({
        favorites: favoritesWithFlag,
        tracks: updatedTracks,
      });
      console.log('[tracks.store] State updated. New favorites count:', favoritesWithFlag.length);
    } catch (error) {
      console.error('[tracks.store] Error removing from favorites:', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Ошибка удаления из избранного',
      });
      throw error;
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
  },

  clearError: () => set({ error: null }),
}));

