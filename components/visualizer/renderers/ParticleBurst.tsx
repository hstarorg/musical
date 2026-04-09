import React, { useRef } from 'react';
import {
  Canvas, Circle, BlurMask, vec, Line, SweepGradient,
} from '@shopify/react-native-skia';
import { BAR_COUNT, SPECTRUM_COLORS, type VisualizerRendererProps } from '../types';

const RING_COUNT = 3;
const MAX_RADIUS = 120;
const PARTICLE_SIZE_BASE = 2;
const PARTICLE_SIZE_MAX = 5;

export function ParticleBurst({
  barData, canvasSize, center,
}: VisualizerRendererProps) {
  const angleOffsets = useRef(
    Array.from({ length: RING_COUNT }, (_, ring) => ring * 0.3)
  ).current;

  const avgEnergy = barData.reduce((s, v) => s + v, 0) / BAR_COUNT;

  return (
    <Canvas style={{ width: canvasSize, height: canvasSize }}>
      {/* 中心彩色发光 */}
      <Circle cx={center} cy={center} r={18 + avgEnergy * 28}>
        <BlurMask blur={15} style="normal" />
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS, SPECTRUM_COLORS[0]]} />
      </Circle>
      <Circle cx={center} cy={center} r={8 + avgEnergy * 12}>
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS, SPECTRUM_COLORS[0]]} />
      </Circle>

      {/* 多环彩色粒子 */}
      {Array.from({ length: RING_COUNT }, (_, ring) => {
        const particlesPerRing = Math.floor(BAR_COUNT / RING_COUNT);
        const baseRadius = 30 + ring * 35;
        const ringRatio = (ring + 1) / RING_COUNT;

        return Array.from({ length: particlesPerRing }, (_, i) => {
          const dataIdx = ring * particlesPerRing + i;
          const value = barData[dataIdx] || 0;
          const angle =
            (i / particlesPerRing) * Math.PI * 2 - Math.PI / 2 + angleOffsets[ring];

          const r = baseRadius + value * (MAX_RADIUS - baseRadius) * ringRatio;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          const size = PARTICLE_SIZE_BASE + value * PARTICLE_SIZE_MAX * ringRatio;

          // 每个粒子从色谱中取色
          const colorIdx = Math.round((dataIdx / BAR_COUNT) * (SPECTRUM_COLORS.length - 1));
          const color = SPECTRUM_COLORS[colorIdx];
          const alpha = Math.floor(60 + value * 195).toString(16).padStart(2, '0');

          return (
            <React.Fragment key={`${ring}-${i}`}>
              {value > 0.12 && (
                <Line
                  p1={vec(center, center)}
                  p2={vec(x, y)}
                  color={color + '15'}
                  strokeWidth={0.5}
                />
              )}
              <Circle cx={x} cy={y} r={size + 3} color={color + '20'}>
                <BlurMask blur={5} style="normal" />
              </Circle>
              <Circle cx={x} cy={y} r={size} color={color + alpha} />
            </React.Fragment>
          );
        });
      })}

      {/* 外圈呼吸环 */}
      <Circle
        cx={center} cy={center}
        r={MAX_RADIUS + 10 + avgEnergy * 15}
        style="stroke" strokeWidth={1}
      >
        <SweepGradient c={vec(center, center)} colors={[...SPECTRUM_COLORS.map(c => c + '20'), SPECTRUM_COLORS[0] + '20']} />
      </Circle>
    </Canvas>
  );
}
