#!/usr/bin/env node

/**
 * Trigger EAS Workflow from command line or web configurator
 *
 * Usage:
 *   node scripts/trigger-eas-workflow.js \
 *     --app-name "My App" \
 *     --bundle-id "com.my.app" \
 *     --apple-team-id "XXXXXXXXXX" \
 *     --expo-token "your_expo_token"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg, i, arr) => {
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const value = arr[i + 1]?.startsWith('--') ? null : arr[i + 1];
    acc[key] = value;
  }
  return acc;
}, {});

const APP_NAME = args['app-name'] || process.env.APP_NAME;
const BUNDLE_ID = args['bundle-id'] || process.env.BUNDLE_ID;
const APPLE_TEAM_ID = args['apple-team-id'] || process.env.APPLE_TEAM_ID;
const EXPO_TOKEN = args['expo-token'] || process.env.EXPO_TOKEN;

// Validate inputs
if (!APP_NAME || !BUNDLE_ID || !APPLE_TEAM_ID || !EXPO_TOKEN) {
  console.error('❌ Missing required arguments:');
  console.error('   --app-name (or APP_NAME env var)');
  console.error('   --bundle-id (or BUNDLE_ID env var)');
  console.error('   --apple-team-id (or APPLE_TEAM_ID env var)');
  console.error('   --expo-token (or EXPO_TOKEN env var)');
  process.exit(1);
}

// Read project ID from app.json
const appJsonPath = path.join(process.cwd(), 'app.json');
let projectId;
try {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  projectId = appJson.extra?.eas?.projectId;
  if (!projectId) {
    throw new Error('projectId not found in app.json');
  }
} catch (error) {
  console.error('❌ Error reading app.json:', error.message);
  process.exit(1);
}

console.log('🚀 Triggering EAS Workflow...');
console.log(`   Project ID: ${projectId}`);
console.log(`   App Name: ${APP_NAME}`);
console.log(`   Bundle ID: ${BUNDLE_ID}`);

// Make API request to EAS
function makeRequest(method, pathname, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.expo.dev',
      port: 443,
      path: pathname,
      method,
      headers: {
        'Authorization': `Bearer ${EXPO_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, body: parsed, rawData: data });
        } catch (e) {
          resolve({ status: res.statusCode, body: null, rawData: data });
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

async function triggerWorkflow() {
  try {
    // Trigger workflow
    const response = await makeRequest(
      'POST',
      `/v2/projects/${projectId}/workflows/build-testflight.yml/runs`,
      {
        env: {
          APP_NAME,
          BUNDLE_ID,
          APPLE_TEAM_ID,
        },
      }
    );

    if (response.status >= 400) {
      console.error('❌ Failed to trigger workflow:');
      console.error(`   Status: ${response.status}`);
      console.error(`   Response: ${response.rawData}`);
      process.exit(1);
    }

    const runId = response.body?.id;
    console.log('\n✅ Workflow triggered successfully!');
    console.log(`   Run ID: ${runId}`);
    console.log('\n📊 Check status with:');
    console.log(`   eas workflow:status ${runId}`);
    console.log(`   eas workflow:logs ${runId}`);
    console.log('\n🎯 Build will appear in TestFlight in ~15-20 minutes');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

triggerWorkflow();
