import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitpro.app',
  appName: 'FitPro',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0D0D0D'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  }
};

export default config;
