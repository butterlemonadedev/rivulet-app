import React, { useEffect } from 'react';
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

export function HomeScreen() {
  const { data, addGlass, setGoal, reload } = useWaterData();
  const { ui, water } = useTheme();
  const { trackGlass } = useInterstitialManager(data?.installedAt);
  const fillLevel = useSharedValue(0);

  // Sync fill level with data
  useEffect(() => {
    if (!data) return;
    const level = Math.min(data.today.glasses / data.today.goal, 1.2);
    fillLevel.value = withSpring(level, { damping: 12, stiffness: 90 });
  }, [data?.today.glasses, data?.today.goal]);

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

    if (Platform.OS === 'android') {
      const newGlasses = (data?.today.glasses ?? 0) + 1;
      const goal = data?.today.goal ?? 8;
      requestWidgetUpdate({
        widgetName: 'WaterTracker',
        renderWidget: () => <WaterWidget glasses={newGlasses} goal={goal} />,
        widgetNotFound: () => {},
      });
    }
  };

  if (!data) return null;

  return (
    <View style={[styles.container, { backgroundColor: ui.background }]}>
      <WaterCanvas fillLevel={fillLevel} colors={water} onTap={handleTap} />
      <View style={styles.overlay} pointerEvents="none">
        <Text style={[styles.count, { color: ui.text }]}>
          {data.today.glasses}
        </Text>
        {data.today.glasses > data.today.goal ? (
          <Text style={[styles.label, { color: ui.textSecondary }]}>
            {data.today.goal} reached — keep going!
          </Text>
        ) : data.today.glasses === 0 ? (
          <Text style={[styles.label, { color: ui.textSecondary }]}>
            Tap to start hydrating
          </Text>
        ) : (
          <Text style={[styles.label, { color: ui.textSecondary }]}>
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
