# Quick Start: TestFlight Build from Web Configurator

## 5-Minute Setup

### 1. Add GitHub Secrets (2 minutes)

Go to GitHub repo → Settings → Secrets and variables → Actions → "New repository secret"

Paste these secrets:

| Secret Name | Value |
|---|---|
| `EXPO_TOKEN` | `Bxrhap33MRN5COvONG8PodpjEaUIIHqA4UZiHmxg` |
| `APPLE_TEAM_ID` | `2H9MCN975Q` |
| `APP_STORE_CONNECT_KEY_ID` | `2MFD4KXKR7` |
| `APP_STORE_CONNECT_ISSUER_ID` | `69a6de87-46aa-47e3-e053-5b8c7c11a4d1` |
| `APP_STORE_CONNECT_P8_BASE64` | `LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR1RBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJIa3dkd0lCQVFRZ0ZHWGcrc09GWGxwcllEWGEKRTdiNzY0eWlJSVVuTlJmcWF5SnJETzZuVTRDZ0NnWUlLb1pJemowREFRZWhSQU5DQUFSZmwzZzl5NHRSVDJUdwpUbkUzS0lkTTc4eVZ1RkNGSnAzMjZIdkEzTTlsTEhhZjR3Vlc3Qy8rNGZ2Q3M0WmpCbHJWYmxmQlk1amk4RWNZCk9sbWhnQTBLCi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0=` |
| `GITHUB_TOKEN` | Your personal access token with `repo` scope |

**How to create GITHUB_TOKEN:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: `repo`
4. Copy and paste the token

### 2. Test It (3 minutes)

1. Open the configurator at `/web-configrator/`
2. Fill in:
   - **App Name**: `Test App`
   - **Bundle ID**: `com.test.testapp`
3. Click **"Push to TestFlight (iOS)"**
4. Watch the logs appear in real-time
5. Check GitHub Actions → "Generate Fast iOS App" for build progress

## How It Works

```
Web Form Input
    ↓
API Endpoint (/api/trigger-workflow)
    ↓
GitHub Actions Dispatch
    ↓
EAS Build (iOS)
    ↓
TestFlight Submit
    ↓
Build appears in TestFlight (~15-20 min)
```

## Changes Made

### Frontend (`web-configrator/web-eas.js`)
- Updated form to send `appName`, `bundleId`, `primaryColor`, `secondaryColor`
- Removed need for manual Expo/Apple Team ID entry in form
- Shows real-time build logs

### API (`api/trigger-workflow.js`)
- Simplified to trigger GitHub Actions workflows
- Reads credentials from environment variables
- No longer needs to receive tokens from frontend

### GitHub Actions (`.github/workflows/build.yml`)
- Accepts workflow inputs: `appName`, `bundleId`, `clientId`, `primaryColor`, `secondaryColor`
- Sets up App Store Connect credentials from P8 key
- Updates `app.json` dynamically with white-label config
- Runs on `macos-latest` for better iOS builds
- Builds and submits to TestFlight automatically

## Environment Variables

For local development, create `.env`:

```bash
GITHUB_TOKEN=your_personal_access_token
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=dummy-whitelabel-base
NODE_ENV=development
```

For production (Vercel/hosting), add these in the platform's environment settings.

## What Users See

1. **Form**: Simple white-label configurator
2. **Build button**: "Push to TestFlight (iOS)"
3. **Live logs**: Real-time status updates
4. **Instructions**: Links to GitHub Actions for details

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Build request failed" | Check GitHub Secrets are all added correctly |
| "Workflow not found" | Ensure `build.yml` exists in `.github/workflows/` |
| "Build fails in GitHub Actions" | Check EAS token is valid, App Store Connect key not expired |
| "Can't find app in TestFlight" | Wait 15-20 minutes, check App Store Connect settings |

## Next Steps

- [ ] Add all GitHub Secrets
- [ ] Create GITHUB_TOKEN (Personal Access Token)
- [ ] Test with a sample app
- [ ] Customize app colors if needed
- [ ] Share configurator URL with team

## File Changes Summary

```
Modified:
- web-configrator/web-eas.js     (API call, form inputs)
- api/trigger-workflow.js         (GitHub Actions dispatch)
- .github/workflows/build.yml     (EAS build pipeline)

Created:
- GITHUB_ACTIONS_SETUP.md         (Detailed setup guide)
- QUICK_START.md                  (This file)
```

---

**Status**: ✅ Ready to use after GitHub Secrets are added
