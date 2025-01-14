const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable the new architecture
  useHermes: true,
});

// Add any additional configuration
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];

module.exports = config;
