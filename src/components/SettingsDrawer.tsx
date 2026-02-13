import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../hooks/useTheme';

interface SettingsDrawerProps {
  goal: number;
  onGoalChange: (newGoal: number) => void;
}

export function SettingsDrawer({ goal, onGoalChange }: SettingsDrawerProps) {
  const { ui, isDark } = useTheme();
  const { height: screenHeight } = useWindowDimensions();
  const DRAWER_HEIGHT = 280;
  const translateY = useSharedValue(-DRAWER_HEIGHT);
  const isOpen = useSharedValue(false);

  const open = useCallback(() => {
    'worklet';
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    isOpen.value = true;
  }, []);

  const close = useCallback(() => {
    'worklet';
    translateY.value = withSpring(-DRAWER_HEIGHT, { damping: 20, stiffness: 200 });
    isOpen.value = false;
  }, []);

  // Pull-down gesture from top of screen
  const panGesture = Gesture.Pan()
    .activeOffsetY([10, 10]) // 10px vertical movement to activate
    .onUpdate((e) => {
      'worklet';
      if (!isOpen.value) {
        // Opening: drag down
        translateY.value = Math.min(0, Math.max(-DRAWER_HEIGHT, -DRAWER_HEIGHT + e.translationY));
      } else {
        // Closing: drag up
        translateY.value = Math.min(0, Math.max(-DRAWER_HEIGHT, e.translationY));
      }
    })
    .onEnd((e) => {
      'worklet';
      if (!isOpen.value) {
        // Opening threshold
        if (e.translationY > DRAWER_HEIGHT * 0.3 || e.velocityY > 500) {
          open();
        } else {
          close();
        }
      } else {
        // Closing threshold
        if (e.translationY < -DRAWER_HEIGHT * 0.3 || e.velocityY < -500) {
          close();
        } else {
          open();
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const decrementGoal = () => {
    if (goal > 1) onGoalChange(goal - 1);
  };

  const incrementGoal = () => {
    if (goal < 20) onGoalChange(goal + 1);
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.drawer,
          {
            height: DRAWER_HEIGHT,
            backgroundColor: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
          },
          animatedStyle,
        ]}
      >
        {/* Handle bar */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: isDark ? '#555' : '#ccc' }]} />
        </View>

        <Text style={[styles.title, { color: ui.text }]}>Settings</Text>

        {/* Goal Row */}
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: ui.text }]}>Daily Goal</Text>
          <View style={styles.stepper}>
            <Pressable onPress={decrementGoal} style={styles.stepperBtn}>
              <Text style={[styles.stepperText, { color: ui.textSecondary }]}>{'\u2212'}</Text>
            </Pressable>
            <Text style={[styles.goalValue, { color: ui.text }]}>{goal}</Text>
            <Pressable onPress={incrementGoal} style={styles.stepperBtn}>
              <Text style={[styles.stepperText, { color: ui.textSecondary }]}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: ui.text }]}>Appearance</Text>
          <Text style={[styles.rowValue, { color: ui.textSecondary }]}>System</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '300',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    fontSize: 24,
    fontWeight: '300',
  },
  goalValue: {
    fontSize: 24,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'center',
  },
});
