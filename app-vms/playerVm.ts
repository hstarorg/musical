import { musicService } from '@/services';
import { AudioManager, AMEventNames } from '@/libs/AudioManager';
import { MusicInfo } from '@/types/music-types';
import { MusicPlaySortEnum } from '@/constants';
import { ViewModelBase } from '@/libs/bizify';
import { Alert } from 'react-native';
import { musicUtil } from '@/utils';
import { AVPlaybackStatusError, AVPlaybackStatusSuccess } from 'expo-av';

type PlayerData = {
  currentMusic?: MusicInfo;
  musicPlaySort: MusicPlaySortEnum;
  isPlaying?: boolean;
  isFavorite: boolean;
  progressInfo: {
    progress: number;
    total: number;
    positionMillis: string;
    durationMillis: string;
  };
};

class PlayerViewModel extends ViewModelBase<PlayerData> {
  $data(): PlayerData {
    return {
      musicPlaySort: MusicPlaySortEnum.Random,
      isFavorite: false,
      progressInfo: {
        total: 0,
        progress: 0,
        positionMillis: musicUtil.duration2TimeStr(0),
        durationMillis: musicUtil.duration2TimeStr(0),
      },
    };
  }

  initPlaybackStatusUpdateNotification() {
    return AudioManager.instance.on(
      AMEventNames.PlaybackStatusUpdate,
      (audioStatus: AVPlaybackStatusSuccess | AVPlaybackStatusError) => {
        if ((audioStatus as AVPlaybackStatusError).error) {
          return;
        }
        const status = audioStatus as AVPlaybackStatusSuccess;
        this.data.isPlaying = status.isPlaying;

        if (status.isLoaded) {
          this.data.progressInfo = {
            progress: Math.floor(status.positionMillis / 1000),
            total: Math.floor((status.durationMillis || 0) / 1000),
            positionMillis: musicUtil.duration2TimeStr(
              status.positionMillis || 0
            ),
            durationMillis: musicUtil.duration2TimeStr(
              status.durationMillis || 0
            ),
          };

          // 播放结束时自动切换下一首
          if (status.didJustFinish && !status.isLooping) {
            this._onTrackFinished();
          }
        }
      }
    );
  }

  private async _onTrackFinished() {
    if (this.data.musicPlaySort === MusicPlaySortEnum.SingleLoop) {
      // 单曲循环：重新播放当前歌曲
      if (this.data.currentMusic) {
        this._play(this.data.currentMusic);
      }
    } else {
      // 其他模式：切到下一首
      await this.nextMusic();
    }
  }

  async togglePlaySortType() {
    const newSortType = musicUtil.findNextKey(
      Object.keys(MusicPlaySortEnum),
      this.data.musicPlaySort
    );
    this.data.musicPlaySort = newSortType as MusicPlaySortEnum;
  }

  async handleProcessChange(value: number) {
    AudioManager.instance.setPositionAsync(value);
  }

  async togglePlay() {
    const audioStatus = await AudioManager.instance.getAudioStatus();
    if (audioStatus?.isPlaying) {
      await AudioManager.instance.pauseAsync();
    } else {
      if (audioStatus?.isLoaded) {
        await AudioManager.instance.playAsync();
      } else if (this.data.currentMusic) {
        this.selectMusic(this.data.currentMusic);
      }
    }
  }

  async nextMusic() {
    if (!this.data.currentMusic) return;
    // 优先从播放队列取下一首
    const queueNext = await musicService.getNextFromQueue();
    if (queueNext) {
      await musicService.setCurrentMusic(String(queueNext.id));
      this._play(queueNext);
      return;
    }
    await musicService.updateCurrentMusic(
      this.data.currentMusic,
      'next',
      this.data.musicPlaySort
    );
    await this.loadCurrentMusic(true);
  }

  async preMusic() {
    if (!this.data.currentMusic) return;
    await musicService.updateCurrentMusic(
      this.data.currentMusic,
      'prev',
      this.data.musicPlaySort
    );
    await this.loadCurrentMusic(true);
  }

  async loadCurrentMusic(autoPlay = false) {
    const musicInfo = (await musicService.getCurrentMusic()) as MusicInfo;
    if (musicInfo) {
      this.data.currentMusic = musicInfo;
      await this._updateFavoriteStatus(musicInfo.id!);
      if (autoPlay) {
        this._play(musicInfo);
      }
    }
  }

  async selectMusic(music: MusicInfo) {
    await musicService.setCurrentMusic(String(music.id));
    this._play(music);
  }

  async toggleFavorite() {
    if (!this.data.currentMusic?.id) return;
    const isFav = await musicService.toggleFavorite(this.data.currentMusic.id);
    this.data.isFavorite = isFav;
  }

  async addToQueue(music: MusicInfo) {
    if (music.id) {
      await musicService.addToQueue(music.id);
    }
  }

  private async _updateFavoriteStatus(musicId: number) {
    this.data.isFavorite = await musicService.isFavorite(musicId);
  }

  private async _play(music: MusicInfo) {
    if (!music) return;
    try {
      const audioManager = AudioManager.instance;
      const sound = await audioManager.loadAsync(music.path);
      if (!sound) return;
      await audioManager.playAsync();
      this.data.currentMusic = music;
      await this._updateFavoriteStatus(music.id!);
      // 记录播放历史
      if (music.id) {
        musicService.addPlayHistory(music.id);
      }
    } catch (err: any) {
      Alert.alert('播放失败', err.message);
      console.error(err);
    }
  }
}

export const playerVm = new PlayerViewModel();
