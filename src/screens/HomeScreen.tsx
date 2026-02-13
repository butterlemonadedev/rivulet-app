import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { WaterWidget } from '../widgets/WaterWidget';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { WaterCanvas } from '../components/WaterCanvas';
import { SettingsDrawer } from '../components/SettingsDrawer';
import { useWaterData } from '../hooks/useWaterData';
import { useTheme } from '../hooks/useTheme';
import { useInterstitialManager } from '../hooks/useInterstitialManager';
import { updateWidgetData, reloadWidgetTimelines } from '../services/widgetBridge';
import { checkAndPromptRating, updateStreak } from '../services/ratingService';

export function HomeScreen() {
  const { data, addGlass, setGoal, reload } = useWaterData();
  const { ui, water } = useTheme();
  const { trackGlass } = useInterstitialManager(data?.installedAt);
  const fillLevel = useSharedValue(0);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const prevGlasses = useRef(0);

  // Sync fill level with data
  useEffect(() => {
    if (!data) return;
    const level = Math.min(data.today.glasses / data.today.goal, 1.2);
    fillLevel.value = withSpring(level, { damping: 12, stiffness: 90 });
  }, [data?.today.glasses, data?.today.goal]);

  // Detect goal reached — fire celebration
  useEffect(() => {
    if (!data) return;
    const { glasses, goal } = data.today;
    if (prevGlasses.current < goal && glasses >= goal) {
      setCelebrationKey((k) => k + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    prevGlasses.current = glasses;
  }, [data?.today.glasses]);

  // Update streak and check for rating prompt
  useEffect(() => {
    if (data && data.today.glasses > 0) {
      updateStreak(data.today.glasses);
      checkAndPromptRating(data.today.glasses);
    }
  }, [data?.today.glasses]);

  // Midnight reset — check every 60s if the date rolled over
  useEffect(() => {
    const interval = setInterval(() => {
      reload();
    }, 60000);
    return () => clearInterval(interval);
  }, [reload]);

  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addGlass();
    trackGlass();

    const newGlasses = (data?.today.glasses ?? 0) + 1;
    const goal = data?.today.goal ?? 8;

    if (Platform.OS === 'android') {
      requestWidgetUpdate({
        widgetName: 'WaterTracker',
        renderWidget: () => <WaterWidget glasses={newGlasses} goal={goal} />,
        widgetNotFound: () => {},
      });
    } else {
      updateWidgetData(newGlasses, goal).then(() => reloadWidgetTimelines());
    }
  };

  if (!data) return null;

  const goalReached = data.today.glasses >= data.today.goal && data.today.glasses > 0;
  // When water fills most of the screen, use bright text so it's readable against blue
  const fillPct = data.today.glasses / data.today.goal;
  const labelColor = fillPct >= 0.6 ? 'rgba(255,255,255,0.85)' : ui.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: ui.background }]}>
      <WaterCanvas
        fillLevel={fillLevel}
        colors={water}
        onTap={handleTap}
        celebrationKey={celebrationKey}
      />
      <View style={styles.overlay} pointerEvents="none">
        <Text style={[styles.count, { color: ui.text }]}>
          {data.today.glasses}
        </Text>
        {data.today.glasses > data.today.goal ? (
          <Text style={[styles.label, { color: labelColor }]}>
            {data.today.goal} reached {'\u2014'} keep going!
          </Text>
        ) : goalReached ? (
          <Text style={[styles.label, { color: labelColor }]}>
            Goal reached!
          </Text>
        ) : data.today.glasses === 0 ? (
          <Text style={[styles.label, { color: ui.textSecondary }]}>
            Tap to start hydrating
          </Text>
        ) : (
          <Text style={[styles.label, { color: labelColor }]}>
            of {data.today.goal} glasses
          </Text>
        )}
      </View>
      <SettingsDrawer goal={data.today.goal} onGoalChange={setGoal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
  },
  count: {
    fontSize: 72,
    fontWeight: '500',
    letterSpacing: -3,
  },
  label: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
