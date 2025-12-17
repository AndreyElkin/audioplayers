import { usePlayerStore } from '../stores/player.store';

export class PlayerController {
  play(): void {
    const { play } = usePlayerStore.getState();
    play();
  }

  pause(): void {
    const { pause } = usePlayerStore.getState();
    pause();
  }

  togglePlayPause(): void {
    const { isPlaying, play, pause } = usePlayerStore.getState();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  async next(): Promise<void> {
    const { next } = usePlayerStore.getState();
    await next();
  }

  async previous(): Promise<void> {
    const { previous } = usePlayerStore.getState();
    await previous();
  }

  seek(time: number): void {
    const { seek } = usePlayerStore.getState();
    seek(time);
  }

  setVolume(volume: number): void {
    const { setVolume } = usePlayerStore.getState();
    setVolume(volume);
  }

  toggleRepeat(): void {
    const { toggleRepeat } = usePlayerStore.getState();
    toggleRepeat();
  }

  toggleShuffle(): void {
    const { toggleShuffle } = usePlayerStore.getState();
    toggleShuffle();
  }

  skipForward(): void {
    const { skipForward } = usePlayerStore.getState();
    skipForward();
  }

  skipBackward(): void {
    const { skipBackward } = usePlayerStore.getState();
    skipBackward();
  }
}

export const playerController = new PlayerController();

