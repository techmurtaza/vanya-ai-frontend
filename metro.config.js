const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Fix for React Native Image module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable symlinks for better development experience
config.resolver.unstable_enableSymlinks = true;

// Optimize for medical education platform
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_keys: true,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  compress: {
    reduce_funcs: false,
  },
};

module.exports = config; 