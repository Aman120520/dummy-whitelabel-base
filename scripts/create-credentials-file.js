#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  APPLE_TEAM_ID,
  APP_STORE_CONNECT_KEY_ID,
  APP_STORE_CONNECT_ISSUER_ID,
  APP_STORE_CONNECT_P8_BASE64,
} = process.env;

if (!APPLE_TEAM_ID || !APP_STORE_CONNECT_KEY_ID || !APP_STORE_CONNECT_ISSUER_ID || !APP_STORE_CONNECT_P8_BASE64) {
  console.error('❌ Missing required environment variables:');
  console.error('   - APPLE_TEAM_ID');
  console.error('   - APP_STORE_CONNECT_KEY_ID');
  console.error('   - APP_STORE_CONNECT_ISSUER_ID');
  console.error('   - APP_STORE_CONNECT_P8_BASE64');
  process.exit(1);
}

const easDir = path.join(os.homedir(), '.eas');
const p8Path = path.join(easDir, 'apple-app-store-connect-key.p8');
const credentialsPath = path.join(easDir, 'credentials.json');

try {
  if (!fs.existsSync(easDir)) {
    fs.mkdirSync(easDir, { recursive: true });
  }

  const p8Content = Buffer.from(APP_STORE_CONNECT_P8_BASE64, 'base64').toString('utf-8');
  fs.writeFileSync(p8Path, p8Content);
  fs.chmodSync(p8Path, 0o600);

  const credentials = {
    ios: {
      [APPLE_TEAM_ID]: {
        appleAppStoreConnectPrivateKeyPath: p8Path,
        appleAppStoreConnectKeyId: APP_STORE_CONNECT_KEY_ID,
        appleAppStoreConnectIssuerId: APP_STORE_CONNECT_ISSUER_ID,
      },
    },
  };

  fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
  fs.chmodSync(credentialsPath, 0o600);

  console.log('✅ iOS credentials set up successfully');
  console.log(`   P8 key: ${p8Path}`);
  console.log(`   Credentials: ${credentialsPath}`);
} catch (error) {
  console.error('❌ Failed to set up credentials:', error.message);
  process.exit(1);
}
