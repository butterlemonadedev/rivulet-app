import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { WaterCanvas } from './components/WaterCanvas';
import { WATER_THEMES } from './constants/colors';

export default function App() {
  const fillLevel = useSharedValue(0);

  useEffect(() => {
    fillLevel.value = withSpring(0.5, { damping: 10, stiffness: 80 });
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <WaterCanvas fillLevel={fillLevel} colors={WATER_THEMES.default} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
});
