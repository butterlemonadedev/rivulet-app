import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function HistoryScreen() {
  const { ui } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: ui.background }]}>
      <Text style={[styles.title, { color: ui.text }]}>History</Text>
      <Text style={[styles.subtitle, { color: ui.textSecondary }]}>
        Swipe right to go back
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '300', letterSpacing: -1 },
  subtitle: { fontSize: 14, fontWeight: '300', marginTop: 8 },
});
