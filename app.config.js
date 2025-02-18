const { version } = require('./package.json');

module.exports = {
  name: 'Go Alchemy',
  slug: 'go-alchemy',
  version: version,
  description: "Enhance you're skills through practicing go problems",
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.cosmonautindustries.templateapp',
    permissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.RECORD_AUDIO'
    ]
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  },
  assetBundlePatterns: ['assets/sgf/**/*'],
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 300,
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      }
    ],
    'expo-secure-store'
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'eaeeae0c-2778-42f8-afb2-5c9352640706'
    }
  },
  owner: 'mroberts1137'
};
