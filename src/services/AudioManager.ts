import { Audio } from 'expo-av';

class AudioManager {
  playbackObject: Audio.Sound | null = null;

  async loadAsync(soundPath: string) {
    // 先停止
    if (this.playbackObject) {
      await this.stop();
    }
    this.playbackObject = new Audio.Sound();
    const source =
      typeof soundPath === 'number' ? soundPath : { uri: soundPath };
    return this.playbackObject.loadAsync(source).then(() => {
      return this.playbackObject;
    });
  }

  playAsync() {
    return this.playbackObject?.playAsync();
  }

  pause() {
    return this.playbackObject?.pauseAsync();
  }

  stop() {
    return this.playbackObject?.stopAsync();
  }

  getDuration() {
    return this.playbackObject?.getStatusAsync().then(info => {
      return info.isLoaded ? info.durationMillis : 0;
    });
  }

  getCurrentTime() {
    return this.playbackObject?.getStatusAsync().then(info => {
      return info.isLoaded
        ? { seconds: info.positionMillis, isPlaying: info.isPlaying }
        : { seconds: 0, isPlaying: false };
    });
  }
}

export const audioManager = new AudioManager();
