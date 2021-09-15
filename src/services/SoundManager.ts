import Sound from 'react-native-sound';
import { Audio } from 'expo-av';

export class SoundManager {
  sound: Audio.Sound | null = null;

  loadAsync(soundPath: string) {
    if (this.sound) {
      this.stop();
    }
    this.sound = new Audio.Sound();
    return this.sound.loadAsync({ uri: soundPath }).then(() => {
      return this.sound;
    });
  }

  play() {
    return this.sound?.playAsync();
  }

  pause() {
    return this.sound?.pauseAsync();
  }

  stop() {
    return this.sound?.stopAsync();
  }

  getDuration() {
    return this.sound?.getStatusAsync().then(info => {
      return info.isLoaded ? info.durationMillis : 0;
    });
  }

  getCurrentTime() {
    return this.sound?.getStatusAsync().then(info => {
      return info.isLoaded
        ? { seconds: info.positionMillis, isPlaying: info.isPlaying }
        : { seconds: 0, isPlaying: false };
    });
  }
}

export const soundManager = new SoundManager();
