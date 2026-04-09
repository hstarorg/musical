import React from 'react';
import {
  Canvas, Path, LinearGradient, vec, Skia,
  BlurMask, Circle, Group, SweepGradient,
} from '@shopify/react-native-skia';
import { BAR_COUNT, SPECTRUM_COLORS, type VisualizerRendererProps } from '../types';

const INNER_RADIUS = 60;
const MAX_BAR_HEIGHT = 55;
const BAR_WIDTH = 3;

export function CircularSpectrum({
  barData, canvasSize, center, tintColor,
}: VisualizerRendererProps) {
  const barAngle = (Math.PI * 2) / BAR_COUNT;

  const barsPath = Skia.Path.Make();
  const mirrorPath = Skia.Path.Make();

  for (let i = 0; i < BAR_COUNT; i++) {
    const angle = i * barAngle - Math.PI / 2;
    const value = barData[i] || 0;
    const barHeight = 4 + value * MAX_BAR_HEIGHT;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    barsPath.moveTo(
      center + (INNER_RADIUS + 2) * cos,
      center + (INNER_RADIUS + 2) * sin
    );
    barsPath.lineTo(
      center + (INNER_RADIUS + 2 + barHeight) * cos,
      center + (INNER_RADIUS + 2 + barHeight) * sin
    );

    const mh = 2 + value * 20;
    mirrorPath.moveTo(
      center + (INNER_RADIUS - 2) * cos,
      center + (INNER_RADIUS - 2) * sin
    );
    mirrorPath.lineTo(
      center + (INNER_RADIUS - 2 - mh) * cos,
      center + (INNER_RADIUS - 2 - mh) * sin
    );
  }

  const wavePath = Skia.Path.Make();
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
    <Canvas style={{ width: canvasSize, height: canvasSize }}>
      {/* 背景彩色光晕 */}
      <Circle cx={center} cy={center} r={INNER_RADIUS + 20}>
        <BlurMask blur={25} style="normal" />
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS, SPECTRUM_COLORS[0]]} />
      </Circle>

      {/* 中心圆 */}
      <Circle cx={center} cy={center} r={INNER_RADIUS} color="#00000040" style="fill" />
      <Circle cx={center} cy={center} r={INNER_RADIUS} style="stroke" strokeWidth={1.5}>
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS, SPECTRUM_COLORS[0]]} />
      </Circle>

      {/* 波浪填充 */}
      <Path path={wavePath} style="fill" color={tintColor + '10'} />

      {/* 外圈频谱柱 — 彩虹渐变 */}
      <Group>
        <Path path={barsPath} style="stroke" strokeWidth={BAR_WIDTH} strokeCap="round">
          <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS, SPECTRUM_COLORS[0]]} />
        </Path>
      </Group>

      {/* 外圈光晕 */}
      <Path path={barsPath} style="stroke" strokeWidth={BAR_WIDTH + 6} strokeCap="round">
        <BlurMask blur={8} style="normal" />
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS.map(c => c + '40'), SPECTRUM_COLORS[0] + '40']} />
      </Path>

      {/* 内圈镜像柱 */}
      <Path path={mirrorPath} style="stroke" strokeWidth={2} strokeCap="round">
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS.map(c => c + '60'), SPECTRUM_COLORS[0] + '60']} />
      </Path>
    </Canvas>
  );
}
