const fs = require('fs');
const path = require('path');

// Read client configuration from embedded config.json
let clientConfig = {
  clientId: '4565',
  appName: 'dummy-whitelabel-base',
  iosBundle: 'com.example.whitelabel',
  androidPackage: 'com.example.whitelabel'
};

try {
  const configPath = path.join(__dirname, 'app', 'config.json');
  const configContent = fs.readFileSync(configPath, 'utf8');
  clientConfig = JSON.parse(configContent);
} catch (error) {
  console.warn('Could not load app/config.json, using defaults:', error.message);
}

// Read base app.json configuration
let appJsonConfig = {};
try {
  const appJsonPath = path.join(__dirname, 'app.json');
  const appJsonContent = fs.readFileSync(appJsonPath, 'utf8');
  appJsonConfig = JSON.parse(appJsonContent);
} catch (error) {
  console.warn('Could not load app.json, using minimal defaults');
}

module.exports = {
  expo: {
    name: clientConfig.appName || 'dummy-whitelabel-base',
    slug: 'dummy-whitelabel-base',
    version: appJsonConfig.expo?.version || '1.0.0',
    orientation: appJsonConfig.expo?.orientation || 'portrait',
    icon: appJsonConfig.expo?.icon || './assets/images/icon.png',
    scheme: appJsonConfig.expo?.scheme || 'dummywhitelabelbase',
    userInterfaceStyle: appJsonConfig.expo?.userInterfaceStyle || 'automatic',
    newArchEnabled: appJsonConfig.expo?.newArchEnabled !== false,
    ios: {
      supportsTablet: appJsonConfig.expo?.ios?.supportsTablet !== false,
      bundleIdentifier: clientConfig.iosBundle || 'com.example.whitelabel',
      infoPlist: appJsonConfig.expo?.ios?.infoPlist || {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: appJsonConfig.expo?.android?.adaptiveIcon || {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png'
      },
      edgeToEdgeEnabled: appJsonConfig.expo?.android?.edgeToEdgeEnabled !== false,
      predictiveBackGestureEnabled: appJsonConfig.expo?.android?.predictiveBackGestureEnabled || false,
      package: clientConfig.androidPackage || 'com.example.whitelabel'
    },
    web: appJsonConfig.expo?.web || {
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: appJsonConfig.expo?.plugins || [],
    experiments: appJsonConfig.expo?.experiments || {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: appJsonConfig.expo?.extra?.router || {},
      eas: appJsonConfig.expo?.extra?.eas || {
        projectId: '952733e3-51a5-40b4-8554-eaac3a5a6390'
      },
      clientId: clientConfig.clientId,
      clientConfig: clientConfig
    },
    owner: appJsonConfig.expo?.owner || 'wesencedev',
    runtimeVersion: appJsonConfig.expo?.runtimeVersion || '1.0.0',
    updates: appJsonConfig.expo?.updates || {
      url: 'https://u.expo.dev/952733e3-51a5-40b4-8554-eaac3a5a6390'
    }
  }
};
