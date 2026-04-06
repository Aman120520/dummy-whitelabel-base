# TestFlight Build Automation - Final Setup

## One Time Setup (Do This Once)

### 1. Upload Apple Credentials to EAS

```bash
eas login
eas credentials --platform ios
```

This command:
- Asks for your Apple Team ID
- Asks for App Store Connect credentials
- Uploads them to Expo servers (one time, reusable for all builds)

### 2. Add GitHub Secrets

Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add these 2 secrets:

| Secret | Value | Where to Get |
|--------|-------|--------------|
| `EXPO_TOKEN` | Your Expo token | Run: `eas whoami` |
| `APPLE_TEAM_ID` | Your Apple Team ID | Run: `eas credentials --platform ios --list` |

---

## How to Build

### Option 1: From GitHub (Easiest)

1. Go to your repo: https://github.com/Aman120520/dummy-whitelabel-base
2. Click **Actions** tab
3. Select **"Build and Submit to TestFlight"**
4. Click **"Run workflow"**
5. Fill in:
   - App Name: `Tayyar24 Laundry`
   - Bundle ID: `com.tayyar.laundry24`
   - Client ID: `4565`
6. Click **"Run workflow"**
7. Wait ~20 minutes

### Option 2: From Command Line

```bash
gh workflow run build-and-submit.yml \
  -f appName="Tayyar24 Laundry" \
  -f bundleId="com.tayyar.laundry24" \
  -f clientId="4565"
```

---

## What Happens

The workflow:
1. ✅ Checks out your code
2. ✅ Sets up Node.js and EAS CLI
3. ✅ Installs dependencies
4. ✅ Applies white-label config (your custom app name + bundle ID)
5. ✅ Builds iOS app with EAS (uses credentials from Expo servers)
6. ✅ Submits to TestFlight automatically

Total time: ~15-20 minutes

---

## Monitor the Build

1. Go to Actions tab: https://github.com/Aman120520/dummy-whitelabel-base/actions
2. Click the running workflow
3. Watch the logs in real-time

---

## Check TestFlight

After build completes:
1. Go to: https://testflight.apple.com
2. Look for your app in "iOS Apps"
3. It appears ~5 minutes after build completes

---

## Troubleshooting

### "Build failed: EXPO_TOKEN not found"
→ Add `EXPO_TOKEN` secret to GitHub

### "Build failed: APPLE_TEAM_ID not found"
→ Add `APPLE_TEAM_ID` secret to GitHub

### "Failed to set up credentials"
→ Run: `eas credentials --platform ios`
→ Make sure credentials are uploaded to EAS

### Build stuck for 30+ minutes
→ Check GitHub Actions logs for error
→ Go to https://expo.dev/builds to check EAS status

---

## Files

- **Workflow**: `.github/workflows/build-and-submit.yml`
- **Config Script**: `scripts/configure-white-label.js`
- **EAS Config**: `eas.json`
- **App Config**: `app.json`

---

## That's It!

You now have fully automated TestFlight deployment. Just:

1. Go to GitHub Actions
2. Click "Run workflow"
3. Fill app details
4. Wait 20 minutes
5. Testers get invited automatically

No web UI. No complex setup. Just GitHub Actions + EAS doing what they do best.
