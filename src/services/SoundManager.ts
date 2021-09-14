import Sound from 'react-native-sound';

export class SoundManager {
  sound: Sound | null = null;
  setSound(soundPath: string) {
    if (this.sound) {
      this.stop();
    }
    return new Promise((resolve, reject) => {
      this.sound = new Sound(soundPath, Sound.MAIN_BUNDLE, err => {
        if (err) {
          return reject(err);
        }
        resolve(this.sound);
      });
    });
  }

  play() {
    this.sound?.play();
  }

  pause() {
    this.sound?.pause();
  }

  stop() {
    this.sound?.stop(() => {
      this.sound?.release();
    });
  }

  getDuration() {
    return this.sound?.getDuration() || 0;
  }

  getCurrentTime() {
    return new Promise(resolve => {
      this.sound?.getCurrentTime((seconds, isPlaying) => {
        resolve({ seconds, isPlaying });
      });
    });
  }
}

export const soundManager = new SoundManager();
