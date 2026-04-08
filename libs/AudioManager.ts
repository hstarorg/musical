import { Audio, AVPlaybackStatus } from 'expo-av';
import { EventEmitter } from 'events';

export enum AMEventNames {
  PlaybackStatusUpdate = 'PlaybackStatusUpdate',
}

export class AudioManager {
  private playbackObject: Audio.Sound | null = null;
  private readonly em = new EventEmitter();
  private _loadSeq = 0;

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

  /**
   * 加载音频文件，带并发控制：快速连续调用时只有最后一次生效
   * 返回 null 表示本次加载已被更新的加载取代
   */
  async loadAsync(soundPath: string): Promise<Audio.Sound | null> {
    const seq = ++this._loadSeq;

    // 先停止并卸载上一个
    if (this.playbackObject) {
      await this.stopAsync();
      await this.tryUnloadAsync();
    }

    // 在 stop/unload 期间如果又触发了新的 load，放弃当前操作
    if (seq !== this._loadSeq) return null;

    const sound = new Audio.Sound();
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      this.em.emit(AMEventNames.PlaybackStatusUpdate, status);
    });

    const source =
      typeof soundPath === 'number' ? soundPath : { uri: soundPath };

    try {
      await sound.loadAsync(source);
    } catch (err) {
      // 加载失败时，如果已被新请求取代则静默丢弃
      if (seq !== this._loadSeq) return null;
      console.error('[AudioManager] loadAsync failed:', err);
      throw err;
    }

    // 加载完成后再次检查：如果已被新请求取代，卸载刚加载好的资源
    if (seq !== this._loadSeq) {
      await sound.unloadAsync().catch(() => {});
      return null;
    }

    this.playbackObject = sound;
    return sound;
  }

  on(eventName: AMEventNames, handler: (data: AVPlaybackStatus) => void) {
    this.em.on(eventName, handler);
    return () => {
      this.em.off(eventName, handler);
    };
  }

  async playAsync() {
    try {
      const audioStatus = await this.playbackObject?.getStatusAsync();
      if (audioStatus?.isLoaded) {
        await this.playbackObject?.playAsync();
      }
    } catch (err) {
      console.error('[AudioManager] playAsync failed:', err);
    }
  }

  async pauseAsync() {
    try {
      await this.playbackObject?.pauseAsync();
    } catch (err) {
      console.error('[AudioManager] pauseAsync failed:', err);
    }
  }

  async stopAsync() {
    try {
      await this.playbackObject?.stopAsync();
    } catch (err) {
      console.error('[AudioManager] stopAsync failed:', err);
    }
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
   * @param value 秒数
   */
  async setPositionAsync(value: number) {
    try {
      await this.playbackObject?.setPositionAsync(value * 1000);
    } catch (err) {
      console.error('[AudioManager] setPositionAsync failed:', err);
    }
  }

  private async tryUnloadAsync() {
    try {
      const status = await this.playbackObject?.getStatusAsync();
      if (status?.isLoaded) {
        await this.playbackObject?.unloadAsync();
      }
    } catch (err) {
      console.warn('[AudioManager] tryUnloadAsync failed:', err);
    }
    this.playbackObject = null;
  }
}
