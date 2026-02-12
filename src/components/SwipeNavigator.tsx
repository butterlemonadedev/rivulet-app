import React from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface SwipeNavigatorProps {
  children: [React.ReactElement, React.ReactElement]; // exactly 2 screens
}

export function SwipeNavigator({ children }: SwipeNavigatorProps) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const currentPage = useSharedValue(0); // 0 = Home, 1 = History

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // require 20px horizontal movement to activate
    .onUpdate((e) => {
      'worklet';
      const base = -currentPage.value * width;
      // Clamp: can't go right past Home, or left past History
      const raw = base + e.translationX;
      translateX.value = Math.max(-width, Math.min(0, raw));
    })
    .onEnd((e) => {
      'worklet';
      const base = -currentPage.value * width;
      const velocity = e.velocityX;
      const displacement = e.translationX;

      // Decide whether to snap to next page or snap back
      let targetPage = currentPage.value;
      if (displacement < -width * 0.3 || velocity < -500) {
        targetPage = Math.min(1, currentPage.value + 1);
      } else if (displacement > width * 0.3 || velocity > 500) {
        targetPage = Math.max(0, currentPage.value - 1);
      }

      currentPage.value = targetPage;
      translateX.value = withSpring(-targetPage * width, {
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, { width: width * 2 }, animatedStyle]}>
        <Animated.View style={[styles.page, { width }]}>{children[0]}</Animated.View>
        <Animated.View style={[styles.page, { width }]}>{children[1]}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    flex: 1,
  },
});
