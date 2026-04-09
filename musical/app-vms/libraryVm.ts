import * as expoDocumentPicker from 'expo-document-picker';
import { musicService } from '@/services';
import { MusicInfo } from '@/types/music-types';
import { ViewModelBase } from '@/libs/bizify';
import { Alert } from 'react-native';

type LibraryData = {
  musicList: MusicInfo[];
};

class LibraryViewModel extends ViewModelBase<LibraryData> {
  $data(): LibraryData {
    return {
      musicList: [],
    };
  }

  async loadMusicList() {
    const musicList = await musicService.queryMusicList();
    this.data.musicList = musicList;
  }

  async selectMusicFiles() {
    const result = await expoDocumentPicker.getDocumentAsync({
      type: 'audio/*',
    });
    if (result.canceled || result.assets.length === 0) {
      return;
    }

    await musicService.addMusicListBatch(
      result.assets.map((x) => ({ name: x.name, path: x.uri }))
    );
    await this.loadMusicList();
    Alert.alert('添加成功');
  }

  async scanMusic() {
    await musicService.scanAndStoreLocalMusics();
    await this.loadMusicList();
  }
}

export const libraryVm = new LibraryViewModel();
