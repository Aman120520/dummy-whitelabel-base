#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Create a new app on App Store Connect using the API
 * Requires Apple API Key (p8 file) and credentials
 */

const APP_NAME = process.env.APP_NAME;
const BUNDLE_ID = process.env.BUNDLE_ID;
const APPLE_API_KEY_ID = process.env.APPLE_API_KEY_ID;
const APPLE_API_ISSUER_ID = process.env.APPLE_API_ISSUER_ID;
const APPLE_API_KEY_PATH = process.env.APPLE_API_KEY_PATH;

if (!APP_NAME || !BUNDLE_ID || !APPLE_API_KEY_ID || !APPLE_API_ISSUER_ID || !APPLE_API_KEY_PATH) {
  console.error('❌ Missing required environment variables:');
  console.error('   APP_NAME, BUNDLE_ID, APPLE_API_KEY_ID, APPLE_API_ISSUER_ID, APPLE_API_KEY_PATH');
  process.exit(1);
}

if (!fs.existsSync(APPLE_API_KEY_PATH)) {
  console.error(`❌ Apple API key file not found: ${APPLE_API_KEY_PATH}`);
  process.exit(1);
}

console.log('📱 Creating new iOS app on App Store Connect...');
console.log(`   App Name: ${APP_NAME}`);
console.log(`   Bundle ID: ${BUNDLE_ID}`);

const jwt = require('jsonwebtoken');

// Read the private key
const privateKey = fs.readFileSync(APPLE_API_KEY_PATH, 'utf8');

// Create JWT token for App Store Connect API
const token = jwt.sign(
  {
    iss: APPLE_API_ISSUER_ID,
    aud: 'appstoreconnect-v1',
    sub: APPLE_API_ISSUER_ID,
  },
  privateKey,
  {
    algorithm: 'ES256',
    expiresIn: '20m',
    keyid: APPLE_API_KEY_ID,
  }
);

// Create app via App Store Connect API
const createAppPayload = {
  data: {
    type: 'apps',
    attributes: {
      name: APP_NAME,
      bundleId: BUNDLE_ID,
      primaryLocale: 'en-US',
      platforms: ['IOS'],
      bundleIdSuffix: null,
      company: null,
      skuValue: BUNDLE_ID.replace(/\./g, '-'),
    },
    relationships: {
      ciProduct: {
        data: null,
      },
    },
  },
};

const options = {
  hostname: 'api.appstoreconnect.apple.com',
  port: 443,
  path: '/v1/apps',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (res.statusCode === 201) {
        const appId = response.data.id;
        const bundleId = response.data.attributes.bundleId;

        console.log('✅ iOS app created successfully!');
        console.log(`   App ID: ${appId}`);
        console.log(`   Bundle ID: ${bundleId}`);
        console.log(`   Name: ${response.data.attributes.name}`);

        // Save app info to file for workflow reference
        const appInfo = {
          appId,
          bundleId,
          appName: APP_NAME,
          createdAt: new Date().toISOString(),
        };

        fs.writeFileSync(
          path.join(process.cwd(), '.app-info.json'),
          JSON.stringify(appInfo, null, 2)
        );

        console.log('💾 App info saved to .app-info.json');
      } else {
        console.error(`❌ Error (${res.statusCode}):`, response.errors?.[0]?.detail || response);
        process.exit(1);
      }
    } catch (e) {
      console.error('❌ Failed to parse response:', e.message);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request failed: ${e.message}`);
  process.exit(1);
});

req.write(JSON.stringify(createAppPayload));
req.end();
