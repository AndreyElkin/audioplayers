export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  size_mb?: number;
  encoded_audio?: string;
  addedDate?: string;
  isFavorite?: boolean;
}

export interface TrackResponse {
  id: number;
  title: string;
  artist: string;
  duration?: number;
  size_mb?: number;
  encoded_audio?: string;
}

