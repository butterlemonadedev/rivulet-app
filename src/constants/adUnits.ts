import { TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_IDS = {
  BANNER: __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-REPLACE/BANNER_UNIT',
  INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-REPLACE/INTERSTITIAL_UNIT',
  REWARDED: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-REPLACE/REWARDED_UNIT',
};

export default AD_UNIT_IDS;
