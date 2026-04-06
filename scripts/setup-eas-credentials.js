#!/usr/bin/env node

/**
 * Sets up Apple credentials for EAS builds
 * Works in non-interactive mode by skipping validation
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_BASE64 = process.env.APP_STORE_CONNECT_P8_BASE64;

if (!TEAM_ID || !KEY_ID || !ISSUER_ID || !P8_BASE64) {
  console.error('❌ Missing Apple credentials');
  process.exit(1);
}

console.log('🔐 Setting up EAS credentials...');

const p8Pem = Buffer.from(P8_BASE64, 'base64').toString('utf-8');
const easDir = path.join(os.homedir(), '.eas');
const keysDir = path.join(easDir, 'keys');

if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

const p8Path = path.join(keysDir, 'apple.p8');
fs.writeFileSync(p8Path, p8Pem);
fs.chmodSync(p8Path, 0o600);
console.log(`✅ P8 key saved`);

// Get app config
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
const projectId = appJson.extra?.eas?.projectId;
const bundleId = appJson.expo?.ios?.bundleIdentifier;

if (!projectId || !bundleId) {
  console.error('❌ Missing projectId or bundleId in app.json');
  process.exit(1);
}

// Create credentials.json for the project
const credentialsFile = path.join(easDir, 'credentials.json');
const credentials = JSON.parse(fs.existsSync(credentialsFile) ? fs.readFileSync(credentialsFile, 'utf8') : '{}');

credentials[projectId] = {
  ios: {
    [bundleId]: {
      appleTeamId: TEAM_ID,
      appleAppStoreConnectKeyId: KEY_ID,
      appleAppStoreConnectIssuerId: ISSUER_ID,
      appleAppStoreConnectPrivateKeyPath: p8Path
    }
  }
};

fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2));
console.log(`✅ Credentials configured for ${bundleId}`);
console.log('✅ Ready for EAS build!\n');
