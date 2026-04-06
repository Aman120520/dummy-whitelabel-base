# TestFlight Automation - Complete Setup Guide

## Overview

This is the **cleanest, simplest approach** to automate iOS builds and TestFlight submissions.

**Key idea:** Store credentials in EAS (Expo) servers once, then every CI build just works automatically.

---

## Step 1: One-Time Local Setup (Do This Once)

### 1.1 Upload iOS Credentials to EAS

```bash
eas credentials --platform ios
```

This command will:
1. Ask for your Apple Team ID
2. Ask for your App Store Connect credentials (or create a new key)
3. Upload the distribution certificate + provisioning profile to Expo servers
4. Done! EAS now has your credentials.

**You never need to do this again.** Even if you create new apps with different bundle IDs, EAS reuses the same credentials.

### 1.2 Verify Credentials Are Uploaded

```bash
eas credentials --platform ios --list
```

You should see your certificate and provisioning profile listed.

---

## Step 2: Add GitHub Secrets

Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add these 2 secrets:

| Secret Name | Value | Where to Get |
|---|---|---|
| `EXPO_TOKEN` | Your Expo token | https://expo.dev/settings/tokens (create new token) |
| `APPLE_TEAM_ID` | Your Apple Team ID | https://developer.apple.com/account (10 characters) |

**That's it!** Only 2 secrets needed. No P8 keys, no App Store Connect credentials in GitHub.

---

## Step 3: Trigger a Build

### Option A: From Web Configurator (Recommended)
1. Go to your web configurator UI
2. Enter:
   - **App Name**: e.g., "Tayyar24 Laundry"
   - **Bundle ID**: e.g., "com.tayyar.laundry24"
   - **Client ID**: e.g., "4565"
   - **GitHub PAT**: Your GitHub Personal Access Token
3. Click **Push to TestFlight (iOS)**
4. Wait ~20 minutes

### Option B: From GitHub UI
1. Go to **Actions** tab
2. Click **Generate Fast iOS App**
3. Click **Run workflow**
4. Fill in the inputs
5. Click **Run workflow**
6. Wait ~20 minutes

---

## Step 4: Wait for Build

The workflow will:
1. ✅ Checkout your code
2. ✅ Setup Node.js + EAS CLI
3. ✅ Install dependencies
4. ✅ Apply white-label config (patch app.json with custom name/bundle ID)
5. ✅ Build iOS app with EAS (uses credentials from Expo servers)
6. ✅ Submit to TestFlight automatically

**Total time:** ~15-20 minutes

---

## Step 5: Testers Get Notified

Once the build completes:
1. App appears in TestFlight
2. Your testers receive automatic email invitations
3. Testers can install the beta app via TestFlight

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `EXPO_TOKEN not found` | Add `EXPO_TOKEN` secret to GitHub Settings |
| `APPLE_TEAM_ID not found` | Add `APPLE_TEAM_ID` secret to GitHub Settings |
| `Error: build command failed` at "credential" step | Run `eas credentials --platform ios` locally. Credentials not uploaded. |
| `Bundle ID already registered` | Each app needs a unique bundle ID. Try a different one. |
| Build timeout after 30 min | EAS builds sometimes take 20-30 minutes. Check https://expo.dev/builds for status. |
| `Distribution Certificate is not validated` | You might be using an old certificate. Run `eas credentials --platform ios` again to refresh. |

---

## FAQ

**Q: Do I need to upload credentials every time I build?**
A: No! You upload once via `eas credentials`, then every build uses them automatically.

**Q: Can I use credentials for multiple apps?**
A: Yes! The distribution certificate and provisioning profile work for all your apps under the same Apple Team.

**Q: What if I lose the P8 file from Apple?**
A: No problem. Create a new key at https://appstoreconnect.apple.com, then run `eas credentials --platform ios` again.

**Q: Can I build locally?**
A: Yes! Run locally:
```bash
APP_NAME="My App" \
BUNDLE_ID="com.my.app" \
APPLE_TEAM_ID="XXXXXXXXXX" \
node scripts/configure-white-label.js

eas build --platform ios --profile production

eas submit --platform ios --profile production --latest
```

---

## Architecture

```
┌─────────────────────┐
│  Web Configurator   │
│   (web.js)          │
└──────────┬──────────┘
           │
           │ Triggers GitHub Actions
           │ (workflow_dispatch API)
           ↓
┌─────────────────────────────────────┐
│  GitHub Actions (build.yml)         │
│  - Configure white-label (app.json) │
│  - eas build (uses EAS credentials) │
│  - eas submit (to TestFlight)       │
└──────────┬──────────────────────────┘
           │
           ↓
┌──────────────────────────┐
│  EAS Servers             │
│  - Build iOS app         │
│  - Use stored creds      │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  TestFlight              │
│  - App uploaded          │
│  - Testers notified      │
└──────────────────────────┘
```

---

## Next Steps

1. Run `eas credentials --platform ios` locally
2. Add `EXPO_TOKEN` and `APPLE_TEAM_ID` to GitHub secrets
3. Trigger a build from your web configurator
4. Check TestFlight for the app in ~20 minutes

That's it! You now have fully automated TestFlight deployment. 🚀
