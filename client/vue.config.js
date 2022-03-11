const path = require('path');

module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js',
    },
    manifestOptions: {
      name: 'Weather App',
      short_name: 'Weather',
      theme_color: '#002699',
      background_color: '#0d187b',
      icons: [
        {
          src: './img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },
  outputDir: path.resolve(__dirname, '../server/client'),

  transpileDependencies: ['vuetify'],
};
