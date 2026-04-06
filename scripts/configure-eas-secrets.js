#!/usr/bin/env node

/**
 * Configure EAS Secrets via the EAS Secrets API
 * This stores credentials in EAS servers, not in local files
 *
 * Usage:
 *   EXPO_TOKEN=xxx node scripts/configure-eas-secrets.js
 *
 * Environment variables required:
 *   - EXPO_TOKEN: Your Expo account token
 *   - APPLE_TEAM_ID: Apple Team ID
 *   - APP_STORE_CONNECT_KEY_ID: App Store Connect Key ID
 *   - APP_STORE_CONNECT_ISSUER_ID: App Store Connect Issuer ID
 *   - APP_STORE_CONNECT_P8_BASE64: Base64 encoded P8 private key
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const EXPO_TOKEN = process.env.EXPO_TOKEN;
const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_BASE64 = process.env.APP_STORE_CONNECT_P8_BASE64;

if (!EXPO_TOKEN) {
  console.error('❌ EXPO_TOKEN not set');
  process.exit(1);
}

if (!TEAM_ID || !KEY_ID || !ISSUER_ID || !P8_BASE64) {
  console.error('❌ Missing Apple credentials:');
  console.error('   - APPLE_TEAM_ID');
  console.error('   - APP_STORE_CONNECT_KEY_ID');
  console.error('   - APP_STORE_CONNECT_ISSUER_ID');
  console.error('   - APP_STORE_CONNECT_P8_BASE64');
  process.exit(1);
}

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.expo.dev',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${EXPO_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  try {
    console.log('🔐 Configuring EAS Secrets...');

    // Get app.json to find project ID and owner
    const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    const projectId = appJson.extra?.eas?.projectId;
    const owner = appJson.expo?.owner;

    if (!projectId || !owner) {
      console.error('❌ Missing projectId or owner in app.json');
      process.exit(1);
    }

    console.log(`📦 Project: ${owner}/${projectId}`);

    // Decode P8 key for safe storage
    const p8Pem = Buffer.from(P8_BASE64, 'base64').toString('utf-8');

    // Create secrets payload for EAS
    const secrets = {
      APPLE_TEAM_ID: TEAM_ID,
      APP_STORE_CONNECT_KEY_ID: KEY_ID,
      APP_STORE_CONNECT_ISSUER_ID: ISSUER_ID,
      APP_STORE_CONNECT_PRIVATE_KEY: p8Pem,
    };

    console.log('📝 Setting EAS environment variables...');

    // Set secrets in the project via EAS API
    const response = await makeRequest(
      'PATCH',
      `/v2/projects/${projectId}/secrets`,
      {
        secrets: Object.entries(secrets).map(([key, value]) => ({
          name: key,
          value,
        })),
      }
    );

    if (response.status >= 400) {
      console.error('❌ Failed to set secrets:', response.body);
      process.exit(1);
    }

    console.log('✅ EAS Secrets configured successfully!');
    console.log('✅ Ready for automated builds!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
