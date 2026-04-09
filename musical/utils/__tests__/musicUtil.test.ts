import { musicUtil } from '../musicUtil';

describe('musicUtil', () => {
  describe('duration2TimeStr', () => {
    it('should format 0ms as 00:00', () => {
      expect(musicUtil.duration2TimeStr(0)).toBe('00:00');
    });

    it('should format undefined as 00:00', () => {
      expect(musicUtil.duration2TimeStr(undefined)).toBe('00:00');
    });

    it('should format 60000ms as 01:00', () => {
      expect(musicUtil.duration2TimeStr(60000)).toBe('01:00');
    });

    it('should format 90000ms as 01:30', () => {
      expect(musicUtil.duration2TimeStr(90000)).toBe('01:30');
    });

    it('should format 3661000ms as 61:01', () => {
      expect(musicUtil.duration2TimeStr(3661000)).toBe('61:01');
    });

    it('should ceil partial seconds', () => {
      expect(musicUtil.duration2TimeStr(1500)).toBe('00:02');
    });
  });

  describe('padLeft', () => {
    it('should pad single digit number', () => {
      expect(musicUtil.padLeft(5, '0', 2)).toBe('05');
    });

    it('should not pad if already enough length', () => {
      expect(musicUtil.padLeft(10, '0', 2)).toBe('10');
    });

    it('should pad strings', () => {
      expect(musicUtil.padLeft('a', '*', 3)).toBe('**a');
    });
  });

  describe('findNextKey', () => {
    const keys = ['A', 'B', 'C'];

    it('should return next key', () => {
      expect(musicUtil.findNextKey(keys, 'A')).toBe('B');
    });

    it('should wrap around to first key', () => {
      expect(musicUtil.findNextKey(keys, 'C')).toBe('A');
    });

    it('should return first key for unknown current key', () => {
      expect(musicUtil.findNextKey(keys, 'Z')).toBe('A');
    });
  });
});
