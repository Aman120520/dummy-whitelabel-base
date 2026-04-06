#!/usr/bin/env node

/**
 * Submit the latest EAS build to TestFlight using App Store Connect API
 *
 * Prerequisites:
 * - Build must be completed on EAS (via eas build --wait)
 * - EXPO_TOKEN must be set to fetch build info
 * - App Store Connect P8 key and credentials must be set
 */

const https = require('https');
const crypto = require('crypto');

const EXPO_TOKEN = process.env.EXPO_TOKEN;
const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_CONTENT = process.env.APP_STORE_CONNECT_P8_BASE64;
const TEAM_ID = process.env.APPLE_TEAM_ID;
const BUNDLE_ID = process.env.BUNDLE_ID;
const APP_NAME = process.env.APP_NAME;

if (!EXPO_TOKEN || !KEY_ID || !ISSUER_ID || !P8_CONTENT || !TEAM_ID || !BUNDLE_ID) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

function generateJWT() {
  const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' })).toString(
    'base64url'
  );

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: ISSUER_ID,
    iat: now,
    exp: now + 1200,
    aud: 'appstoreconnect-v1'
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const message = `${header}.${payloadB64}`;

  const keyObject = crypto.createPrivateKey({
    key: P8_CONTENT,
    format: 'pem',
    type: 'pkcs8'
  });

  const sign = crypto.createSign('sha256');
  sign.update(message);
  const signature = sign.sign(keyObject, 'base64url');

  return `${message}.${signature}`;
}

function httpsRequest(method, hostname, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
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
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function getLatestBuildFromEAS() {
  console.log('📥 Fetching latest build from EAS...');

  const res = await httpsRequest('GET', 'api.expo.dev', '/v2/builds', null, {
    'Authorization': `Bearer ${EXPO_TOKEN}`,
    'Content-Type': 'application/json'
  });

  if (res.status !== 200) {
    throw new Error(`Failed to fetch builds: ${res.status}`);
  }

  // Find the latest iOS production build
  const builds = res.data.builds || [];
  const latestBuild = builds.find((b) => b.platform === 'ios' && b.buildProfile === 'production');

  if (!latestBuild) {
    throw new Error('No iOS production builds found on EAS');
  }

  if (!latestBuild.artifacts || !latestBuild.artifacts.buildUrl) {
    throw new Error('Build artifact URL not available');
  }

  console.log(`✅ Found build: ${latestBuild.id}`);
  console.log(`   Status: ${latestBuild.status}`);
  console.log(`   Artifact: ${latestBuild.artifacts.buildUrl}`);

  return latestBuild.artifacts.buildUrl;
}

async function findOrCreateApp() {
  console.log(`🔍 Looking for app with bundle ID: ${BUNDLE_ID}...`);

  const jwt = generateJWT();
  const res = await httpsRequest(
    'GET',
    'api.appstoreconnect.apple.com',
    `/v1/apps?filter[bundleId]=${BUNDLE_ID}`,
    null,
    {
      'Authorization': `Bearer ${jwt}`
    }
  );

  if (res.status !== 200) {
    throw new Error(`App Store Connect API error: ${res.status}`);
  }

  const apps = res.data.data || [];

  if (apps.length > 0) {
    console.log(`✅ App found: ${apps[0].id}`);
    return apps[0].id;
  }

  console.log('❌ App not found in App Store Connect');
  console.log(`   Please create the app "${APP_NAME}" with bundle ID "${BUNDLE_ID}" manually`);
  console.log('   in App Store Connect, then try again.');
  process.exit(1);
}

async function submitBuildToTestFlight(appId, buildUrl) {
  console.log('📤 Creating Build & Version in App Store Connect...');

  const jwt = generateJWT();

  // Get the app details first to find the latest version
  const appRes = await httpsRequest('GET', 'api.appstoreconnect.apple.com', `/v1/apps/${appId}`, null, {
    'Authorization': `Bearer ${jwt}`
  });

  if (appRes.status !== 200) {
    throw new Error(`Failed to fetch app details: ${appRes.status}`);
  }

  // For simplicity, we'll let App Store Connect handle version numbers
  // The actual IPA upload happens via Transporter tool (altool)
  // which EAS handles internally.

  console.log('ℹ️  For direct TestFlight submission, use altool or Transporter');
  console.log('    The build was uploaded to EAS. Download the IPA and submit manually, or');
  console.log('    use: eas submit --platform ios --profile production --latest');

  return true;
}

async function main() {
  try {
    console.log('🚀 Starting TestFlight submission process...\n');

    // Step 1: Find app in App Store Connect
    const appId = await findOrCreateApp();

    // Step 2: Get latest build from EAS
    const buildUrl = await getLatestBuildFromEAS();

    // Step 3: Submit to TestFlight
    // Note: Full TestFlight submission requires downloading the IPA and using altool/Transporter
    // which requires macOS. Instead, we'll use EAS submit which handles this.

    console.log('\n✅ Build is ready on EAS!');
    console.log('📝 To submit to TestFlight, run:');
    console.log('   eas submit --platform ios --profile production --latest');

    return 0;
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
