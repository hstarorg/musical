import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioSamples } from './useAudioSamples';
import { VisualizerMode, VisualizerModeList, type VisualizerRendererProps } from './types';
import { CircularSpectrum } from './renderers/CircularSpectrum';
import { BarSpectrum } from './renderers/BarSpectrum';
import { WaveLine } from './renderers/WaveLine';
import { ParticleBurst } from './renderers/ParticleBurst';
import { Ripple } from './renderers/Ripple';
import { Terrain } from './renderers/Terrain';

type Props = {
  isPlaying?: boolean;
  tintColor?: string;
  style?: any;
};

const renderers: Record<
  VisualizerMode,
  React.FC<VisualizerRendererProps>
> = {
  [VisualizerMode.CircularSpectrum]: CircularSpectrum,
  [VisualizerMode.BarSpectrum]: BarSpectrum,
  [VisualizerMode.WaveLine]: WaveLine,
  [VisualizerMode.ParticleBurst]: ParticleBurst,
  [VisualizerMode.Ripple]: Ripple,
  [VisualizerMode.Terrain]: Terrain,
};

export function AudioVisualizer({
  isPlaying = false,
  tintColor = '#0a7ea4',
  style,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const canvasSize = Math.min(screenWidth - 32, 300);
  const center = canvasSize / 2;

  const [mode, setMode] = useState(VisualizerMode.CircularSpectrum);
  const barData = useAudioSamples(isPlaying);

  const STORAGE_KEY = 'visualizer_mode';

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && VisualizerModeList.includes(saved as VisualizerMode)) {
        setMode(saved as VisualizerMode);
      }
    });
  }, []);

  const handleToggle = () => {
    const idx = VisualizerModeList.indexOf(mode);
    const next = VisualizerModeList[(idx + 1) % VisualizerModeList.length];
    setMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const Renderer = renderers[mode];

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handleToggle} activeOpacity={0.8}>
        <Renderer
          barData={barData}
          canvasSize={canvasSize}
          center={center}
          tintColor={tintColor}
          isPlaying={isPlaying}
        />
      </TouchableOpacity>

      {/* 模式指示器 */}
      <View style={styles.dots}>
        {VisualizerModeList.map((m) => (
          <View
            key={m}
            style={[
              styles.dot,
              { backgroundColor: m === mode ? tintColor : tintColor + '30' },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
