import React from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Canvas,
  Path,
  LinearGradient,
  Skia,
  vec,
  useClock,
} from '@shopify/react-native-skia';
import {
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

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
}

export function WaterCanvas({ fillLevel, colors }: WaterCanvasProps) {
  const { width, height } = useWindowDimensions();
  const clock = useClock();

  const backWave = useDerivedValue(() => {
    const t = clock.value / 1000;
    const fillY = interpolate(fillLevel.value, [0, 1], [height, 0]);
    return buildWavePath(width, height, fillY, 14, 1.8, t * 1.2);
  });

  const frontWave = useDerivedValue(() => {
    const t = clock.value / 1000;
    const fillY = interpolate(fillLevel.value, [0, 1], [height, 0]);
    return buildWavePath(width, height, fillY, 8, 3.2, t * 2.4 + 0.8);
  });

  return (
    <Canvas style={{ width, height, position: 'absolute' }}>
      <Path path={backWave} opacity={colors.backWaveOpacity}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}
          colors={[colors.surface, colors.deep]}
        />
      </Path>
      <Path path={frontWave}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}
          colors={[colors.surface, colors.mid, colors.deep]}
          positions={[0, 0.35, 1]}
        />
      </Path>
    </Canvas>
  );
}
