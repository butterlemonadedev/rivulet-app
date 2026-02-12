import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterThemeName } from '../constants/colors';

const THEME_KEY = 'drip_theme_unlocks';
const ACTIVE_THEME_KEY = 'drip_active_theme';

interface ThemeUnlocks {
  [themeName: string]: string; // ISO timestamp of when the unlock expires
}

export async function getUnlockedThemes(): Promise<ThemeUnlocks> {
  const raw = await AsyncStorage.getItem(THEME_KEY);
  if (!raw) return {};
  const unlocks: ThemeUnlocks = JSON.parse(raw);
  // Clean expired
  const now = Date.now();
  const valid: ThemeUnlocks = {};
  for (const [key, expiry] of Object.entries(unlocks)) {
    if (new Date(expiry).getTime() > now) {
      valid[key] = expiry;
    }
  }
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(valid));
  return valid;
}

export async function unlockTheme(themeName: WaterThemeName): Promise<void> {
  const unlocks = await getUnlockedThemes();
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  unlocks[themeName] = expiry;
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(unlocks));
}

export async function getActiveTheme(): Promise<WaterThemeName> {
  const val = await AsyncStorage.getItem(ACTIVE_THEME_KEY);
  return (val as WaterThemeName) || 'default';
}

export async function setActiveTheme(themeName: WaterThemeName): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_THEME_KEY, themeName);
}
