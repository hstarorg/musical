import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Path,
  LinearGradient,
  vec,
  Skia,
  BlurMask,
  Circle,
  Group,
  Rect,
} from '@shopify/react-native-skia';
import { AudioManager } from '@/libs/AudioManager';
import type { AudioSample } from 'expo-audio';

const BAR_COUNT = 64;
const DECAY = 0.88;
const INNER_RADIUS = 60;
const MAX_BAR_HEIGHT = 55;

type Props = {
  isPlaying?: boolean;
  tintColor?: string;
  style?: any;
};

export function WaveformVisualizer({
  isPlaying,
  tintColor = '#0a7ea4',
  style,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const canvasSize = Math.min(screenWidth - 32, 300);
  const center = canvasSize / 2;

  const peakValues = useRef(new Float32Array(BAR_COUNT)).current;
  const [barData, setBarData] = useState<number[]>(
    () => new Array(BAR_COUNT).fill(0)
  );
  const frameRef = useRef<number>(0);

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

      // 节流：每 2 帧更新一次 UI
      frameRef.current++;
      if (frameRef.current % 2 === 0) {
        setBarData(newData);
      }
    },
    [peakValues]
  );

  useEffect(() => {
    const player = AudioManager.instance.getPlayer();
    if (!player) return;
    const sub = player.addListener('audioSampleUpdate', handleSample);
    return () => sub.remove();
  }, [isPlaying, handleSample]);

  useEffect(() => {
    if (!isPlaying) {
      peakValues.fill(0);
      setBarData(new Array(BAR_COUNT).fill(0));
    }
  }, [isPlaying, peakValues]);

  // 构建环形频谱路径
  const barsPath = Skia.Path.Make();
  const mirrorPath = Skia.Path.Make();
  const barAngle = (Math.PI * 2) / BAR_COUNT;
  const barWidth = 3;

  for (let i = 0; i < BAR_COUNT; i++) {
    const angle = i * barAngle - Math.PI / 2;
    const value = barData[i] || 0;
    const barHeight = 4 + value * MAX_BAR_HEIGHT;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // 外圈柱状条
    const x1 = center + (INNER_RADIUS + 2) * cos;
    const y1 = center + (INNER_RADIUS + 2) * sin;
    const x2 = center + (INNER_RADIUS + 2 + barHeight) * cos;
    const y2 = center + (INNER_RADIUS + 2 + barHeight) * sin;

    barsPath.moveTo(x1, y1);
    barsPath.lineTo(x2, y2);

    // 内圈镜像（较短）
    const mirrorHeight = 2 + value * 20;
    const mx1 = center + (INNER_RADIUS - 2) * cos;
    const my1 = center + (INNER_RADIUS - 2) * sin;
    const mx2 = center + (INNER_RADIUS - 2 - mirrorHeight) * cos;
    const my2 = center + (INNER_RADIUS - 2 - mirrorHeight) * sin;

    mirrorPath.moveTo(mx1, my1);
    mirrorPath.lineTo(mx2, my2);
  }

  // 波浪线路径
  const wavePath = Skia.Path.Make();
  wavePath.moveTo(
    center + INNER_RADIUS * Math.cos(-Math.PI / 2),
    center + INNER_RADIUS * Math.sin(-Math.PI / 2)
  );
  for (let i = 0; i <= BAR_COUNT; i++) {
    const angle = (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
    const value = barData[i % BAR_COUNT] || 0;
    const r = INNER_RADIUS + 2 + value * MAX_BAR_HEIGHT * 0.6;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    if (i === 0) wavePath.moveTo(x, y);
    else wavePath.lineTo(x, y);
  }
  wavePath.close();

  return (
    <View style={[styles.container, style]}>
      <Canvas style={{ width: canvasSize, height: canvasSize }}>
        {/* 背景光晕 */}
        <Circle cx={center} cy={center} r={INNER_RADIUS + 10}>
          <BlurMask blur={20} style="normal" />
          <LinearGradient
            start={vec(center - 60, center - 60)}
            end={vec(center + 60, center + 60)}
            colors={[tintColor + '30', tintColor + '10']}
          />
        </Circle>

        {/* 中心圆 */}
        <Circle
          cx={center}
          cy={center}
          r={INNER_RADIUS}
          color={tintColor + '15'}
          style="fill"
        />
        <Circle
          cx={center}
          cy={center}
          r={INNER_RADIUS}
          color={tintColor + '40'}
          style="stroke"
          strokeWidth={1.5}
        />

        {/* 波浪填充 */}
        <Path path={wavePath} style="fill" color={tintColor + '12'} />

        {/* 外圈频谱柱 */}
        <Group>
          <Path
            path={barsPath}
            style="stroke"
            strokeWidth={barWidth}
            strokeCap="round"
          >
            <LinearGradient
              start={vec(center, center - INNER_RADIUS - MAX_BAR_HEIGHT)}
              end={vec(center, center + INNER_RADIUS + MAX_BAR_HEIGHT)}
              colors={[tintColor, '#e74c3c', '#f39c12']}
            />
          </Path>
        </Group>

        {/* 外圈光晕层 */}
        <Path
          path={barsPath}
          style="stroke"
          strokeWidth={barWidth + 4}
          strokeCap="round"
          color={tintColor + '25'}
        >
          <BlurMask blur={6} style="normal" />
        </Path>

        {/* 内圈镜像柱 */}
        <Path
          path={mirrorPath}
          style="stroke"
          strokeWidth={2}
          strokeCap="round"
          color={tintColor + '50'}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
