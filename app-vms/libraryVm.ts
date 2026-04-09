import { ViewModelBase } from '@/libs/bizify';
import { musicService } from '@/services';
import { MusicInfo } from '@/types/music-types';
import { extractMusicInfo } from '@/utils/metadata';
import * as expoDocumentPicker from 'expo-document-picker';
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
      multiple: true,
    });
    if (result.canceled || result.assets.length === 0) {
      return;
    }

    // 提取每个文件的元数据（名称清洗、时长、艺术家）
    const musicList: MusicInfo[] = await Promise.all(
      result.assets.map((asset) => extractMusicInfo(asset.name, asset.uri)),
    );

    await musicService.addMusicListBatch(musicList);
    await this.loadMusicList();
    Alert.alert('添加成功', `已添加 ${musicList.length} 首歌曲`);
  }

  async deleteMusic(music: MusicInfo) {
    if (!music.id) return;
    await musicService.deleteMusic(music.id);
    await this.loadMusicList();
  }

  async scanMusic() {
    await musicService.scanAndStoreLocalMusics();
    await this.loadMusicList();
  }
}

export const libraryVm = new LibraryViewModel();
