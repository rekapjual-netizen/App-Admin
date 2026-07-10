import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tokoqris.admin',
  appName: 'Admin Toko QRIS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
