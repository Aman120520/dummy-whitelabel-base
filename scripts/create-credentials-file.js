#!/usr/bin/env node

/**
 * Set up Apple credentials for EAS by creating a P8 file that EAS can use
 * EAS looks for the P8 key file path in environment variables
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_CONTENT_BASE64 = process.env.APP_STORE_CONNECT_P8_BASE64;

if (!TEAM_ID || !KEY_ID || !ISSUER_ID || !P8_CONTENT_BASE64) {
  console.error('❌ Missing Apple credentials env vars');
  process.exit(1);
}

console.log('🔐 Setting up Apple credentials for EAS...');

// Decode the P8 key from base64 to PEM format
const p8KeyPem = Buffer.from(P8_CONTENT_BASE64, 'base64').toString('utf-8');

// Create .eas directory
const easDir = path.join(os.homedir(), '.eas');
if (!fs.existsSync(easDir)) {
  fs.mkdirSync(easDir, { recursive: true });
}

// Write the P8 key to a file
const p8FilePath = path.join(easDir, 'apple-app-store-connect-key.p8');
fs.writeFileSync(p8FilePath, p8KeyPem);
fs.chmodSync(p8FilePath, 0o600); // Restrict permissions
console.log(`✅ P8 key saved at: ${p8FilePath}`);

// Create credentials.json in the proper EAS format
const credentialsFile = path.join(easDir, 'credentials.json');
const credentials = {
  '952733e3-51a5-40b4-8554-eaac3a5a6390': {
    production: {
      ios: {
        appleTeamId: TEAM_ID,
        appleAppStoreConnectKeyId: KEY_ID,
        appleAppStoreConnectIssuerId: ISSUER_ID,
        appleAppStoreConnectPrivateKeyPath: p8FilePath
      }
    }
  }
};

fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2));
console.log(`✅ Credentials config saved at: ${credentialsFile}`);

// Also create local project version for consistency
const projectEasDir = path.join(process.cwd(), '.eas');
if (!fs.existsSync(projectEasDir)) {
  fs.mkdirSync(projectEasDir, { recursive: true });
}

const projectP8Path = path.join(projectEasDir, 'apple-app-store-connect-key.p8');
fs.writeFileSync(projectP8Path, p8KeyPem);
fs.chmodSync(projectP8Path, 0o600);

const projectCredsFile = path.join(projectEasDir, 'credentials.json');
const projectCredentials = {
  '952733e3-51a5-40b4-8554-eaac3a5a6390': {
    production: {
      ios: {
        appleTeamId: TEAM_ID,
        appleAppStoreConnectKeyId: KEY_ID,
        appleAppStoreConnectIssuerId: ISSUER_ID,
        appleAppStoreConnectPrivateKeyPath: projectP8Path
      }
    }
  }
};

fs.writeFileSync(projectCredsFile, JSON.stringify(projectCredentials, null, 2));
console.log(`✅ Project credentials config saved at: ${projectCredsFile}`);

console.log('\n✅ Apple credentials configured for EAS!');
