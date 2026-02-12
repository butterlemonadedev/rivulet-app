import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeNavigator } from './components/SwipeNavigator';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { updateGoal, loadWaterData } from './services/waterStorage';
import { initializeAds } from './services/adService';

const ONBOARDING_KEY = 'drip_onboarding_complete';

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setIsOnboarded(val === 'true');
    });
  }, []);

  useEffect(() => {
    initializeAds().catch(console.error);
  }, []);

  const handleOnboardingComplete = async (goal: number) => {
    const data = await loadWaterData();
    await updateGoal(data, goal);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOnboarded(true);
  };

  if (isOnboarded === null) return null; // loading

  if (!isOnboarded) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SwipeNavigator>
        <HomeScreen />
        <HistoryScreen />
      </SwipeNavigator>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
