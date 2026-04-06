# GitHub Actions Setup Guide

This guide will help you configure GitHub Secrets and deploy your iOS app directly to TestFlight from the web configurator.

## Step 1: Add GitHub Secrets

Go to your GitHub repository → **Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

### Required Secrets

1. **EXPO_TOKEN**
   - Value: `Bxrhap33MRN5COvONG8PodpjEaUIIHqA4UZiHmxg`

2. **APPLE_TEAM_ID**
   - Value: `2H9MCN975Q`

3. **APP_STORE_CONNECT_KEY_ID**
   - Value: `2MFD4KXKR7`

4. **APP_STORE_CONNECT_ISSUER_ID**
   - Value: `69a6de87-46aa-47e3-e053-5b8c7c11a4d1`

5. **APP_STORE_CONNECT_P8_BASE64**
   - Value: `LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR1RBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJIa3dkd0lCQVFRZ0ZHWGcrc09GWGxwcllEWGEKRTdiNzY0eWlJSVVuTlJmcWF5SnJETzZuVTRDZ0NnWUlLb1pJemowREFRZWhSQU5DQUFSZmwzZzl5NHRSVDJUdwpUbkUzS0lkTTc4eVZ1RkNGSnAzMjZIdkEzTTlsTEhhZjR3Vlc3Qy8rNGZ2Q3M0WmpCbHJWYmxmQlk1amk4RWNZCk9sbWhnQTBLCi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0=`

6. **GITHUB_TOKEN** (for API access)
   - Create a Personal Access Token at https://github.com/settings/tokens
   - Required scopes: `repo` (full control of private repositories)
   - Value: Your generated token

## Step 2: Configure Environment Variables (for local API server)

If running locally, create a `.env` file in the project root:

```bash
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=dummy-whitelabel-base
```

## Step 3: How It Works

1. **User fills the form** in the web configurator with:
   - App Name (e.g., "Tayyar24 Laundry")
   - Bundle ID (e.g., "com.laundry.tayyar24")
   - Optional: Primary & Secondary Colors

2. **User clicks "Push to TestFlight"**

3. **Frontend sends request** to `/api/trigger-workflow` with the app details

4. **API endpoint** dispatches a GitHub Actions workflow with:
   - `appName`
   - `bundleId`
   - `clientId`
   - `primaryColor` (optional)
   - `secondaryColor` (optional)

5. **GitHub Actions runs the build**:
   - Updates `app.json` with white-label config
   - Runs `eas build --platform ios --profile production`
   - Submits to TestFlight with `eas submit`

6. **Build appears in TestFlight** in ~15-20 minutes

## API Endpoint Details

### POST `/api/trigger-workflow`

**Request Body:**
```json
{
  "appName": "My App",
  "bundleId": "com.company.appname",
  "clientId": "client123",
  "primaryColor": "#202f66",
  "secondaryColor": "#f0f4f8"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Build workflow triggered successfully.",
  "repository": "owner/repo",
  "workflow": "build.yml"
}
```

**Error Response (400/500):**
```json
{
  "error": "Missing required fields",
  "required": ["appName", "bundleId", "clientId"]
}
```

## Testing the Setup

1. Start the development server:
   ```bash
   npm start
   ```

2. Open http://localhost:3000 (adjust port as needed)

3. Fill in the configurator form with test data

4. Click "Push to TestFlight (iOS)"

5. Check GitHub Actions → "Generate Fast iOS App" for the build progress

## Troubleshooting

### "GITHUB_TOKEN not configured"
- Ensure `GITHUB_TOKEN` is set in GitHub Secrets (Settings → Secrets)
- If running locally, add to `.env` file and restart the server

### "Failed to trigger workflow"
- Check if the GitHub token has `repo` scope
- Verify `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` are correct
- Check GitHub Actions logs for detailed errors

### Build fails in GitHub Actions
- Check the workflow logs in GitHub Actions tab
- Verify EAS credentials are correct
- Ensure App Store Connect P8 key is valid and not expired
- Check TestFlight settings in App Store Connect

### "Invalid Bundle ID"
- Must be in format: `com.company.appname`
- Only alphanumeric characters and dots allowed
- Must have at least 2 parts (e.g., `com.app` is minimum)

## References

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [App Store Connect Keys](https://developer.apple.com/docs/appstoreconnectapi/generating_tokens_for_api_requests)
