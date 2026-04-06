#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const IPA_PATH = process.argv[2];
const BUNDLE_ID = process.argv[3];

if (!IPA_PATH || !BUNDLE_ID) {
  console.error('Usage: upload-to-testflight.js <ipa-path> <bundle-id>');
  process.exit(1);
}

if (!fs.existsSync(IPA_PATH)) {
  console.error(`❌ IPA file not found: ${IPA_PATH}`);
  process.exit(1);
}

const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_CONTENT = process.env.APP_STORE_CONNECT_P8_BASE64;
const TEAM_ID = process.env.APPLE_TEAM_ID;

if (!KEY_ID || !ISSUER_ID || !P8_CONTENT || !TEAM_ID) {
  console.error('❌ Missing App Store Connect credentials');
  process.exit(1);
}

async function generateJWT() {
  const crypto = require('crypto');

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

async function checkAppExists() {
  const jwt = await generateJWT();

  return new Promise((resolve, reject) => {
    const https = require('https');

    const options = {
      hostname: 'api.appstoreconnect.apple.com',
      path: `/v1/apps?filter[bundleId]=${BUNDLE_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.data && result.data.length > 0) {
            console.log(`✅ App with bundle ID ${BUNDLE_ID} found in App Store Connect`);
            resolve(result.data[0].id);
          } else {
            console.error(`❌ App with bundle ID ${BUNDLE_ID} not found`);
            console.error('   Please create the app in App Store Connect manually');
            resolve(null);
          }
        } catch {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function uploadWithTransporter() {
  console.log('📤 Uploading .ipa to TestFlight via Application Loader...');

  return new Promise((resolve, reject) => {
    const altool = spawn('xcrun', [
      'altool',
      '--upload-app',
      '-f',
      IPA_PATH,
      '-t',
      'ios',
      '-u',
      TEAM_ID,
      '--apiKey',
      KEY_ID,
      '--apiIssuer',
      ISSUER_ID,
      '--show-progress'
    ]);

    let stdout = '';
    let stderr = '';

    altool.stdout.on('data', (data) => {
      stdout += data;
      process.stdout.write(data);
    });

    altool.stderr.on('data', (data) => {
      stderr += data;
      process.stderr.write(data);
    });

    altool.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Upload successful!');
        resolve();
      } else {
        reject(new Error(`Upload failed with code ${code}\n${stderr}`));
      }
    });
  });
}

async function main() {
  try {
    console.log(`🔍 Checking if app exists in App Store Connect...`);
    const appId = await checkAppExists();

    if (!appId) {
      console.error('❌ Cannot upload without app existing in App Store Connect');
      console.error('   Please create the app manually first');
      process.exit(1);
    }

    console.log(`\n📦 Uploading IPA to TestFlight...`);
    console.log(`   IPA: ${IPA_PATH}`);
    console.log(`   Bundle ID: ${BUNDLE_ID}`);

    await uploadWithTransporter();

    console.log('\n🎉 Successfully uploaded to TestFlight!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
