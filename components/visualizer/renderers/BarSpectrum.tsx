import React from 'react';
import {
  Canvas, Rect, LinearGradient, vec, RoundedRect, BlurMask, Group,
} from '@shopify/react-native-skia';
import { BAR_COUNT, SPECTRUM_COLORS, type VisualizerRendererProps } from '../types';

const GAP = 2;
const MAX_HEIGHT = 100;

export function BarSpectrum({
  barData, canvasSize, center,
}: VisualizerRendererProps) {
  const barWidth = (canvasSize - GAP * BAR_COUNT) / BAR_COUNT;
  const midY = center;

  // 为每根柱子计算颜色（按位置从色谱中插值）
  const getBarColor = (i: number) => {
    const ratio = i / BAR_COUNT;
    const idx = ratio * (SPECTRUM_COLORS.length - 1);
    return SPECTRUM_COLORS[Math.round(idx)];
  };

  return (
    <Canvas style={{ width: canvasSize, height: canvasSize }}>
      {/* 中线 */}
      <Rect x={0} y={midY - 0.5} width={canvasSize} height={1} color="#ffffff10" />

      {barData.map((value, i) => {
        const x = i * (barWidth + GAP);
        const h = 2 + value * MAX_HEIGHT;
        const mirrorH = 2 + value * MAX_HEIGHT * 0.5;
        const color = getBarColor(i);

        return (
          <Group key={i}>
            {/* 上半部分 */}
            <RoundedRect x={x} y={midY - h} width={barWidth} height={h} r={1}>
              <LinearGradient
                start={vec(x, midY - MAX_HEIGHT)}
                end={vec(x, midY)}
                colors={[color, color + '60']}
              />
            </RoundedRect>

            {/* 光晕 */}
            <RoundedRect x={x - 1} y={midY - h - 1} width={barWidth + 2} height={h + 2} r={1} color={color + '20'}>
              <BlurMask blur={5} style="normal" />
            </RoundedRect>

            {/* 下半镜像 */}
            <RoundedRect x={x} y={midY} width={barWidth} height={mirrorH} r={1}>
              <LinearGradient
                start={vec(x, midY)}
                end={vec(x, midY + MAX_HEIGHT * 0.5)}
                colors={[color + '50', color + '05']}
              />
            </RoundedRect>
          </Group>
        );
      })}
    </Canvas>
  );
}
