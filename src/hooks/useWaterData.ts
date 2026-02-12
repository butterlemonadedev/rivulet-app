import { useState, useEffect, useCallback } from 'react';
import { WaterData, loadWaterData, logGlass, updateGoal } from '../services/waterStorage';

export function useWaterData() {
  const [data, setData] = useState<WaterData | null>(null);

  useEffect(() => {
    loadWaterData().then(setData);
  }, []);

  const addGlass = useCallback(async () => {
    if (!data) return;
    const updated = await logGlass(data);
    setData(updated);
  }, [data]);

  const setGoal = useCallback(async (goal: number) => {
    if (!data) return;
    const updated = await updateGoal(data, goal);
    setData(updated);
  }, [data]);

  return { data, addGlass, setGoal };
}
