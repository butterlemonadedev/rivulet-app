import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

export async function initializeAds(): Promise<void> {
  await mobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,
    tagForChildDirectedTreatment: false,
    testDeviceIdentifiers: ['EMULATOR'],
  });
  await mobileAds().initialize();
}
