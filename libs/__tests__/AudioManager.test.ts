import { Audio, AVPlaybackStatus } from 'expo-av';

// Mock expo-av before importing AudioManager
const mockLoadAsync = jest.fn().mockResolvedValue({});
const mockPlayAsync = jest.fn().mockResolvedValue({});
const mockPauseAsync = jest.fn().mockResolvedValue({});
const mockStopAsync = jest.fn().mockResolvedValue({});
const mockUnloadAsync = jest.fn().mockResolvedValue({});
const mockGetStatusAsync = jest.fn().mockResolvedValue({ isLoaded: true, isPlaying: false });
const mockSetPositionAsync = jest.fn().mockResolvedValue({});
const mockSetOnPlaybackStatusUpdate = jest.fn();

jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn().mockImplementation(() => ({
      loadAsync: mockLoadAsync,
      playAsync: mockPlayAsync,
      pauseAsync: mockPauseAsync,
      stopAsync: mockStopAsync,
      unloadAsync: mockUnloadAsync,
      getStatusAsync: mockGetStatusAsync,
      setPositionAsync: mockSetPositionAsync,
      setOnPlaybackStatusUpdate: mockSetOnPlaybackStatusUpdate,
    })),
    setAudioModeAsync: jest.fn(),
  },
}));

// Must import after mocks
import { AudioManager, AMEventNames } from '../AudioManager';

describe('AudioManager', () => {
  let manager: AudioManager;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton for each test
    (AudioManager as any).signletonInstance = null;
    manager = AudioManager.instance;
  });

  it('should be a singleton', () => {
    const instance2 = AudioManager.instance;
    expect(manager).toBe(instance2);
  });

  it('should throw if constructor called directly when singleton exists', () => {
    expect(() => new AudioManager()).toThrow('singleton');
  });

  describe('loadAsync', () => {
    it('should create a new Sound and load it', async () => {
      const result = await manager.loadAsync('file:///test.mp3');
      expect(Audio.Sound).toHaveBeenCalled();
      expect(mockLoadAsync).toHaveBeenCalledWith({ uri: 'file:///test.mp3' });
      expect(result).toBeTruthy();
    });

    it('should stop and unload previous sound before loading new one', async () => {
      await manager.loadAsync('file:///first.mp3');
      mockGetStatusAsync.mockResolvedValueOnce({ isLoaded: true });
      await manager.loadAsync('file:///second.mp3');
      expect(mockStopAsync).toHaveBeenCalled();
    });

    it('should return null when superseded by a newer load', async () => {
      // Simulate a slow load that gets overtaken
      let resolveFirst: () => void;
      const slowLoad = new Promise<void>((resolve) => {
        resolveFirst = resolve;
      });
      mockStopAsync.mockImplementationOnce(() => slowLoad);

      // First load will be slow due to stop
      const firstLoad = manager.loadAsync('file:///slow.mp3');

      // Trigger a second load immediately (this increments _loadSeq)
      // We need the first load to still be waiting on stopAsync
      // Reset stop to resolve immediately for second load
      mockStopAsync.mockResolvedValue({});
      const secondLoad = manager.loadAsync('file:///fast.mp3');

      // Now let the first stop complete
      resolveFirst!();

      const [firstResult, secondResult] = await Promise.all([
        firstLoad,
        secondLoad,
      ]);

      expect(firstResult).toBeNull();
      expect(secondResult).toBeTruthy();
    });
  });

  describe('playAsync', () => {
    it('should play when loaded', async () => {
      await manager.loadAsync('file:///test.mp3');
      mockGetStatusAsync.mockResolvedValueOnce({ isLoaded: true });
      await manager.playAsync();
      expect(mockPlayAsync).toHaveBeenCalled();
    });

    it('should not throw on error', async () => {
      await manager.loadAsync('file:///test.mp3');
      mockGetStatusAsync.mockRejectedValueOnce(new Error('fail'));
      await expect(manager.playAsync()).resolves.not.toThrow();
    });
  });

  describe('pauseAsync', () => {
    it('should not throw on error', async () => {
      await manager.loadAsync('file:///test.mp3');
      mockPauseAsync.mockRejectedValueOnce(new Error('fail'));
      await expect(manager.pauseAsync()).resolves.not.toThrow();
    });
  });

  describe('setPositionAsync', () => {
    it('should convert seconds to milliseconds', async () => {
      await manager.loadAsync('file:///test.mp3');
      await manager.setPositionAsync(30);
      expect(mockSetPositionAsync).toHaveBeenCalledWith(30000);
    });
  });

  describe('event system', () => {
    it('should register and unregister event handlers', async () => {
      const handler = jest.fn();
      const unsubscribe = manager.on(AMEventNames.PlaybackStatusUpdate, handler);
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
  });
});
