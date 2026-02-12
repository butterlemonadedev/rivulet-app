import { useColorScheme } from 'react-native';
import { LIGHT, DARK, WATER_THEMES, WaterThemeName } from '../constants/colors';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const ui = isDark ? DARK : LIGHT;
  const water = WATER_THEMES.default;

  return { ui, water, isDark };
}
