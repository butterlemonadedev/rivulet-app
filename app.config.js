export default {
  expo: {
    name: "Rivulet",
    slug: "rivulet-water-tracker",
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
      bundleIdentifier: "com.butterlemonade.rivulet",
      buildNumber: "1",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.butterlemonade.rivulet",
      versionCode: 1,
    },
    plugins: [
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-9084403317775964~1798606594",
          iosAppId: "ca-app-pub-9084403317775964~1798606594",
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
        projectId: "660ec4db-a534-4def-973a-24e80fa4e318",
      },
    },
  },
};
