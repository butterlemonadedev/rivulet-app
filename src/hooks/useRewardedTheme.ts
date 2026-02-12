import { useEffect, useRef, useCallback, useState } from 'react';
import { RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import AD_UNIT_IDS from '../constants/adUnits';
import { WaterThemeName } from '../constants/colors';
import { unlockTheme, getUnlockedThemes, setActiveTheme, getActiveTheme } from '../services/themeService';

export function useRewardedTheme() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [unlockedThemes, setUnlockedThemes] = useState<Record<string, string>>({});
  const [activeTheme, setActiveThemeState] = useState<WaterThemeName>('default');
  const rewardedRef = useRef<RewardedAd | null>(null);
  const pendingThemeRef = useRef<WaterThemeName | null>(null);

  const loadAd = useCallback(() => {
    const rewarded = RewardedAd.createForAdRequest(AD_UNIT_IDS.REWARDED);

    const unsubLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    const unsubEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
      if (pendingThemeRef.current) {
        await unlockTheme(pendingThemeRef.current);
        await setActiveTheme(pendingThemeRef.current);
        setActiveThemeState(pendingThemeRef.current);
        const updated = await getUnlockedThemes();
        setUnlockedThemes(updated);
        pendingThemeRef.current = null;
      }
    });

    const unsubClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      loadAd();
    });

    const unsubError = rewarded.addAdEventListener(AdEventType.ERROR, () => {
      setIsLoaded(false);
    });

    rewardedRef.current = rewarded;
    rewarded.load();

    return () => {
      unsubLoaded();
      unsubEarned();
      unsubClosed();
      unsubError();
    };
  }, []);

  useEffect(() => {
    const cleanup = loadAd();
    getUnlockedThemes().then(setUnlockedThemes);
    getActiveTheme().then(setActiveThemeState);
    return cleanup;
  }, [loadAd]);

  const watchToUnlock = useCallback((themeName: WaterThemeName) => {
    if (isLoaded && rewardedRef.current) {
      pendingThemeRef.current = themeName;
      rewardedRef.current.show();
    }
  }, [isLoaded]);

  const selectTheme = useCallback(async (themeName: WaterThemeName) => {
    await setActiveTheme(themeName);
    setActiveThemeState(themeName);
  }, []);

  return {
    isAdLoaded: isLoaded,
    unlockedThemes,
    activeTheme,
    watchToUnlock,
    selectTheme,
  };
}
