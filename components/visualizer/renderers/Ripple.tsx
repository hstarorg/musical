import React, { useRef } from 'react';
import {
  Canvas, Circle, BlurMask, vec, SweepGradient,
} from '@shopify/react-native-skia';
import { BAR_COUNT, SPECTRUM_COLORS, type VisualizerRendererProps } from '../types';

const MAX_RINGS = 8;
const MAX_RADIUS = 130;

export function Ripple({
  barData, canvasSize, center,
}: VisualizerRendererProps) {
  const ringValues = useRef(new Array(MAX_RINGS).fill(0)).current;
  const bucketSize = Math.floor(BAR_COUNT / MAX_RINGS);

  for (let ring = 0; ring < MAX_RINGS; ring++) {
    let sum = 0;
    for (let j = 0; j < bucketSize; j++) {
      sum += barData[ring * bucketSize + j] || 0;
    }
    const avg = sum / bucketSize;
    ringValues[ring] = Math.max(avg, ringValues[ring] * 0.92);
  }

  const totalEnergy = barData.reduce((s, v) => s + v, 0) / BAR_COUNT;

  return (
    <Canvas style={{ width: canvasSize, height: canvasSize }}>
      {ringValues.map((value, i) => {
        const ringIdx = MAX_RINGS - 1 - i;
        const baseRadius = 20 + (ringIdx / MAX_RINGS) * MAX_RADIUS;
        const pulse = value * 15;
        const r = baseRadius + pulse;
        const strokeWidth = 1.5 + value * 4;

        // 每层环从色谱取不同颜色
        const colorIdx = Math.round((ringIdx / MAX_RINGS) * (SPECTRUM_COLORS.length - 1));
        const color = SPECTRUM_COLORS[colorIdx];
        const alpha = Math.floor(40 + value * 180).toString(16).padStart(2, '0');

        return (
          <React.Fragment key={i}>
            <Circle
              cx={center} cy={center} r={r}
              color={color + '15'}
              style="stroke" strokeWidth={strokeWidth + 6}
            >
              <BlurMask blur={8} style="normal" />
            </Circle>
            <Circle
              cx={center} cy={center} r={r}
              color={color + alpha}
              style="stroke" strokeWidth={strokeWidth}
            />
          </React.Fragment>
        );
      })}

      {/* 中心彩色发光核 */}
      <Circle cx={center} cy={center} r={14 + totalEnergy * 22}>
        <BlurMask blur={18} style="normal" />
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS, SPECTRUM_COLORS[0]]} />
      </Circle>
      <Circle cx={center} cy={center} r={6 + totalEnergy * 8}>
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS, SPECTRUM_COLORS[0]]} />
      </Circle>

      {/* 最外圈 */}
      <Circle
        cx={center} cy={center}
        r={MAX_RADIUS + 10 + totalEnergy * 12}
        style="stroke" strokeWidth={1}
      >
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS.map(c => c + '15'), SPECTRUM_COLORS[0] + '15']} />
      </Circle>
    </Canvas>
  );
}
