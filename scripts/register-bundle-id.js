#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_CONTENT = process.env.APP_STORE_CONNECT_P8_BASE64;
const BUNDLE_ID = process.env.BUNDLE_ID;
const TEAM_ID = process.env.APPLE_TEAM_ID;

if (!KEY_ID || !ISSUER_ID || !P8_CONTENT || !BUNDLE_ID || !TEAM_ID) {
  console.error('❌ Missing required env vars:');
  console.error(`  KEY_ID: ${KEY_ID ? '✓' : '✗'}`);
  console.error(`  ISSUER_ID: ${ISSUER_ID ? '✓' : '✗'}`);
  console.error(`  P8_CONTENT: ${P8_CONTENT ? '✓' : '✗'}`);
  console.error(`  BUNDLE_ID: ${BUNDLE_ID ? '✓' : '✗'}`);
  console.error(`  TEAM_ID: ${TEAM_ID ? '✓' : '✗'}`);
  process.exit(1);
}

function generateJWT() {
  const crypto = require('crypto');
  const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' })).toString('base64url');

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: ISSUER_ID,
    iat: now,
    exp: now + 1200,
    aud: 'appstoreconnect-v1'
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const message = `${header}.${payloadB64}`;

  const p8Key = P8_CONTENT;
  const keyObject = crypto.createPrivateKey({
    key: p8Key,
    format: 'pem',
    type: 'pkcs8'
  });

  const sign = crypto.createSign('sha256');
  sign.update(message);
  const signature = sign.sign(keyObject, 'base64url');

  return `${message}.${signature}`;
}

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const jwt = generateJWT();

    const options = {
      hostname: 'api.appstoreconnect.apple.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
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

async function checkBundleExists() {
  console.log(`🔍 Checking if bundle ID ${BUNDLE_ID} exists...`);

  const res = await request('GET', `/v1/bundleIds?filter[identifier]=${BUNDLE_ID}`);

  if (res.status === 200 && res.data.data && res.data.data.length > 0) {
    console.log(`✅ Bundle ID ${BUNDLE_ID} already exists`);
    return res.data.data[0].id;
  }

  return null;
}

async function registerBundle() {
  console.log(`📝 Registering bundle ID ${BUNDLE_ID}...`);

  const body = {
    data: {
      type: 'bundleIds',
      attributes: {
        identifier: BUNDLE_ID,
        name: BUNDLE_ID,
        platform: 'IOS'
      },
      relationships: {
        app: {
          data: {
            type: 'apps',
            id: TEAM_ID
          }
        }
      }
    }
  };

  const res = await request('POST', '/v1/bundleIds', body);

  if (res.status === 201) {
    console.log(`✅ Bundle ID ${BUNDLE_ID} registered successfully`);
    return res.data.data.id;
  } else {
    console.error(`❌ Failed to register bundle ID: ${res.status}`, res.data);
    return null;
  }
}

async function main() {
  try {
    let bundleId = await checkBundleExists();

    if (!bundleId) {
      bundleId = await registerBundle();
      if (!bundleId) {
        console.error('❌ Could not register bundle ID');
        process.exit(1);
      }
    }

    console.log(`✅ Bundle ID ${BUNDLE_ID} is ready for use`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
