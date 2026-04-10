import { getConfig } from 'expo/config';

// Read client configuration from embedded config.json
let clientConfig = {
  clientId: '4565',
  appName: 'dummy-whitelabel-base',
  iosBundle: 'com.example.whitelabel',
  androidPackage: 'com.example.whitelabel'
};

try {
  const config = require('./app/config.json');
  clientConfig = config;
} catch (error) {
  console.warn('Could not load app/config.json, using defaults');
}

export default () => {
  const baseConfig = getConfig(__dirname);

  return {
    ...baseConfig.exp,
    name: clientConfig.appName,
    slug: 'dummy-whitelabel-base',
    version: baseConfig.exp.version,
    ios: {
      ...baseConfig.exp.ios,
      bundleIdentifier: clientConfig.iosBundle
    },
    android: {
      ...baseConfig.exp.android,
      package: clientConfig.androidPackage
    },
    extra: {
      ...baseConfig.exp.extra,
      clientId: clientConfig.clientId,
      clientConfig: clientConfig
    }
  };
};
