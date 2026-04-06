# White-Label iOS Build System

One-click TestFlight builds directly from the web configurator.

## Quick Start (5 minutes)

### 1. Add GitHub Secrets
Go to: **GitHub repo → Settings → Secrets and variables → Actions**

Add these 6 secrets:

| Name | Value |
|------|-------|
| `EXPO_TOKEN` | `Bxrhap33MRN5COvONG8PodpjEaUIIHqA4UZiHmxg` |
| `APPLE_TEAM_ID` | `2H9MCN975Q` |
| `APP_STORE_CONNECT_KEY_ID` | `2MFD4KXKR7` |
| `APP_STORE_CONNECT_ISSUER_ID` | `69a6de87-46aa-47e3-e053-5b8c7c11a4d1` |
| `APP_STORE_CONNECT_P8_BASE64` | `LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR1RBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJIa3dkd0lCQVFRZ0ZHWGcrc09GWGxwcllEWGEKRTdiNzY0eWlJSVVuTlJmcWF5SnJETzZuVTRDZ0NnWUlLb1pJemowREFRZWhSQU5DQUFSZmwzZzl5NHRSVDJUdwpUbkUzS0lkTTc4eVZ1RkNGSnAzMjZIdkEzTTlsTEhhZjR3Vlc3Qy8rNGZ2Q3M0WmpCbHJWYmxmQlk1amk4RWNZCk9sbWhnQTBLCi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0=` |
| `GITHUB_TOKEN` | [Create at https://github.com/settings/tokens with `repo` scope] |

### 2. Test It
```bash
npm install
npm start
# Open: http://localhost:3000/web-configrator/
# Fill form → Click "Push to TestFlight"
# Check GitHub Actions for build progress
```

### 3. You're Done!
App appears in TestFlight in ~15-20 minutes.

---

## What Is This?

A complete system to build and deploy white-label iOS apps to TestFlight by clicking a button in the web configurator.

**User flow:**
```
1. Enter app name + bundle ID
2. Click "Push to TestFlight"
3. Watch real-time logs
4. Build appears in TestFlight (~15-20 min)
```

**Behind the scenes:**
```
Web Form → API → GitHub Actions → EAS Build → TestFlight
```

---

## Files Changed

### Frontend
**`web-configrator/web-eas.js`**
- Simplified form (no token entry needed)
- Sends to `/api/trigger-workflow`
- Real-time build logs

### Backend API
**`api/trigger-workflow.js`**
- Receives form data
- Dispatches GitHub Actions workflow
- Reads credentials from environment

### CI/CD
**`.github/workflows/build.yml`**
- Receives workflow dispatch
- Sets up App Store Connect credentials
- Updates `app.json` with white-label config
- Runs `eas build` → `eas submit`

---

## Documentation

- **QUICK_START.md** - 5-minute setup
- **SETUP_CHECKLIST.md** - Step-by-step guide
- **GITHUB_ACTIONS_SETUP.md** - Detailed configuration
- **CREDENTIALS_REFERENCE.md** - Secret values & how to create them
- **ARCHITECTURE.md** - System design & data flows
- **SYSTEM_DIAGRAM.txt** - Visual flowchart
- **IMPLEMENTATION_SUMMARY.md** - What was changed & why

---

## How It Works

### Step 1: User Fills Form
```
App Name:    "Tayyar24 Laundry"
Bundle ID:   "com.laundry.tayyar24"
Colors:      Optional
```

### Step 2: Frontend Sends Request
```javascript
POST /api/trigger-workflow
{
  appName: "Tayyar24 Laundry",
  bundleId: "com.laundry.tayyar24",
  clientId: "white-label-app",
  primaryColor: "#202f66",
  secondaryColor: "#f0f4f8"
}
```

### Step 3: API Dispatches GitHub Actions
```bash
POST /repos/{owner}/{repo}/actions/workflows/build.yml/dispatches
```

### Step 4: GitHub Actions Builds
1. Checkout code
2. Setup Node.js & EAS
3. Write App Store Connect P8 key
4. Update `app.json` with app details
5. Run `eas build --platform ios`
6. Run `eas submit --platform ios`

### Step 5: TestFlight
Build appears for testing (~15-20 min after button click)

---

## Key Features

✅ **One-click builds** - No manual commands needed
✅ **Real-time logs** - See what's happening
✅ **White-label** - Customize app name, bundle ID, colors
✅ **Secure** - All credentials in GitHub Secrets
✅ **Scalable** - Multiple builds in parallel
✅ **Fast** - Full build in ~15-20 minutes

---

## API Reference

### POST `/api/trigger-workflow`

**Request:**
```json
{
  "appName": "My App",
  "bundleId": "com.company.appname",
  "clientId": "client123",
  "primaryColor": "#202f66",
  "secondaryColor": "#f0f4f8"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Build workflow triggered successfully.",
  "repository": "owner/repo",
  "workflow": "build.yml"
}
```

**Error (400):**
```json
{
  "error": "Missing required fields",
  "required": ["appName", "bundleId", "clientId"]
}
```

---

## Environment Variables

For local development, create `.env`:
```bash
GITHUB_TOKEN=your_personal_access_token
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=dummy-whitelabel-base
NODE_ENV=development
```

For production (Vercel, AWS, etc.), set in platform settings.

---

## Testing

### Local Test
```bash
# 1. Start server
npm start

# 2. Open http://localhost:3000/web-configrator/

# 3. Fill form
App Name: Test App
Bundle ID: com.test.testapp

# 4. Click "Push to TestFlight"

# 5. Check GitHub Actions
GitHub → Actions → "Generate Fast iOS App"

# 6. Wait 15-20 minutes
# App should appear in TestFlight
```

### Verify Success
- GitHub Actions: Workflow completes ✅
- TestFlight: Build appears ✅
- Testers: Receive email invite ✅

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Build request failed" | Check GitHub Secrets are all set |
| "Workflow not found" | Verify `build.yml` in `.github/workflows/` |
| "EAS build fails" | Check EXPO_TOKEN is valid |
| "App doesn't appear" | Wait 15-20 min, check App Store Connect |
| "P8 key expired" | Generate new key in App Store Connect |

**For detailed troubleshooting**, see GITHUB_ACTIONS_SETUP.md

---

## Credentials Overview

### GitHub Secrets (6 total)
- **EXPO_TOKEN** - EAS authentication
- **APPLE_TEAM_ID** - iOS signing
- **APP_STORE_CONNECT_KEY_ID** - App Store API
- **APP_STORE_CONNECT_ISSUER_ID** - App Store team ID
- **APP_STORE_CONNECT_P8_BASE64** - App Store private key
- **GITHUB_TOKEN** - GitHub API access

See **CREDENTIALS_REFERENCE.md** for detailed info.

---

## Timeline

```
T+0:00    Click "Push to TestFlight"
T+0:05    API triggers workflow
T+0:30    GitHub Actions starts
T+3:00    EAS Build starts
T+8:00    Build complete
T+9:00    EAS Submit starts
T+10:00   Submitted to TestFlight
T+15-20   Build appears in TestFlight
```

---

## Architecture

```
┌─────────────────────┐
│ Web Configurator    │  ← User enters app details
└──────────┬──────────┘
           │ POST /api/trigger-workflow
           ▼
┌─────────────────────┐
│ API Endpoint        │  ← Validates & dispatches
└──────────┬──────────┘
           │ GitHub API Call
           ▼
┌─────────────────────┐
│ GitHub Actions      │  ← Builds iOS app
│ - Setup environment │
│ - Build with EAS    │
│ - Submit to TF      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ TestFlight          │  ← Ready for testing
└─────────────────────┘
```

For detailed architecture, see **ARCHITECTURE.md**

---

## Next Steps

1. **Setup** (5 min) - Add GitHub Secrets
2. **Test** (20 min) - Run a test build
3. **Deploy** (10 min) - Host API to production
4. **Share** - Give configurator URL to team

---

## Support & Questions

For setup issues:
1. Check SETUP_CHECKLIST.md
2. Review GitHub Actions logs
3. See GITHUB_ACTIONS_SETUP.md troubleshooting

---

**Status**: ✅ Ready to use after GitHub Secrets setup
**Last updated**: 2026-04-06
**Version**: 1.0.0
