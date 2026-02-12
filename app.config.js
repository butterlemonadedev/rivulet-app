export default {
  expo: {
    name: "Drip",
    slug: "drip-water-tracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.butterlemonade.drip",
      buildNumber: "1",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.butterlemonade.drip",
      versionCode: 1,
    },
    plugins: [
      "@shopify/react-native-skia",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-3940256099942544~3347511713",
          iosAppId: "ca-app-pub-3940256099942544~1458002511",
        },
      ],
      [
        "react-native-android-widget",
        {
          widgets: [
            {
              name: "WaterTracker",
              label: "Water Tracker",
              minWidth: "250dp",
              minHeight: "110dp",
              targetCellWidth: 3,
              targetCellHeight: 2,
              description: "Track your daily water intake",
              previewImage: "./assets/widget-preview.png",
              updatePeriodMillis: 1800000,
              resizeMode: "horizontal|vertical",
              widgetFeatures: "reconfigurable",
            },
          ],
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "REPLACE_WITH_EAS_PROJECT_ID",
      },
    },
  },
};
