import { MusicInfo } from '@/types/music-types';
import { openDatabaseSync } from 'expo-sqlite';

jest.mock('expo-sqlite');

jest.mock('@/utils', () => ({
  requestPermissionAndroid: jest.fn().mockResolvedValue(true),
  getFiles: jest.fn().mockResolvedValue([]),
}));

jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
  PermissionsAndroid: {
    PERMISSIONS: { READ_EXTERNAL_STORAGE: 'storage' },
  },
  Platform: { OS: 'ios' },
}));

// Get mock db instance (same object returned by openDatabaseSync)
const mockDb = (openDatabaseSync as jest.Mock)();

import { musicService } from '../music.service';

describe('MusicService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Restore default return values
    mockDb.getAllAsync.mockResolvedValue([]);
    mockDb.getFirstAsync.mockResolvedValue(null);
    mockDb.runAsync.mockResolvedValue({});
    mockDb.withTransactionAsync.mockImplementation((fn: () => Promise<void>) => fn());
  });

  describe('queryMusicList', () => {
    it('should return all music from DB', async () => {
      const mockList: MusicInfo[] = [
        { id: 1, name: 'Song 1', path: '/a.mp3' },
        { id: 2, name: 'Song 2', path: '/b.mp3' },
      ];
      mockDb.getAllAsync.mockResolvedValueOnce(mockList);

      const result = await musicService.queryMusicList();
      expect(result).toEqual(mockList);
    });
  });

  describe('setCurrentMusic', () => {
    it('should upsert current music id into sys_config', async () => {
      await musicService.setCurrentMusic('42');
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE'),
        ['42']
      );
    });
  });

  describe('getCurrentMusic', () => {
    it('should join sys_config with music table', async () => {
      const mockMusic = { id: 1, name: 'Song', path: '/a.mp3' };
      mockDb.getFirstAsync.mockResolvedValueOnce(mockMusic);

      const result = await musicService.getCurrentMusic();
      expect(result).toEqual(mockMusic);
    });
  });

  describe('addMusicListBatch', () => {
    it('should insert music within a transaction', async () => {
      const list: MusicInfo[] = [
        { name: 'A', path: '/a.mp3' },
        { name: 'B', path: '/b.mp3' },
      ];

      await musicService.addMusicListBatch(list);
      expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
    });

    it('should skip empty list', async () => {
      await musicService.addMusicListBatch([]);
      expect(mockDb.withTransactionAsync).not.toHaveBeenCalled();
    });
  });

  describe('updateCurrentMusic', () => {
    it('should do nothing for singleLoop mode', async () => {
      mockDb.runAsync.mockClear();
      mockDb.getFirstAsync.mockClear();
      await musicService.updateCurrentMusic(
        { id: 1, name: 'X', path: '/x.mp3' },
        'next',
        'singleLoop'
      );
      expect(mockDb.getFirstAsync).not.toHaveBeenCalled();
      expect(mockDb.runAsync).not.toHaveBeenCalled();
    });

    it('should pick random track for random mode', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({ id: 5 });
      await musicService.updateCurrentMusic(
        { id: 1, name: 'X', path: '/x.mp3' },
        'next',
        'random'
      );
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining('RANDOM()'),
        expect.anything()
      );
    });

    it('should pick next track for asc mode', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({
        prevVal: null,
        nextVal: 3,
        firstVal: 1,
        lastVal: 5,
      });
      await musicService.updateCurrentMusic(
        { id: 2, name: 'X', path: '/x.mp3' },
        'next',
        'asc'
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE'),
        ['3']
      );
    });

    it('should wrap to first track when at end in listLoop', async () => {
      mockDb.getFirstAsync.mockResolvedValueOnce({
        prevVal: 2,
        nextVal: null,
        firstVal: 1,
        lastVal: 3,
      });
      await musicService.updateCurrentMusic(
        { id: 3, name: 'X', path: '/x.mp3' },
        'next',
        'listLoop'
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR REPLACE'),
        ['1']
      );
    });
  });
});
