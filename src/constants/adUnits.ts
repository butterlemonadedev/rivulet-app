import { TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_IDS = {
  BANNER: __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-9084403317775964/6224927023',
  INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-9084403317775964/9852356430',
  REWARDED: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-9084403317775964/1751329548',
};

export default AD_UNIT_IDS;
