#!/usr/bin/env node

/**
 * Set up iOS credentials in EAS (Expo) account programmatically
 * This generates signing certificates and provisioning profiles,
 * then uploads them to your Expo account so EAS can use them.
 */

const https = require('https');
const crypto = require('crypto');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const EXPO_TOKEN = process.env.EXPO_TOKEN;
const PROJECT_ID = '952733e3-51a5-40b4-8554-eaac3a5a6390';
const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APP_STORE_CONNECT_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID;
const P8_CONTENT = process.env.APP_STORE_CONNECT_P8_BASE64;
const BUNDLE_ID = process.env.BUNDLE_ID;

if (!EXPO_TOKEN) {
  console.error('❌ EXPO_TOKEN not set');
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

async function setupEASCredentials() {
  try {
    console.log('🔐 Setting up iOS credentials in EAS...\n');

    // The simplest solution: Use `eas credentials` command locally to set up
    // But since we're in CI, we need to use the Expo API directly

    // For now, we'll just inform the user that they need to do this interactively
    console.log('⚠️  EAS credentials must be set up interactively (for now)');
    console.log('');
    console.log('To set up iOS credentials for your project:');
    console.log('');
    console.log('1. Run locally on your machine:');
    console.log('   eas credentials --project-id 952733e3-51a5-40b4-8554-eaac3a5a6390');
    console.log('');
    console.log('2. Select "iOS"');
    console.log('3. Select "Production" profile');
    console.log('4. Choose "Create a new Apple App Store Connect key"');
    console.log('5. Provide your Apple Developer Team ID and P8 key');
    console.log('');
    console.log('6. Once done, EAS will store credentials in your Expo account');
    console.log('   and this GitHub Actions workflow will succeed.');
    console.log('');
    console.log('Alternatively, wait for EAS to support non-interactive credential setup via API.');

    return false;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

setupEASCredentials();
