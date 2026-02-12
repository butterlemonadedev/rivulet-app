export const WATER_THEMES = {
  default: {
    surface: '#48CAE4',
    mid: '#0077B6',
    deep: '#023E8A',
    backWaveOpacity: 0.55,
  },
  roseGold: {
    surface: '#F4A8C6',
    mid: '#D4708F',
    deep: '#8B3A62',
    backWaveOpacity: 0.5,
  },
  deepOcean: {
    surface: '#1B4965',
    mid: '#0B2545',
    deep: '#051B2C',
    backWaveOpacity: 0.6,
  },
  arctic: {
    surface: '#CAF0F8',
    mid: '#90E0EF',
    deep: '#48CAE4',
    backWaveOpacity: 0.45,
  },
  emerald: {
    surface: '#52B788',
    mid: '#2D6A4F',
    deep: '#1B4332',
    backWaveOpacity: 0.5,
  },
} as const;

export type WaterThemeName = keyof typeof WATER_THEMES;

export const LIGHT = {
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#999999',
  settingsOverlay: 'rgba(255,255,255,0.85)',
};

export const DARK = {
  background: '#000000',
  text: '#FFFFFF',
  textSecondary: '#666666',
  settingsOverlay: 'rgba(0,0,0,0.85)',
};
