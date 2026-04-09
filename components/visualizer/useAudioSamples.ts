import { useEffect, useRef, useCallback, useState } from 'react';
import { AudioManager, AMEventNames } from '@/libs/AudioManager';
import type { AudioSample } from 'expo-audio';
import { BAR_COUNT } from './types';

const DECAY = 0.88;

export function useAudioSamples(isPlaying: boolean): number[] {
  const peakValues = useRef(new Float32Array(BAR_COUNT)).current;
  const [barData, setBarData] = useState<number[]>(
    () => new Array(BAR_COUNT).fill(0)
  );
  const frameRef = useRef(0);
  const [playerVersion, setPlayerVersion] = useState(0);

  // 监听 player 实例变化（切歌时触发）
  useEffect(() => {
    const unsub = AudioManager.instance.on(AMEventNames.PlayerChanged, () => {
      setPlayerVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  const handleSample = useCallback(
    (sample: AudioSample) => {
      const frames = sample.channels?.[0]?.frames;
      if (!frames || frames.length === 0) return;

      const bucketSize = Math.max(1, Math.floor(frames.length / BAR_COUNT));
      const newData = new Array(BAR_COUNT);

      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        const start = i * bucketSize;
        const end = Math.min(start + bucketSize, frames.length);
        for (let j = start; j < end; j++) {
          sum += frames[j] * frames[j];
        }
        const rms = Math.sqrt(sum / (end - start));
        const normalized = Math.min(rms * 4, 1);
        peakValues[i] = Math.max(normalized, peakValues[i] * DECAY);
        newData[i] = peakValues[i];
      }

      frameRef.current++;
      if (frameRef.current % 2 === 0) {
        setBarData(newData);
      }
    },
    [peakValues]
  );

  // 订阅当前 player 的 audioSampleUpdate，playerVersion 变化时重新订阅
  useEffect(() => {
    const player = AudioManager.instance.getPlayer();
    if (!player) return;
    const sub = player.addListener('audioSampleUpdate', handleSample);
    return () => sub.remove();
  }, [playerVersion, handleSample]);

  useEffect(() => {
    if (!isPlaying) {
      peakValues.fill(0);
      setBarData(new Array(BAR_COUNT).fill(0));
    }
  }, [isPlaying, peakValues]);

  return barData;
}
