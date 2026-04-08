#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

/**
 * Create a new app on Google Play Console using the API
 * Requires Google Play API credentials (JSON service account key)
 */

const APP_NAME = process.env.APP_NAME;
const PACKAGE_NAME = process.env.PACKAGE_NAME;
const GOOGLE_PLAY_CREDENTIALS = process.env.GOOGLE_PLAY_CREDENTIALS;

if (!APP_NAME || !PACKAGE_NAME || !GOOGLE_PLAY_CREDENTIALS) {
  console.error('❌ Missing required environment variables:');
  console.error('   APP_NAME, PACKAGE_NAME, GOOGLE_PLAY_CREDENTIALS');
  process.exit(1);
}

if (!fs.existsSync(GOOGLE_PLAY_CREDENTIALS)) {
  console.error(`❌ Google Play credentials file not found: ${GOOGLE_PLAY_CREDENTIALS}`);
  process.exit(1);
}

console.log('🤖 Creating new Android app on Google Play Console...');
console.log(`   App Name: ${APP_NAME}`);
console.log(`   Package Name: ${PACKAGE_NAME}`);

async function createApp() {
  try {
    const credentials = JSON.parse(fs.readFileSync(GOOGLE_PLAY_CREDENTIALS, 'utf8'));

    const androidpublisher = google.androidpublisher('v3');

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    const authClient = await auth.getClient();

    // Create app on Google Play
    const createResponse = await androidpublisher.edits.create({
      packageName: PACKAGE_NAME,
      resource: {
        id: `app_creation_${Date.now()}`,
      },
      auth: authClient,
    });

    const editId = createResponse.data.id;

    console.log('✅ Android app created successfully!');
    console.log(`   Package Name: ${PACKAGE_NAME}`);
    console.log(`   App Name: ${APP_NAME}`);

    // Save app info to file for workflow reference
    const appInfo = {
      packageName: PACKAGE_NAME,
      appName: APP_NAME,
      createdAt: new Date().toISOString(),
      editId: editId,
    };

    fs.writeFileSync(
      path.join(process.cwd(), '.app-info.json'),
      JSON.stringify(appInfo, null, 2)
    );

    console.log('💾 App info saved to .app-info.json');

    // Commit the edit
    await androidpublisher.edits.commit({
      packageName: PACKAGE_NAME,
      editId: editId,
      auth: authClient,
    });

    console.log('✅ App committed to Google Play Console');
  } catch (error) {
    console.error('❌ Failed to create app:', error.message);
    if (error.response?.data?.error?.details) {
      console.error('Details:', error.response.data.error.details);
    }
    process.exit(1);
  }
}

createApp();
