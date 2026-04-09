import React from 'react';
import {
  Canvas, Path, LinearGradient, vec, Skia, BlurMask,
} from '@shopify/react-native-skia';
import { BAR_COUNT, FIRE_COLORS, type VisualizerRendererProps } from '../types';

const ROW_COUNT = 12;
const AMPLITUDE = 50;

function buildRow(
  barData: number[],
  canvasSize: number,
  y: number,
  amplitude: number,
  rowRatio: number,
) {
  const path = Skia.Path.Make();
  const step = canvasSize / (BAR_COUNT - 1);

  for (let i = 0; i < BAR_COUNT; i++) {
    const x = i * step;
    const value = barData[i] || 0;
    const h = value * amplitude * rowRatio;
    const py = y - h;

    if (i === 0) {
      path.moveTo(x, py);
    } else {
      const prevX = (i - 1) * step;
      const prevValue = barData[i - 1] || 0;
      const prevH = prevValue * amplitude * rowRatio;
      const prevY = y - prevH;
      const cpX = (prevX + x) / 2;
      path.cubicTo(cpX, prevY, cpX, py, x, py);
    }
  }
  return path;
}

function buildFillRow(
  barData: number[],
  canvasSize: number,
  y: number,
  amplitude: number,
  rowRatio: number,
  bottomY: number,
) {
  const path = buildRow(barData, canvasSize, y, amplitude, rowRatio);
  path.lineTo(canvasSize, bottomY);
  path.lineTo(0, bottomY);
  path.close();
  return path;
}

export function Terrain({
  barData, canvasSize, center,
}: VisualizerRendererProps) {
  const startY = canvasSize * 0.2;
  const rowSpacing = (canvasSize * 0.7) / ROW_COUNT;

  return (
    <Canvas style={{ width: canvasSize, height: canvasSize }}>
      {Array.from({ length: ROW_COUNT }, (_, rowIdx) => {
        const row = ROW_COUNT - 1 - rowIdx;
        const y = startY + row * rowSpacing;
        const rowRatio = (row + 1) / ROW_COUNT;

        // 从 FIRE_COLORS 中按行取色
        const colorIdx = Math.round(rowRatio * (FIRE_COLORS.length - 1));
        const color = FIRE_COLORS[colorIdx];
        const lineAlpha = Math.floor(30 + rowRatio * 225).toString(16).padStart(2, '0');
        const fillAlpha = Math.floor(5 + rowRatio * 50).toString(16).padStart(2, '0');

        return (
          <React.Fragment key={row}>
            {/* 山体填充 */}
            <Path
              path={buildFillRow(barData, canvasSize, y, AMPLITUDE, rowRatio, y + rowSpacing)}
              style="fill"
            >
              <LinearGradient
                start={vec(0, y - AMPLITUDE)}
                end={vec(0, y + rowSpacing)}
                colors={[color + fillAlpha, color + '03']}
              />
            </Path>

            {/* 山脊光晕（前排才有） */}
            {rowRatio > 0.5 && (
              <Path
                path={buildRow(barData, canvasSize, y, AMPLITUDE, rowRatio)}
                style="stroke"
                strokeWidth={3}
                strokeCap="round"
                color={color + '25'}
              >
                <BlurMask blur={6} style="normal" />
              </Path>
            )}

            {/* 山脊线 */}
            <Path
              path={buildRow(barData, canvasSize, y, AMPLITUDE, rowRatio)}
              style="stroke"
              strokeWidth={rowRatio > 0.7 ? 2 : 1}
              strokeCap="round"
            >
              <LinearGradient
                start={vec(0, y)}
                end={vec(canvasSize, y)}
                colors={[color + lineAlpha, FIRE_COLORS[(colorIdx + 2) % FIRE_COLORS.length] + lineAlpha, color + lineAlpha]}
              />
            </Path>
          </React.Fragment>
        );
      })}
    </Canvas>
  );
}
