export const BAR_COUNT = 64;

export type VisualizerRendererProps = {
  barData: number[];
  canvasSize: number;
  center: number;
  tintColor: string;
  isPlaying: boolean;
};

export enum VisualizerMode {
  CircularSpectrum = 'circular',
  BarSpectrum = 'bars',
  WaveLine = 'wave',
  ParticleBurst = 'particle',
  Ripple = 'ripple',
  Terrain = 'terrain',
}

export const VisualizerModeList = Object.values(VisualizerMode);

/** 炫彩渐变色板 */
export const SPECTRUM_COLORS = ['#00f0ff', '#0080ff', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#facc15'];
export const NEON_COLORS = ['#00f0ff', '#00ff88', '#a855f7', '#ff006e'];
export const FIRE_COLORS = ['#facc15', '#f97316', '#ef4444', '#ec4899', '#a855f7'];
