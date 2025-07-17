import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    ...config,
    name: 'SerenityAI',
    slug: 'serenity-ai',
    version: '1.0.0',
    orientation: 'portrait',
    platforms: ['ios', 'android', 'web'],
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#4A90E2',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.serenityai.app',
      buildNumber: '1',
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSCameraUsageDescription: 'This app needs access to camera to capture images for art generation.',
        NSMicrophoneUsageDescription: 'This app needs access to microphone to record audio for music generation.',
        NSPhotoLibraryUsageDescription: 'This app needs access to photo library to save generated content.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#4A90E2',
      },
      package: 'com.serenityai.app',
      versionCode: 1,
      permissions: [
        'CAMERA',
        'RECORD_AUDIO',
        'WRITE_EXTERNAL_STORAGE',
        'READ_EXTERNAL_STORAGE',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to save generated art.',
          cameraPermission: 'The app accesses your camera to capture images for art generation.',
        },
      ],
      [
        'expo-av',
        {
          microphonePermission: 'The app accesses your microphone to record audio for music generation.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#4A90E2',
          defaultChannel: 'serenity-notifications',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'serenity-ai-project-id',
      },
      apiUrl: isProduction
        ? 'https://api.serenityai.com'
        : 'http://localhost:3000',
      enableDebugMenu: isDevelopment,
      logLevel: isProduction ? 'error' : 'debug',
    },
    updates: {
      url: 'https://u.expo.dev/serenity-ai-project-id',
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    scheme: 'serenity-ai',
    hooks: {
      postPublish: [
        {
          file: 'expo-optimize',
          config: {
            projectRoot: __dirname,
          },
        },
      ],
    },
    // Production optimizations
    ...(isProduction && {
      jsEngine: 'hermes',
      android: {
        ...config.android,
        jsEngine: 'hermes',
        package: 'com.serenityai.app',
        versionCode: 1,
      },
      ios: {
        ...config.ios,
        jsEngine: 'hermes',
        bundleIdentifier: 'com.serenityai.app',
        buildNumber: '1',
      },
    }),
    // Development configurations
    ...(isDevelopment && {
      developer: {
        tool: 'expo-cli',
        projectRoot: __dirname,
      },
    }),
  };
};
