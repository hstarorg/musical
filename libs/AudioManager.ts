import {
  createAudioPlayer,
  setAudioModeAsync,
  AudioStatus,
} from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { EventEmitter } from 'events';

export enum AMEventNames {
  PlaybackStatusUpdate = 'PlaybackStatusUpdate',
  PlayerChanged = 'PlayerChanged',
}

export class AudioManager {
  private player: AudioPlayer | null = null;
  private readonly em = new EventEmitter();
  private _loadSeq = 0;
  private _statusSubscription: { remove: () => void } | null = null;

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
    setAudioModeAsync({ shouldPlayInBackground: true, playsInSilentMode: true });
  }

  /**
   * 加载音频文件，带并发控制：快速连续调用时只有最后一次生效
   * 返回 null 表示本次加载已被更新的加载取代
   */
  async loadAsync(soundPath: string): Promise<AudioPlayer | null> {
    const seq = ++this._loadSeq;

    // 释放上一个 player
    this._cleanup();

    // 在清理期间如果又触发了新的 load，放弃当前操作
    if (seq !== this._loadSeq) return null;

    try {
      const source = typeof soundPath === 'number' ? soundPath : { uri: soundPath };
      const player = createAudioPlayer(source);

      // 在创建后检查是否被取代
      if (seq !== this._loadSeq) {
        player.release();
        return null;
      }

      this.player = player;

      // 开启音频采样用于波形可视化
      try {
        player.setAudioSamplingEnabled(true);
      } catch {}

      // 监听播放状态
      this._statusSubscription = player.addListener(
        'playbackStatusUpdate',
        (status: AudioStatus) => {
          this.em.emit(AMEventNames.PlaybackStatusUpdate, status);
        }
      );

      this.em.emit(AMEventNames.PlayerChanged, player);
      return player;
    } catch (err) {
      if (seq !== this._loadSeq) return null;
      console.error('[AudioManager] loadAsync failed:', err);
      throw err;
    }
  }

  on(eventName: AMEventNames, handler: (data: any) => void) {
    this.em.on(eventName, handler);
    return () => {
      this.em.off(eventName, handler);
    };
  }

  async playAsync() {
    try {
      this.player?.play();
    } catch (err) {
      console.error('[AudioManager] playAsync failed:', err);
    }
  }

  async pauseAsync() {
    try {
      this.player?.pause();
    } catch (err) {
      console.error('[AudioManager] pauseAsync failed:', err);
    }
  }

  async stopAsync() {
    try {
      this.player?.pause();
      await this.player?.seekTo(0);
    } catch (err) {
      console.error('[AudioManager] stopAsync failed:', err);
    }
  }

  async getAudioStatus(): Promise<AudioStatus | undefined> {
    if (!this.player) return undefined;
    return {
      id: this.player.id,
      currentTime: this.player.currentTime,
      duration: this.player.duration,
      playing: this.player.playing,
      isLoaded: this.player.duration > 0,
      didJustFinish: false,
      isBuffering: false,
      loop: false,
      mute: false,
      playbackState: '',
      timeControlStatus: '',
      reasonForWaitingToPlay: '',
      playbackRate: 1,
    } as AudioStatus;
  }

  /** 获取当前 AudioPlayer 实例（用于音频采样等） */
  getPlayer(): AudioPlayer | null {
    return this.player;
  }

  /** 开启/关闭音频采样（用于波形可视化） */
  setAudioSamplingEnabled(enabled: boolean) {
    try {
      this.player?.setAudioSamplingEnabled(enabled);
    } catch (err) {
      console.warn('[AudioManager] setAudioSamplingEnabled failed:', err);
    }
  }

  /**
   * 设置到指定位置
   * @param value 秒数
   */
  async setPositionAsync(value: number) {
    try {
      await this.player?.seekTo(value);
    } catch (err) {
      console.error('[AudioManager] setPositionAsync failed:', err);
    }
  }

  private _cleanup() {
    if (this._statusSubscription) {
      this._statusSubscription.remove();
      this._statusSubscription = null;
    }
    if (this.player) {
      try {
        this.player.release();
      } catch (err) {
        console.warn('[AudioManager] cleanup failed:', err);
      }
      this.player = null;
    }
  }
}
