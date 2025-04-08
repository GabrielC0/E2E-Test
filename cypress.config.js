const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      return config;
    },
    experimentalRunAllSpecs: true,
    testIsolation: false,
    defaultCommandTimeout: 10000,
  },
  chromeWebSecurity: false,
  video: false,
});
