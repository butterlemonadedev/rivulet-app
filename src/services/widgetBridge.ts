import { Platform } from 'react-native';

// For iOS, we need to write to shared UserDefaults
// Since react-native-shared-group-preferences may have compatibility issues,
// we'll use a simpler approach with expo-linking or a native module.
// For now, we'll prepare the data structure.

const APP_GROUP_ID = 'group.com.butterlemonade.rivulet.shared';

export async function updateWidgetData(glasses: number, goal: number): Promise<void> {
  if (Platform.OS === 'ios') {
    try {
      // Use react-native-shared-group-preferences if available
      const SharedGroupPreferences = require('react-native-shared-group-preferences');
      await SharedGroupPreferences.default.setItem(
        'waterData',
        { currentGlasses: glasses, goal },
        APP_GROUP_ID
      );
    } catch (e) {
      // Library not available or not linked — fallback silently
      console.log('iOS widget data sharing not available:', e);
    }
  }
}

export async function reloadWidgetTimelines(): Promise<void> {
  if (Platform.OS === 'ios') {
    try {
      // Dynamically import to avoid crashes on Android
      const WidgetKit = require('react-native-widgetkit');
      WidgetKit.default.reloadAllTimelines();
    } catch (e) {
      console.log('WidgetKit reload not available:', e);
    }
  }
}
