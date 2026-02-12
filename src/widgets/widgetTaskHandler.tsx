import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { WaterWidget } from './WaterWidget';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'drip_water_data';

async function getWaterData() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { glasses: 0, goal: 8 };
  const data = JSON.parse(raw);
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
