import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeNavigator } from './components/SwipeNavigator';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SwipeNavigator>
        <HomeScreen />
        <HistoryScreen />
      </SwipeNavigator>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
