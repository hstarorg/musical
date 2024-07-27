import { Audio, AVPlaybackStatus } from 'expo-av';
import { EventEmitter } from 'events';

export enum AMEventNames {
  PlaybackStatusUpdate = 'PlaybackStatusUpdate',
}

export class AudioManager {
  private playbackObject: Audio.Sound | null = null;
  private readonly em = new EventEmitter();

  private static signletonInstance: AudioManager | null = null;

  static get instance() {
    if (!this.signletonInstance) {
      this.signletonInstance = new AudioManager();
    }
    return this.signletonInstance;
  }

  constructor() {
    if (AudioManager.signletonInstance) {
      throw new Error(
        'AudioManager is a singleton class, cannot create multiple instances'
      );
    }
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
    this.playbackObject.setOnPlaybackStatusUpdate(
      (status: AVPlaybackStatus) => {
        this.em.emit(AMEventNames.PlaybackStatusUpdate, status);
      }
    );
    const source =
      typeof soundPath === 'number' ? soundPath : { uri: soundPath };
    return this.playbackObject.loadAsync(source).then(() => {
      return this.playbackObject;
    });
  }

  on(eventName: AMEventNames, handler: (data: AVPlaybackStatus) => void) {
    this.em.on(eventName, handler);
    return () => {
      this.em.off(eventName, handler);
    };
  }

  async playAsync() {
    const audioStatus = await this.playbackObject?.getStatusAsync();
    if (audioStatus?.isLoaded) {
      this.playbackObject?.playAsync();
    }
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

  /**
   * 设置到指定位置
   * @param value
   * @returns
   */
  async setPositionAsync(value: number) {
    return await this.playbackObject?.setPositionAsync(value * 1000);
  }

  private async tryUnloadAsync() {
    // unload 需要检查
    const status = await this.playbackObject?.getStatusAsync();
    if (status?.isLoaded) {
      await this.playbackObject?.unloadAsync();
    }
  }
}
