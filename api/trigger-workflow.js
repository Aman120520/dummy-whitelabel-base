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

function makeRequest(method, pathname, body, token, isGitHub = false) {
  return new Promise((resolve, reject) => {
    const hostname = isGitHub ? 'api.github.com' : 'api.expo.dev';
    const authHeader = isGitHub
      ? `Bearer ${token}`
      : `Bearer ${token}`;

    const options = {
      hostname,
      port: 443,
      path: pathname,
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'white-label-configurator',
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
    const { githubToken, owner, repo, appName, bundleId, clientId } = req.body;

    // Validate inputs
    if (!githubToken || !owner || !repo || !appName || !bundleId || !clientId) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['githubToken', 'owner', 'repo', 'appName', 'bundleId', 'clientId'],
      });
      return;
    }

    // Trigger GitHub Actions Workflow
    const response = await makeRequest(
      'POST',
      `/repos/${owner}/${repo}/actions/workflows/build.yml/dispatches`,
      {
        ref: 'main',
        inputs: {
          appName,
          bundleId: bundleId.toLowerCase(),
          clientId,
        },
      },
      githubToken,
      true // isGitHub = true
    );

    if (response.status >= 400) {
      console.error(`[API] GitHub API Error ${response.status}:`, response.rawData);
      res.status(response.status).json({
        error: 'Failed to trigger workflow',
        status: response.status,
        details: response.body || response.rawData,
      });
      return;
    }

    console.log(`[API] GitHub Workflow triggered successfully!`);

    res.status(200).json({
      success: true,
      message: 'Workflow triggered successfully. Build will start in GitHub Actions.',
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
