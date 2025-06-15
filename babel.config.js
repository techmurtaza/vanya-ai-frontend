/**
 * Babel Configuration for Ask Rezzy Client
 * 
 * This configuration file sets up Babel transpilation for the React Native/Expo project.
 * Babel is responsible for transforming modern JavaScript/TypeScript code into compatible
 * versions that can run on different platforms (iOS, Android, Web).
 * 
 * @param {Object} api - Babel API object providing caching and other utilities
 * @returns {Object} Babel configuration object
 */
module.exports = function (api) {
  // Enable Babel's caching mechanism for faster subsequent builds
  // This improves build performance by avoiding re-transpilation of unchanged files
  api.cache(true);
  
  return {
    // Use Expo's preset which includes all necessary Babel plugins and presets
    // for React Native development, including JSX transformation, async/await,
    // and platform-specific optimizations
    presets: ['babel-preset-expo']
  };
};
