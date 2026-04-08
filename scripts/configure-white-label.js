#!/usr/bin/env node

const fs = require('fs');

const APP_NAME = process.env.APP_NAME;
const BUNDLE_ID = process.env.BUNDLE_ID;
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;

if (!APP_NAME || !BUNDLE_ID || !APPLE_TEAM_ID) {
  console.error('❌ Missing env vars: APP_NAME, BUNDLE_ID, APPLE_TEAM_ID');
  process.exit(1);
}

console.log('🔧 Configuring white-label app...');

// 1. Update app.json
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
appJson.expo.name = APP_NAME;
appJson.expo.ios = appJson.expo.ios || {};
appJson.expo.ios.bundleIdentifier = BUNDLE_ID;
appJson.expo.ios.appleTeamId = APPLE_TEAM_ID;

fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
console.log(`✅ Updated app.json: ${APP_NAME} (${BUNDLE_ID})`);

// 2. Update eas.json for submission
const easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));

// Preserve build config (credentialsSource, distribution, etc)
easJson.build = easJson.build || {};
easJson.build.production = easJson.build.production || {};
easJson.build.production.ios = easJson.build.production.ios || {};
easJson.build.production.ios.credentialsSource = easJson.build.production.ios.credentialsSource || 'local';
easJson.build.production.ios.distribution = easJson.build.production.ios.distribution || 'store';

// Update submit config
easJson.submit = easJson.submit || {};
easJson.submit.production = easJson.submit.production || {};
easJson.submit.production.ios = easJson.submit.production.ios || {};

// Clean up old ascAppId
delete easJson.submit.production.ios.ascAppId;

easJson.submit.production.ios.appleTeamId = APPLE_TEAM_ID;
easJson.submit.production.ios.appName = APP_NAME;
easJson.submit.production.ios.sku = BUNDLE_ID;

fs.writeFileSync('eas.json', JSON.stringify(easJson, null, 2));
console.log(`✅ Updated eas.json with submission config`);

console.log('\n✅ White-label configuration complete!\n');
