export type RepeatMode = 'none' | 'all' | 'one';

export type ShuffleMode = boolean;

export interface PlayerState {
  currentTrack: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;
  playlist: string[];
  currentIndex: number;
}

export interface PlayerControls {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  skipForward: () => void;
  skipBackward: () => void;
}

