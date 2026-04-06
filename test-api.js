#!/usr/bin/env node

/**
 * Test the trigger-workflow API directly
 *
 * Usage:
 *   node test-api.js
 */

const http = require('http');

const payload = {
  expoToken: process.env.EXPO_TOKEN || 'expo_test_token',
  projectId: '952733e3-51a5-40b4-8554-eaac3a5a6390',
  appName: 'Test App',
  bundleId: 'com.test.app',
  appleTeamId: process.env.APPLE_TEAM_ID || 'XXXXXXXXXX',
};

console.log('🧪 Testing API endpoint...');
console.log('Payload:', JSON.stringify(payload, null, 2));

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/trigger-workflow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`\n📊 Response Status: ${res.statusCode}`);
    console.log('📊 Response Headers:', res.headers);
    console.log('📊 Response Body:');
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
  process.exit(1);
});

req.write(JSON.stringify(payload));
req.end();
