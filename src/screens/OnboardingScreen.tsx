import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface OnboardingScreenProps {
  onComplete: (goal: number) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [goal, setGoal] = useState(8);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>How many glasses{'\n'}is your daily goal?</Text>

      <View style={styles.picker}>
        <Pressable
          onPress={() => setGoal((g) => Math.min(20, g + 1))}
          style={styles.arrowBtn}
        >
          <Text style={styles.arrow}>{'\u2191'}</Text>
        </Pressable>

        <Text style={styles.number}>{goal}</Text>

        <Pressable
          onPress={() => setGoal((g) => Math.max(1, g - 1))}
          style={styles.arrowBtn}
        >
          <Text style={styles.arrow}>{'\u2193'}</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => onComplete(goal)}
        style={styles.startBtn}
      >
        <Text style={styles.startText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  question: {
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: -0.5,
    textAlign: 'center',
    color: '#000',
    marginBottom: 48,
    lineHeight: 32,
  },
  picker: {
    alignItems: 'center',
    marginBottom: 64,
  },
  arrowBtn: {
    padding: 16,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
    color: '#999',
  },
  number: {
    fontSize: 96,
    fontWeight: '500',
    letterSpacing: -4,
    color: '#000',
    marginVertical: 8,
  },
  startBtn: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#000',
  },
  startText: {
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 1,
    color: '#000',
  },
});
