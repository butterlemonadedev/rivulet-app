'use no memo';
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface WaterWidgetProps {
  glasses: number;
  goal: number;
}

export function WaterWidget({ glasses, goal }: WaterWidgetProps) {
  const pct = Math.min(Math.round((glasses / goal) * 100), 100);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#023E8A',
        borderRadius: 16,
        padding: 16,
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget
        text={`${glasses}`}
        style={{
          fontSize: 48,
          fontWeight: '700',
          color: '#48CAE4',
        }}
      />
      <TextWidget
        text={`of ${goal} glasses`}
        style={{
          fontSize: 14,
          color: '#90E0EF',
          marginTop: 4,
        }}
      />
      {/* Progress bar */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 6,
          backgroundColor: '#0B2545',
          borderRadius: 3,
          marginTop: 12,
        }}
      >
        <FlexWidget
          style={{
            width: `${pct}%` as any,
            height: 'match_parent',
            backgroundColor: '#48CAE4',
            borderRadius: 3,
          }}
        />
      </FlexWidget>
      {/* Tap to log button */}
      <FlexWidget
        style={{
          marginTop: 12,
          backgroundColor: '#0077B6',
          borderRadius: 8,
          padding: 8,
          paddingLeft: 16,
          paddingRight: 16,
        }}
        clickAction="LOG_WATER"
        clickActionData={{ amount: 1 }}
      >
        <TextWidget
          text="+ glass"
          style={{ fontSize: 14, fontWeight: '500', color: '#CAF0F8' }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
