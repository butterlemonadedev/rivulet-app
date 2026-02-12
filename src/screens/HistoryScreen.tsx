import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useWaterData } from '../hooks/useWaterData';
import { DayLog } from '../services/waterStorage';

const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getLast7Days(today: DayLog, history: DayLog[]): DayLog[] {
  const all = [...history, today];
  const last7: DayLog[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const found = all.find((log) => log.date === key);
    last7.push(found ?? { date: key, glasses: 0, goal: 8 });
  }
  return last7;
}

function getLast30Days(today: DayLog, history: DayLog[]): DayLog[] {
  const all = [...history, today];
  const last30: DayLog[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const found = all.find((log) => log.date === key);
    last30.push(found ?? { date: key, glasses: 0, goal: 8 });
  }
  return last30;
}

export function HistoryScreen() {
  const { ui, water, isDark } = useTheme();
  const { data } = useWaterData();

  if (!data) return null;

  const last7 = getLast7Days(data.today, data.history);
  const last30 = getLast30Days(data.today, data.history);

  return (
    <View style={[styles.container, { backgroundColor: ui.background }]}>
      {/* Header */}
      <Text style={[styles.header, { color: ui.text }]}>This Week</Text>

      {/* Weekly Bars */}
      <View style={styles.barsRow}>
        {last7.map((day, i) => {
          const pct = Math.min(day.glasses / day.goal, 1);
          const dayOfWeek = new Date(day.date + 'T12:00:00').getDay();
          const isToday = i === 6;

          return (
            <View key={day.date} style={styles.barColumn}>
              <View style={[styles.barBg, { backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0' }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${pct * 100}%`,
                      backgroundColor: water.surface,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: isToday ? ui.text : ui.textSecondary,
                    fontWeight: isToday ? '500' : '300',
                  },
                ]}
              >
                {DAY_INITIALS[dayOfWeek]}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Monthly Section */}
      <Text style={[styles.header, { color: ui.text, marginTop: 40 }]}>This Month</Text>

      {/* Monthly Dots */}
      <View style={styles.dotsGrid}>
        {last30.map((day) => {
          const metGoal = day.glasses >= day.goal;
          return (
            <View
              key={day.date}
              style={[
                styles.dot,
                metGoal
                  ? { backgroundColor: water.surface }
                  : { borderWidth: 1, borderColor: ui.textSecondary },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
  },
  barColumn: {
    alignItems: 'center',
  },
  barBg: {
    width: 36,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  dayLabel: {
    fontSize: 13,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  dotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
