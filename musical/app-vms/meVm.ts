import { musicService } from '@/services';
import { MusicInfo } from '@/types/music-types';
import { ViewModelBase } from '@/libs/bizify';

type MeData = {
  favorites: MusicInfo[];
  history: (MusicInfo & { played_at: number })[];
  activeTab: 'favorites' | 'history';
};

class MeViewModel extends ViewModelBase<MeData> {
  $data(): MeData {
    return {
      favorites: [],
      history: [],
      activeTab: 'favorites',
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
