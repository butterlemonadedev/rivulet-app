import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RATING_KEY = 'rivulet_rating_prompted';
const STREAK_KEY = 'rivulet_streak_count';
const STREAK_DATE_KEY = 'rivulet_streak_last_date';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function checkAndPromptRating(glassesLogged: number): Promise<void> {
  if (glassesLogged < 1) return;

  const prompted = await AsyncStorage.getItem(RATING_KEY);
  if (prompted === 'true') return;

  const streakRaw = await AsyncStorage.getItem(STREAK_KEY);
  const streak = streakRaw ? parseInt(streakRaw, 10) : 0;

  if (streak >= 7) {
    const isAvailable = await StoreReview.isAvailableAsync();
    if (isAvailable) {
      await StoreReview.requestReview();
      await AsyncStorage.setItem(RATING_KEY, 'true');
    }
  }
}

export async function updateStreak(glassesToday: number): Promise<void> {
  const today = todayKey();
  const lastDate = await AsyncStorage.getItem(STREAK_DATE_KEY);

  // Already updated today
  if (lastDate === today) return;

  const streakRaw = await AsyncStorage.getItem(STREAK_KEY);
  let streak = streakRaw ? parseInt(streakRaw, 10) : 0;

  if (glassesToday >= 1) {
    streak += 1;
  } else {
    streak = 0;
  }

  await AsyncStorage.setItem(STREAK_KEY, String(streak));
  await AsyncStorage.setItem(STREAK_DATE_KEY, today);
}
