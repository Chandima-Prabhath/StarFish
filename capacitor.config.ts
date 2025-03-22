import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.starfish.app',
  appName: 'StarFish',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: { allowMixedContent: true },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  }
};

export default config;
