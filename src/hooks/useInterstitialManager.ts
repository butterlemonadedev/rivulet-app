import { useEffect, useRef, useCallback, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import AD_UNIT_IDS from '../constants/adUnits';

const ACTIONS_BEFORE_AD = 3;

export function useInterstitialManager(installedAt: string | undefined) {
  const [isLoaded, setIsLoaded] = useState(false);
  const actionCountRef = useRef(0);
  const interstitialRef = useRef<InterstitialAd | null>(null);

  const loadAd = useCallback(() => {
    const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL);

    const unsubLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    const unsubClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      loadAd(); // preload next
    });

    const unsubError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      setIsLoaded(false);
    });

    interstitialRef.current = interstitial;
    interstitial.load();

    return () => {
      unsubLoaded();
      unsubClosed();
      unsubError();
    };
  }, []);

  useEffect(() => {
    const cleanup = loadAd();
    return cleanup;
  }, [loadAd]);

  const trackGlass = useCallback(() => {
    // Skip if within first 24 hours of install
    if (installedAt) {
      const installTime = new Date(installedAt).getTime();
      const now = Date.now();
      if (now - installTime < 24 * 60 * 60 * 1000) return;
    }

    actionCountRef.current += 1;
    if (actionCountRef.current >= ACTIONS_BEFORE_AD && isLoaded) {
      actionCountRef.current = 0;
      interstitialRef.current?.show();
    }
  }, [isLoaded, installedAt]);

  return { trackGlass };
}
