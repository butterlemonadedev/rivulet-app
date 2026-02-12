import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'drip_water_data';

export interface DayLog {
  date: string; // YYYY-MM-DD
  glasses: number;
  goal: number;
}

export interface WaterData {
  goal: number;
  today: DayLog;
  history: DayLog[];
  installedAt: string; // ISO timestamp
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function loadWaterData(): Promise<WaterData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const now = todayKey();
    const initial: WaterData = {
      goal: 8,
      today: { date: now, glasses: 0, goal: 8 },
      history: [],
      installedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  const data: WaterData = JSON.parse(raw);
  // Handle day rollover
  const now = todayKey();
  if (data.today.date !== now) {
    data.history.push(data.today);
    // Keep last 90 days
    if (data.history.length > 90) data.history = data.history.slice(-90);
    data.today = { date: now, glasses: 0, goal: data.goal };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}

export async function logGlass(data: WaterData): Promise<WaterData> {
  data.today.glasses += 1;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { ...data };
}

export async function updateGoal(data: WaterData, newGoal: number): Promise<WaterData> {
  data.goal = newGoal;
  data.today.goal = newGoal;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { ...data };
}
