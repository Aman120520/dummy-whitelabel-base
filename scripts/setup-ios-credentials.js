#!/usr/bin/env node

/**
 * Automatically set up iOS credentials in EAS using the Expo Turtle build service API
 * This script creates distribution certificates and provisioning profiles programmatically
 */

const https = require('https');
const crypto = require('crypto');

const EXPO_TOKEN = process.env.EXPO_TOKEN;
const PROJECT_ID = '952733e3-51a5-40b4-8554-eaac3a5a6390';
const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_CONTENT = process.env.APP_STORE_CONNECT_P8_BASE64;

if (!EXPO_TOKEN || !TEAM_ID || !KEY_ID || !ISSUER_ID || !P8_CONTENT) {
  console.error('❌ Missing required env vars');
  console.error('   EXPO_TOKEN, APPLE_TEAM_ID, APP_STORE_CONNECT_KEY_ID');
  console.error('   APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_P8_BASE64');
  process.exit(1);
}

function httpsRequest(method, hostname, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'EAS-CLI',
        ...headers
      }
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function checkExistingCredentials() {
  console.log('🔍 Checking for existing iOS credentials in EAS...');

  const res = await httpsRequest(
    'GET',
    'api.expo.dev',
    `/v1/projects/${PROJECT_ID}/credentials/ios`,
    null,
    {
      'Authorization': `Bearer ${EXPO_TOKEN}`
    }
  );

  if (res.status === 200 && res.data.credentials && res.data.credentials.length > 0) {
    console.log(`✅ Found ${res.data.credentials.length} existing iOS credential(s)`);
    return true;
  }

  console.log('❌ No existing iOS credentials found');
  return false;
}

async function setUpCredentialsViaAPI() {
  console.log('🔐 Setting up iOS credentials via EAS API...');

  // Step 1: Create a distribution certificate request
  console.log('📝 Creating distribution certificate request...');

  const certRes = await httpsRequest(
    'POST',
    'api.expo.dev',
    `/v1/projects/${PROJECT_ID}/credentials/ios/build`,
    {
      appleTeamId: TEAM_ID,
      appleAppStoreConnectKeyId: KEY_ID,
      appleAppStoreConnectIssuerId: ISSUER_ID,
      appleAppStoreConnectPrivateKeyBase64: P8_CONTENT,
      buildProfile: 'production'
    },
    {
      'Authorization': `Bearer ${EXPO_TOKEN}`
    }
  );

  if (certRes.status !== 200 && certRes.status !== 201) {
    console.error(`❌ Failed to set up credentials: ${certRes.status}`);
    console.error(JSON.stringify(certRes.data, null, 2));
    return false;
  }

  console.log('✅ iOS credentials set up successfully!');
  console.log('   Distribution Certificate: Created');
  console.log('   Provisioning Profile: Created');
  console.log('   EAS can now build iOS apps with credentialsSource: "remote"');

  return true;
}

async function main() {
  try {
    console.log('🚀 EAS iOS Credentials Setup\n');

    const hasExisting = await checkExistingCredentials();

    if (hasExisting) {
      console.log('✅ iOS credentials already configured in EAS');
      console.log('   No further setup needed.');
      process.exit(0);
    }

    const success = await setUpCredentialsViaAPI();

    if (success) {
      console.log('\n✅ Credentials setup complete!');
      console.log('   GitHub Actions workflows can now build iOS apps.');
      process.exit(0);
    } else {
      console.error('\n❌ Credentials setup failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
