import React from 'react';
import {
  Canvas, Path, LinearGradient, vec, Skia, BlurMask,
} from '@shopify/react-native-skia';
import { BAR_COUNT, NEON_COLORS, type VisualizerRendererProps } from '../types';

const LAYERS = [
  { amplitude: 80, color: NEON_COLORS[0], blur: 0, width: 2.5 },
  { amplitude: 65, color: NEON_COLORS[1], blur: 3, width: 2 },
  { amplitude: 50, color: NEON_COLORS[2], blur: 5, width: 2 },
  { amplitude: 35, color: NEON_COLORS[3], blur: 8, width: 1.5 },
];

function buildWavePath(
  barData: number[],
  canvasSize: number,
  midY: number,
  amplitude: number,
  offset: number
) {
  const path = Skia.Path.Make();
  const step = canvasSize / (BAR_COUNT - 1);

  for (let i = 0; i < BAR_COUNT; i++) {
    const x = i * step;
    const value = barData[i] || 0;
    const y = midY - value * amplitude + offset;

    if (i === 0) {
      path.moveTo(x, y);
    } else {
      const prevX = (i - 1) * step;
      const prevValue = barData[i - 1] || 0;
      const prevY = midY - prevValue * amplitude + offset;
      const cpX = (prevX + x) / 2;
      path.cubicTo(cpX, prevY, cpX, y, x, y);
    }
  }
  return path;
}

function buildFillPath(
  barData: number[],
  canvasSize: number,
  midY: number,
  amplitude: number,
) {
  const path = buildWavePath(barData, canvasSize, midY, amplitude, 0);
  path.lineTo(canvasSize, canvasSize);
  path.lineTo(0, canvasSize);
  path.close();
  return path;
}

export function WaveLine({
  barData, canvasSize, center,
}: VisualizerRendererProps) {
  const midY = center;

  return (
    <Canvas style={{ width: canvasSize, height: canvasSize }}>
      {/* 渐变填充 */}
      <Path path={buildFillPath(barData, canvasSize, midY, 70)} style="fill">
        <LinearGradient
          start={vec(0, midY - 80)}
          end={vec(0, canvasSize)}
          colors={[NEON_COLORS[0] + '20', NEON_COLORS[2] + '08', '#00000000']}
        />
      </Path>

      {/* 多层彩色波浪线 */}
      {LAYERS.map((layer, idx) => {
        const wavePath = buildWavePath(barData, canvasSize, midY, layer.amplitude, idx * 6);
        return (
          <React.Fragment key={idx}>
            {/* 光晕 */}
            {layer.blur > 0 && (
              <Path
                path={wavePath}
                style="stroke"
                strokeWidth={layer.width + 4}
                strokeCap="round"
                color={layer.color + '30'}
              >
                <BlurMask blur={layer.blur} style="normal" />
              </Path>
            )}
            {/* 线条 */}
            <Path
              path={wavePath}
              style="stroke"
              strokeWidth={layer.width}
              strokeCap="round"
            >
              <LinearGradient
                start={vec(0, midY)}
                end={vec(canvasSize, midY)}
                colors={[layer.color, NEON_COLORS[(idx + 2) % NEON_COLORS.length], layer.color]}
              />
            </Path>
          </React.Fragment>
        );
      })}

      {/* 底部镜像（淡） */}
      <Path
        path={buildWavePath(barData, canvasSize, midY, -25, 0)}
        style="stroke"
        strokeWidth={1}
        strokeCap="round"
        color={NEON_COLORS[0] + '20'}
      />
    </Canvas>
  );
}
