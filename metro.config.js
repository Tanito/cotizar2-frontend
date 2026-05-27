const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Forzar que Metro transforme este archivo de react-native
config.transformer.unstable_allowRequireContext = true;

const originalBlockList = config.resolver.blockList || [];
config.resolver.blockList = originalBlockList;

// Excluir react-native/src/private del transformIgnorePatterns
config.transformerPath = require.resolve('metro-transform-worker');

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;