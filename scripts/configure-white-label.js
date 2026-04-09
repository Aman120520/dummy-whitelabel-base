#!/usr/bin/env node

const fs = require('fs');

const APP_NAME = process.env.APP_NAME;
const IOS_BUNDLE_ID = process.env.IOS_BUNDLE_ID;
const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE;
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID;
const CLIENT_ID = process.env.CLIENT_ID;

if (!APP_NAME) {
  console.error('❌ Missing required env var: APP_NAME');
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error('❌ Missing required env var: CLIENT_ID');
  process.exit(1);
}

console.log('🔧 Configuring white-label app...');

// 1. Update app.json
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));

// ONLY update app name, keep slug unchanged
appJson.expo.name = APP_NAME;

// Update iOS bundle identifier if provided
if (IOS_BUNDLE_ID) {
  appJson.expo.ios = appJson.expo.ios || {};
  appJson.expo.ios.bundleIdentifier = IOS_BUNDLE_ID;
  console.log(`✅ Updated iOS Bundle ID: ${IOS_BUNDLE_ID}`);
}

// Update Android package if provided
if (ANDROID_PACKAGE) {
  appJson.expo.android = appJson.expo.android || {};
  appJson.expo.android.package = ANDROID_PACKAGE;
  console.log(`✅ Updated Android Package: ${ANDROID_PACKAGE}`);
}

// Add Apple Team ID if provided
if (APPLE_TEAM_ID) {
  appJson.expo.ios.appleTeamId = APPLE_TEAM_ID;
}

// Update EAS Project ID if provided
if (EAS_PROJECT_ID) {
  appJson.expo.extra = appJson.expo.extra || {};
  appJson.expo.extra.eas = appJson.expo.extra.eas || {};
  appJson.expo.extra.eas.projectId = EAS_PROJECT_ID;

  // Also update the updates URL to use the new project ID
  appJson.expo.updates = appJson.expo.updates || {};
  appJson.expo.updates.url = `https://u.expo.dev/${EAS_PROJECT_ID}`;

  console.log(`✅ Updated EAS Project ID: ${EAS_PROJECT_ID}`);
}

fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
console.log(`✅ Updated app.json: ${APP_NAME}`);

// 2. Update eas.json for submission
const easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));

// Preserve build config (credentialsSource, distribution, etc)
easJson.build = easJson.build || {};
easJson.build.production = easJson.build.production || {};
easJson.build.production.ios = easJson.build.production.ios || {};
easJson.build.production.ios.credentialsSource = easJson.build.production.ios.credentialsSource || 'local';
easJson.build.production.ios.distribution = easJson.build.production.ios.distribution || 'store';

// Update submit config - preserve existing config and only update team ID
easJson.submit = easJson.submit || {};
easJson.submit.production = easJson.submit.production || {};
easJson.submit.production.ios = easJson.submit.production.ios || {};

// Only update appleTeamId if provided, preserve all other submit config (ascAppId, etc)
if (APPLE_TEAM_ID) {
  easJson.submit.production.ios.appleTeamId = APPLE_TEAM_ID;
}

fs.writeFileSync('eas.json', JSON.stringify(easJson, null, 2));
console.log(`✅ Updated eas.json with submission config`);

// 3. Create client configuration file that the app will use
const clientConfig = {
  clientId: CLIENT_ID,
  appName: APP_NAME,
  iosBundle: IOS_BUNDLE_ID || null,
  androidPackage: ANDROID_PACKAGE || null,
};

const configPath = 'app/config.json';
fs.writeFileSync(configPath, JSON.stringify(clientConfig, null, 2));
console.log(`✅ Created app/config.json with client ID: ${CLIENT_ID}`);

console.log('\n✅ White-label configuration complete!\n');
