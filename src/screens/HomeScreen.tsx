import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { WaterCanvas } from '../components/WaterCanvas';
import { useWaterData } from '../hooks/useWaterData';
import { useTheme } from '../hooks/useTheme';

export function HomeScreen() {
  const { data, addGlass } = useWaterData();
  const { ui, water } = useTheme();
  const fillLevel = useSharedValue(0);

  // Sync fill level with data
  useEffect(() => {
    if (!data) return;
    const level = Math.min(data.today.glasses / data.today.goal, 1.2);
    fillLevel.value = withSpring(level, { damping: 12, stiffness: 90 });
  }, [data?.today.glasses, data?.today.goal]);

  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addGlass();
  };

  if (!data) return null;

  return (
    <View style={[styles.container, { backgroundColor: ui.background }]}>
      <WaterCanvas fillLevel={fillLevel} colors={water} onTap={handleTap} />
      <View style={styles.overlay} pointerEvents="none">
        <Text style={[styles.count, { color: ui.text }]}>
          {data.today.glasses}
        </Text>
        <Text style={[styles.label, { color: ui.textSecondary }]}>
          of {data.today.goal} glasses
        </Text>
      </View>
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
