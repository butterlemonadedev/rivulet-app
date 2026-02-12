import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RATING_KEY = 'drip_rating_prompted';
const STREAK_KEY = 'drip_streak_count';

export async function checkAndPromptRating(glassesLogged: number): Promise<void> {
  // Only prompt if user logged at least 1 glass today
  if (glassesLogged < 1) return;

  // Check if we already prompted
  const prompted = await AsyncStorage.getItem(RATING_KEY);
  if (prompted === 'true') return;

  // Check streak
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

export async function updateStreak(glassesToday: number, goalToday: number): Promise<void> {
  const streakRaw = await AsyncStorage.getItem(STREAK_KEY);
  let streak = streakRaw ? parseInt(streakRaw, 10) : 0;

  if (glassesToday >= 1) {
    // User logged at least 1 glass — continue the streak
    // This is called on app open, not every glass, to avoid incrementing multiple times
    streak += 1;
  } else {
    streak = 0;
  }

  await AsyncStorage.setItem(STREAK_KEY, String(streak));
}
