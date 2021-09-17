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
      // TODO: 加这个会报错，待分析原因
      // await this.tryUnloadAsync();
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

  private async tryUnloadAsync() {
    // unload 需要检查
    const status = await this.playbackObject?.getStatusAsync();
    if (status?.isLoaded) {
      await this.playbackObject?.unloadAsync();
    }
  }
}

export const audioManager = new AudioManager();
