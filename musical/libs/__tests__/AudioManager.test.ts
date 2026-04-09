// Mock expo-audio before importing AudioManager
const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSeekTo = jest.fn().mockResolvedValue(undefined);
const mockRelease = jest.fn();
const mockAddListener = jest.fn().mockReturnValue({ remove: jest.fn() });

const mockPlayer = {
  id: 'test-player',
  playing: false,
  currentTime: 0,
  duration: 100,
  play: mockPlay,
  pause: mockPause,
  seekTo: mockSeekTo,
  release: mockRelease,
  addListener: mockAddListener,
};

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({
    id: 'test-player',
    playing: false,
    currentTime: 0,
    duration: 100,
    play: mockPlay,
    pause: mockPause,
    seekTo: mockSeekTo,
    release: mockRelease,
    addListener: mockAddListener,
  })),
  setAudioModeAsync: jest.fn(),
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
    it('should create a player and return it', async () => {
      const { createAudioPlayer } = require('expo-audio');
      const result = await manager.loadAsync('file:///test.mp3');
      expect(createAudioPlayer).toHaveBeenCalledWith({ uri: 'file:///test.mp3' });
      expect(result).toBeTruthy();
    });

    it('should release previous player before loading new one', async () => {
      await manager.loadAsync('file:///first.mp3');
      await manager.loadAsync('file:///second.mp3');
      expect(mockRelease).toHaveBeenCalled();
    });
  });

  describe('playAsync', () => {
    it('should call play on the player', async () => {
      await manager.loadAsync('file:///test.mp3');
      await manager.playAsync();
      expect(mockPlay).toHaveBeenCalled();
    });

    it('should not throw on error', async () => {
      await manager.loadAsync('file:///test.mp3');
      mockPlay.mockImplementationOnce(() => { throw new Error('fail'); });
      await expect(manager.playAsync()).resolves.not.toThrow();
    });
  });

  describe('pauseAsync', () => {
    it('should not throw on error', async () => {
      await manager.loadAsync('file:///test.mp3');
      mockPause.mockImplementationOnce(() => { throw new Error('fail'); });
      await expect(manager.pauseAsync()).resolves.not.toThrow();
    });
  });

  describe('setPositionAsync', () => {
    it('should call seekTo with seconds', async () => {
      await manager.loadAsync('file:///test.mp3');
      await manager.setPositionAsync(30);
      expect(mockSeekTo).toHaveBeenCalledWith(30);
    });
  });

  describe('event system', () => {
    it('should register and unregister event handlers', () => {
      const handler = jest.fn();
      const unsubscribe = manager.on(AMEventNames.PlaybackStatusUpdate, handler);
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
  });
});
