/**
 * Serverless API endpoint to trigger EAS Workflow
 *
 * Usage:
 *   POST /api/trigger-workflow
 *   {
 *     "expoToken": "expo_xxx",
 *     "projectId": "952733e3-51a5-40b4-8554-eaac3a5a6390",
 *     "appName": "My App",
 *     "bundleId": "com.my.app",
 *     "appleTeamId": "XXXXXXXXXX"
 *   }
 */

const https = require('https');

function makeRequest(method, pathname, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.expo.dev',
      port: 443,
      path: pathname,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
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

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { expoToken, projectId, appName, bundleId, appleTeamId } = req.body;

    // Validate inputs
    if (!expoToken || !projectId || !appName || !bundleId || !appleTeamId) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['expoToken', 'projectId', 'appName', 'bundleId', 'appleTeamId'],
      });
      return;
    }

    // Trigger EAS Workflow
    const response = await makeRequest(
      'POST',
      `/v2/projects/${projectId}/workflows/build-testflight.yml/runs`,
      {
        env: {
          APP_NAME: appName,
          BUNDLE_ID: bundleId.toLowerCase(),
          APPLE_TEAM_ID: appleTeamId,
        },
      },
      expoToken
    );

    if (response.status >= 400) {
      console.error(`[API] EAS API Error ${response.status}:`, response.rawData);
      res.status(response.status).json({
        error: 'Failed to trigger workflow',
        status: response.status,
        details: response.body || response.rawData,
      });
      return;
    }

    const runId = response.body?.id;
    console.log(`[API] Workflow triggered successfully! Run ID: ${runId}`);

    res.status(200).json({
      success: true,
      runId,
      message: 'Workflow triggered successfully',
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
