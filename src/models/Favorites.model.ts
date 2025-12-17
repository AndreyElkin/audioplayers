import type { Track } from './Track.model';

export interface FavoritesState {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
}

export interface FavoriteAction {
  trackId: string;
}

