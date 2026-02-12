import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_MESSAGES = [
  'Time to hydrate',
  'Your water is waiting',
  'Stay on track — have a glass',
  'A glass of water goes a long way',
  'Keep it flowing — drink up',
];

// Configure notification appearance
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReminder(hour: number, minute: number): Promise<void> {
  // Cancel existing reminders first
  await cancelReminders();

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const randomMessage = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Drip',
      body: randomMessage,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
