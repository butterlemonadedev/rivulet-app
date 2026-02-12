import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Canvas,
  Path,
  LinearGradient,
  Skia,
  vec,
  useClock,
  Circle,
} from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useSharedValue,
  interpolate,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SEGMENTS = 60;

function buildWavePath(
  width: number,
  height: number,
  fillY: number,
  amplitude: number,
  frequency: number,
  phase: number,
) {
  'worklet';
  const path = Skia.Path.Make();
  const step = width / SEGMENTS;
  path.moveTo(0, fillY + amplitude * Math.sin(phase));
  for (let i = 1; i <= SEGMENTS; i++) {
    const x = i * step;
    const y = fillY + amplitude * Math.sin(
      (x / width) * frequency * 2 * Math.PI + phase
    );
    path.lineTo(x, y);
  }
  path.lineTo(width, height);
  path.lineTo(0, height);
  path.close();
  return path;
}

interface WaterCanvasProps {
  fillLevel: SharedValue<number>;
  colors: { surface: string; mid: string; deep: string; backWaveOpacity: number };
  onTap?: () => void;
  celebrationKey?: number;
}

export function WaterCanvas({ fillLevel, colors, onTap, celebrationKey = 0 }: WaterCanvasProps) {
  const { width, height } = useWindowDimensions();
  const clock = useClock();

  // Tap ripple
  const rippleX = useSharedValue(0);
  const rippleY = useSharedValue(0);
  const rippleProgress = useSharedValue(0);

  const rippleRadius = useDerivedValue(() =>
    interpolate(rippleProgress.value, [0, 1], [0, 150])
  );
  const rippleOpacity = useDerivedValue(() =>
    interpolate(rippleProgress.value, [0, 1], [0.45, 0])
  );

  // Celebration rings (3 staggered expanding circles from center)
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);
  const amplitudeBoost = useSharedValue(1);

  const ringCx = width / 2;
  const ringCy = height * 0.38;

  useEffect(() => {
    if (celebrationKey > 0) {
      ring1.value = 0;
      ring1.value = withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) });

      ring2.value = 0;
      ring2.value = withDelay(200,
        withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) })
      );

      ring3.value = 0;
      ring3.value = withDelay(400,
        withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) })
      );

      // Wave surge — temporarily triple the amplitude
      amplitudeBoost.value = 3.5;
      amplitudeBoost.value = withTiming(1, { duration: 2500, easing: Easing.out(Easing.cubic) });
    }
  }, [celebrationKey]);

  const ring1R = useDerivedValue(() => interpolate(ring1.value, [0, 1], [0, Math.max(width, height) * 0.6]));
  const ring1Op = useDerivedValue(() => interpolate(ring1.value, [0, 0.3, 1], [0, 0.5, 0]));
  const ring2R = useDerivedValue(() => interpolate(ring2.value, [0, 1], [0, Math.max(width, height) * 0.5]));
  const ring2Op = useDerivedValue(() => interpolate(ring2.value, [0, 0.3, 1], [0, 0.4, 0]));
  const ring3R = useDerivedValue(() => interpolate(ring3.value, [0, 1], [0, Math.max(width, height) * 0.4]));
  const ring3Op = useDerivedValue(() => interpolate(ring3.value, [0, 0.3, 1], [0, 0.3, 0]));

  const tap = Gesture.Tap().onEnd((e) => {
    'worklet';
    rippleX.value = e.x;
    rippleY.value = e.y;
    rippleProgress.value = 0;
    rippleProgress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    if (onTap) runOnJS(onTap)();
  });

  const backWave = useDerivedValue(() => {
    const t = clock.value / 1000;
    const boost = amplitudeBoost.value;
    const fillY = interpolate(fillLevel.value, [0, 1], [height, 0]);
    return buildWavePath(width, height, fillY, 14 * boost, 1.8, t * 1.2);
  });

  const frontWave = useDerivedValue(() => {
    const t = clock.value / 1000;
    const boost = amplitudeBoost.value;
    const fillY = interpolate(fillLevel.value, [0, 1], [height, 0]);
    return buildWavePath(width, height, fillY, 8 * boost, 3.2, t * 2.4 + 0.8);
  });

  return (
    <GestureDetector gesture={tap}>
      <Canvas style={{ width, height, position: 'absolute' }}>
        {/* Back wave */}
        <Path path={backWave} opacity={colors.backWaveOpacity}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={[colors.surface, colors.deep]}
          />
        </Path>
        {/* Front wave */}
        <Path path={frontWave}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={[colors.surface, colors.mid, colors.deep]}
            positions={[0, 0.35, 1]}
          />
        </Path>
        {/* Tap ripple */}
        <Circle
          cx={rippleX}
          cy={rippleY}
          r={rippleRadius}
          opacity={rippleOpacity}
          color="white"
          style="stroke"
          strokeWidth={2.5}
        />
        {/* Celebration rings */}
        <Circle cx={ringCx} cy={ringCy} r={ring1R} opacity={ring1Op} color="white" style="stroke" strokeWidth={3} />
        <Circle cx={ringCx} cy={ringCy} r={ring2R} opacity={ring2Op} color="white" style="stroke" strokeWidth={2.5} />
        <Circle cx={ringCx} cy={ringCy} r={ring3R} opacity={ring3Op} color="white" style="stroke" strokeWidth={2} />
      </Canvas>
    </GestureDetector>
  );
}
