import * as expoDocumentPicker from 'expo-document-picker';
import { musicService } from '@/services';
import { AudioManager } from '@/libs';
import { MusicInfo } from '@/types/music-types';
import { MusicPlaySortEnum } from '@/constants';
import { ViewModelBase } from '@/libs/bizify';
import { Alert } from 'react-native';
import { getFiles, musicUtil } from '@/utils';
import { AMEventNames } from '@/libs/AudioManager';
import { AVPlaybackStatusError, AVPlaybackStatusSuccess } from 'expo-av';
import { documentDirectory } from 'expo-file-system';

type PageData = {
  musicList: MusicInfo[];
  currentMusic?: MusicInfo;
  musicPlaySort: MusicPlaySortEnum;
  isPlaying?: boolean;
  progressInfo: {
    progress: number;
    total: number;
    positionMillis: string;
    durationMillis: string;
  };
};

class GlobalViewModel extends ViewModelBase<PageData> {
  $data(): PageData {
    return {
      musicList: [],
      musicPlaySort: MusicPlaySortEnum.Random,
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
        this.data.isPlaying = (
          audioStatus as AVPlaybackStatusSuccess
        ).isPlaying;

        if (audioStatus?.isLoaded) {
          this.data.progressInfo = {
            progress: Math.floor(audioStatus.positionMillis / 1000),
            total: Math.floor((audioStatus.durationMillis || 0) / 1000),
            positionMillis: musicUtil.duration2TimeStr(
              audioStatus.positionMillis || 0
            ),
            durationMillis: musicUtil.duration2TimeStr(
              audioStatus.durationMillis || 0
            ),
          };
        }
      }
    );
  }

  async loadMusicList() {
    const musicList = await musicService.queryMusicList();
    this.data.musicList = musicList;
  }

  async updateAudioStatus() {
    const audioStatus = await AudioManager.instance.getAudioStatus();
    console.log(audioStatus);
    if (audioStatus?.isLoaded) {
      this.data.progressInfo = {
        progress: Math.floor(audioStatus.positionMillis / 1000),
        total: Math.floor((audioStatus.durationMillis || 0) / 1000),
        positionMillis: musicUtil.duration2TimeStr(
          audioStatus.positionMillis || 0
        ),
        durationMillis: musicUtil.duration2TimeStr(
          audioStatus.durationMillis || 0
        ),
      };
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
      } else {
        this.selectMusic(this.data.currentMusic!);
      }
    }
  }

  async nextMusic() {
    await musicService.updateCurrentMusic(
      this.data.currentMusic!,
      'next',
      this.data.musicPlaySort
    );
    await this.loadCurrentMusic();
  }

  async preMusic() {
    await musicService.updateCurrentMusic(
      this.data.currentMusic!,
      'prev',
      this.data.musicPlaySort
    );
    await this.loadCurrentMusic();
  }

  async loadCurrentMusic(autoPlay = false) {
    const musicInfo = (await musicService.getCurrentMusic()) as MusicInfo;
    if (musicInfo) {
      this.data.currentMusic = musicInfo;
      if (autoPlay) {
        this._play(musicInfo);
      }
    }
  }

  async scanMusic() {
    console.log('scan start');
    const files = getFiles('file://', (item) => {
      console.log(item);
      return item.endsWith('.mp3');
    });
    console.log('scan end', files);
  }

  private _play(music: MusicInfo) {
    if (!music) {
      return;
    }
    let audioManager = AudioManager.instance;
    audioManager
      .loadAsync(music.path)
      .then(() => {
        return audioManager.playAsync();
      })
      .then(() => {
        this.data.currentMusic = music;
      })
      .catch((err) => {
        Alert.alert('err' + err.message);
        console.error(err);
      });
  }

  async selectMusicFiles() {
    const result = await expoDocumentPicker.getDocumentAsync({
      type: 'audio/*',
    });
    if (result.canceled) {
      return;
    }

    if (result.assets.length === 0) {
      return;
    }

    await musicService.addMusicList(
      result.assets.map((x) => ({ name: x.name, path: x.uri }))
    );
    Alert.alert('Add music success');
  }

  async selectMusic(music: MusicInfo) {
    this._play(music);
  }
}

export const globalVm = new GlobalViewModel();
