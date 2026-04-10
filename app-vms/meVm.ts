import { musicService } from '@/services';
import { MusicInfo } from '@/types/music-types';
import { ViewModelBase } from '@/libs/bizify';

type MeData = {
  favorites: MusicInfo[];
  history: (MusicInfo & { played_at: number })[];
  activeTab: 'favorites' | 'history';
  stats: {
    totalSongs: number;
    totalFavorites: number;
    totalPlayCount: number;
  };
};

class MeViewModel extends ViewModelBase<MeData> {
  $data(): MeData {
    return {
      favorites: [],
      history: [],
      activeTab: 'favorites',
      stats: { totalSongs: 0, totalFavorites: 0, totalPlayCount: 0 },
    };
  }

  async loadStats() {
    const songs = await musicService.queryMusicList();
    const favs = await musicService.queryFavorites();
    const history = await musicService.queryPlayHistory();
    this.data.stats = {
      totalSongs: songs.length,
      totalFavorites: favs.length,
      totalPlayCount: history.length,
    };
  }

  async loadFavorites() {
    this.data.favorites = await musicService.queryFavorites();
  }

  async loadHistory() {
    this.data.history = await musicService.queryPlayHistory();
  }

  async clearHistory() {
    await musicService.clearPlayHistory();
    this.data.history = [];
    this.data.stats = { ...this.data.stats, totalPlayCount: 0 };
  }

  setActiveTab(tab: 'favorites' | 'history') {
    this.data.activeTab = tab;
    if (tab === 'favorites') {
      this.loadFavorites();
    } else {
      this.loadHistory();
    }
  }
}

export const meVm = new MeViewModel();
