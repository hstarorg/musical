import { musicService } from '@/services';
import { MusicInfo } from '@/types/music-types';
import { ViewModelBase } from '@/libs/bizify';

type PageData = {
  musiclist: MusicInfo[];
};

export class MusicViewModel extends ViewModelBase<PageData> {
  protected $data(): PageData {
    return { musiclist: [] };
  }

  async pageInit() {
    this.loadMusicList();
  }

  async scanMusic() {
    musicService.scanAndStoreLocalMusics().then(() => {
      this.loadMusicList();
    });
  }

  private async loadMusicList() {
    const musicList = await musicService.queryMusicList();
    this.data.musiclist = musicList as any[];
  }
}
