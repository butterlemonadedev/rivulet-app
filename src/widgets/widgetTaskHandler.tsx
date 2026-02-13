import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { WaterWidget } from './WaterWidget';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'drip_water_data';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function getWaterData() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { glasses: 0, goal: 8 };
  const data = JSON.parse(raw);
  // Handle day rollover in widget
  if (data.today.date !== todayKey()) {
    return { glasses: 0, goal: data.goal || 8 };
  }
  return { glasses: data.today.glasses, goal: data.today.goal };
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const { glasses, goal } = await getWaterData();
      props.renderWidget(<WaterWidget glasses={glasses} goal={goal} />);
      break;
    }

    case 'WIDGET_CLICK': {
      if (props.clickAction === 'LOG_WATER') {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          const today = todayKey();
          // Handle day rollover before incrementing
          if (data.today.date !== today) {
            data.history = data.history || [];
            data.history.push(data.today);
            if (data.history.length > 90) data.history = data.history.slice(-90);
            data.today = { date: today, glasses: 0, goal: data.goal };
          }
          data.today.glasses += 1;
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          props.renderWidget(
            <WaterWidget glasses={data.today.glasses} goal={data.today.goal} />
          );
        }
      }
      break;
    }

    case 'WIDGET_DELETED':
      break;

    default:
      break;
  }
}
