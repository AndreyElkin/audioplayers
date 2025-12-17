import { apiService } from './Api.service';
import type { Track, TrackResponse } from '../models/Track.model';

class TracksService {
  async getTracks(): Promise<Track[]> {
    const tracks = await apiService.get<TrackResponse[]>('/tracks');
    return tracks.map((track) => ({
      id: String(track.id),
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      size_mb: track.size_mb,
      encoded_audio: track.encoded_audio,
    }));
  }

  async getFavorites(): Promise<Track[]> {
    console.log('[TracksService] getFavorites called');
    const favorites = await apiService.get<TrackResponse[]>('/favorites');
    console.log('[TracksService] getFavorites response:', favorites);
    const mapped = favorites.map((track) => ({
      id: String(track.id),
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      size_mb: track.size_mb,
      encoded_audio: track.encoded_audio,
    }));
    console.log('[TracksService] getFavorites mapped result:', mapped);
    return mapped;
  }

  async addToFavorites(trackId: string): Promise<{ message: string }> {
    console.log('[TracksService] addToFavorites called with trackId:', trackId, 'type:', typeof trackId);
    // Конвертируем trackId в число, так как сервер может ожидать число
    const trackIdNum = Number(trackId);
    console.log('[TracksService] Converted trackId to number:', trackIdNum);
    const result = await apiService.post<{ message: string }>('/favorites', { trackId: trackIdNum });
    console.log('[TracksService] addToFavorites response:', result);
    return result;
  }

  async removeFromFavorites(trackId: string): Promise<{ message: string }> {
    console.log('[TracksService] removeFromFavorites called with trackId:', trackId, 'type:', typeof trackId);
    // Конвертируем trackId в число, так как сервер может ожидать число
    const trackIdNum = Number(trackId);
    console.log('[TracksService] Converted trackId to number:', trackIdNum);
    const result = await apiService.delete<{ message: string }>('/favorites', { trackId: trackIdNum });
    console.log('[TracksService] removeFromFavorites response:', result);
    return result;
  }
}

export const tracksService = new TracksService();

