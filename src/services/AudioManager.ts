import { Audio } from 'expo-av';

class AudioManager {
  playbackObject: Audio.Sound | null = null;

  constructor() {
    Audio.setAudioModeAsync({ staysActiveInBackground: true });
  }

  async loadAsync(soundPath: string) {
    // 先停止
    if (this.playbackObject) {
      await this.stopAsync();
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

  pauseAsync() {
    return this.playbackObject?.pauseAsync();
  }

  stopAsync() {
    return this.playbackObject?.stopAsync();
  }

  async getAudioStatus() {
    const status = await this.playbackObject?.getStatusAsync();
    if (status?.isLoaded) {
      return status;
    }
    return void 0;
  }
}

export const audioManager = new AudioManager();
