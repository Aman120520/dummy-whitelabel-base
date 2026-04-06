#!/usr/bin/env node

/**
 * Create a credentials.json file that EAS can use directly
 * This bypasses the need for interactive eas credentials setup
 */

const fs = require('fs');
const path = require('path');

const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_CONTENT = process.env.APP_STORE_CONNECT_P8_BASE64;

if (!TEAM_ID || !KEY_ID || !ISSUER_ID || !P8_CONTENT) {
  console.error('❌ Missing Apple credentials env vars');
  process.exit(1);
}

console.log('🔐 Creating EAS credentials file...');

// Create .eas directory if it doesn't exist
const easDir = path.join(process.env.HOME, '.eas');
if (!fs.existsSync(easDir)) {
  fs.mkdirSync(easDir, { recursive: true });
  console.log(`✅ Created directory: ${easDir}`);
}

// Create credentials.json with the P8 key
const credentialsFile = path.join(easDir, 'credentials.json');

const credentials = {
  '952733e3-51a5-40b4-8554-eaac3a5a6390': {
    production: {
      ios: {
        appleAppStoreConnectKeyId: KEY_ID,
        appleAppStoreConnectIssuerId: ISSUER_ID,
        appleAppStoreConnectPrivateKey: Buffer.from(P8_CONTENT, 'base64').toString('utf-8'),
        appleTeamId: TEAM_ID,
        type: 'app-store'
      }
    }
  }
};

fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2));
console.log(`✅ Credentials file created at: ${credentialsFile}`);

// Also create local .eas/credentials.json in project if needed
const projectEasDir = path.join(process.cwd(), '.eas');
if (!fs.existsSync(projectEasDir)) {
  fs.mkdirSync(projectEasDir, { recursive: true });
}

const projectCredsFile = path.join(projectEasDir, 'credentials.json');
fs.writeFileSync(projectCredsFile, JSON.stringify(credentials, null, 2));
console.log(`✅ Project credentials file created at: ${projectCredsFile}`);

console.log('\n✅ Credentials configured for EAS!');
