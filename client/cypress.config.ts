import { defineConfig } from 'cypress';

export default defineConfig({
  blockHosts: ['*.google-analytics.com', '*.googletagmanager.com'],
  viewportWidth: 1280,
  viewportHeight: 800,
  e2e: {
    setupNodeEvents(on, config) {
      // return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
  },
});
