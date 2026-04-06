#!/usr/bin/env node

/**
 * Simple script to trigger GitHub Actions build
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node trigger-build-simple.js
 */

const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'Aman120520';
const REPO = 'dummy-whitelabel-base';
const WORKFLOW = 'build.yml';

if (!GITHUB_TOKEN) {
  console.error('❌ Please set GITHUB_TOKEN environment variable');
  console.error('');
  console.error('Usage:');
  console.error('  GITHUB_TOKEN=ghp_xxxxx node trigger-build-simple.js');
  process.exit(1);
}

const payload = {
  ref: 'main',
  inputs: {
    appName: process.argv[2] || 'Test App',
    bundleId: process.argv[3] || 'com.test.app',
    clientId: process.argv[4] || '4565',
  },
};

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: `/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
  method: 'POST',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'trigger-build',
  },
};

console.log('🚀 Triggering GitHub Actions workflow...');
console.log(`   Repository: ${OWNER}/${REPO}`);
console.log(`   Workflow: ${WORKFLOW}`);
console.log(`   Inputs:`, payload.inputs);
console.log('');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 204) {
      console.log('✅ Workflow triggered successfully!');
      console.log('');
      console.log('📊 Check status at:');
      console.log(`   https://github.com/${OWNER}/${REPO}/actions`);
      console.log('');
      console.log('🎯 Build will start in ~30 seconds');
      process.exit(0);
    } else {
      console.error(`❌ Error ${res.statusCode}:`);
      try {
        const json = JSON.parse(data);
        console.error(JSON.stringify(json, null, 2));
      } catch (e) {
        console.error(data);
      }
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.write(JSON.stringify(payload));
req.end();
