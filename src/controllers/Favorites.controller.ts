import { useTracksStore } from '../stores/tracks.store';

export class FavoritesController {
  async loadFavorites(): Promise<void> {
    console.log('[FavoritesController] loadFavorites called');
    const { fetchFavorites } = useTracksStore.getState();
    await fetchFavorites();
    const { favorites } = useTracksStore.getState();
    console.log('[FavoritesController] Favorites loaded:', favorites.length);
  }

  async toggleFavorite(trackId: string, isFavorite: boolean): Promise<void> {
    console.log('[FavoritesController] toggleFavorite called:', { trackId, isFavorite });
    const { addToFavorites, removeFromFavorites } = useTracksStore.getState();
    try {
      if (isFavorite) {
        console.log('[FavoritesController] Removing from favorites:', trackId);
        await removeFromFavorites(trackId);
        console.log('[FavoritesController] Successfully removed from favorites:', trackId);
      } else {
        console.log('[FavoritesController] Adding to favorites:', trackId);
        await addToFavorites(trackId);
        console.log('[FavoritesController] Successfully added to favorites:', trackId);
      }
    } catch (error) {
      console.error('[FavoritesController] Error toggling favorite:', error);
      throw error;
    }
  }
}

export const favoritesController = new FavoritesController();

