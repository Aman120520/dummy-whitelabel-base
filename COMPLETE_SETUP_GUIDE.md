# Complete TestFlight Automation Setup - READY TO USE

## Status: ✅ ALL CONFIGURED

Your credentials have been prepared. You only need to add them to GitHub, then you're ready to build!

---

## Step 1: Add GitHub Secrets (2 Minutes)

### Your Credentials (SAVE THESE)
```
APPLE_TEAM_ID: 2H9MCN975Q
EXPO_TOKEN: Bxrhap33MRN5COvONG8PodpjEaUIIHmxg
```

### Add to GitHub

**Go to:**
https://github.com/Aman120520/dummy-whitelabel-base/settings/secrets/actions

**Click "New repository secret" and add:**

1. **First Secret:**
   - Name: `EXPO_TOKEN`
   - Value: `Bxrhap33MRN5COvONG8PodpjEaUIIHmxg`
   - Click "Add secret"

2. **Second Secret:**
   - Name: `APPLE_TEAM_ID`
   - Value: `2H9MCN975Q`
   - Click "Add secret"

You should now see both secrets in your secrets list. ✅

---

## Step 2: Build Your App (Every Time)

### Go to GitHub Actions

**URL:** https://github.com/Aman120520/dummy-whitelabel-base/actions

### Run the Workflow

1. Click **"Build and Submit to TestFlight"** (left sidebar)
2. Click **"Run workflow"** button
3. Fill in the inputs:
   - **App Name:** `Tayyar24 Laundry` (or your app name)
   - **Bundle ID:** `com.laundry.tayyar24` (unique per app)
   - **Client ID:** `4565` (or your client ID)
4. Click **"Run workflow"** button

### Watch the Build

The workflow will start immediately. Click on the running job to watch the logs.

You should see:
```
✅ Checkout code
✅ Setup Node.js
✅ Setup EAS CLI
✅ Install dependencies
✅ Configure white-label app
✅ Build iOS app with EAS (takes ~10 min)
✅ Submit to TestFlight
✅ Build and TestFlight submission successful!
```

---

## Step 3: Check TestFlight (After ~20 Minutes)

1. Go to: https://testflight.apple.com
2. Sign in with your Apple ID
3. Look in "iOS Apps" section
4. Your app should appear there
5. Testers automatically get invited by email

---

## What Happens Automatically

The workflow does:
1. ✅ Checks out your code from GitHub
2. ✅ Sets up Node.js and EAS CLI
3. ✅ Installs npm dependencies
4. ✅ Updates app.json with your custom app name, bundle ID, and Apple Team ID
5. ✅ Builds iOS app using EAS (uses your Apple credentials from Expo)
6. ✅ Submits the build to TestFlight
7. ✅ Reports success/failure

---

## Troubleshooting

### "Build failed: EXPO_TOKEN not found"
→ You didn't add the EXPO_TOKEN secret to GitHub

**Fix:** Add it at: https://github.com/Aman120520/dummy-whitelabel-base/settings/secrets/actions

### "Build failed: APPLE_TEAM_ID not found"
→ You didn't add the APPLE_TEAM_ID secret to GitHub

**Fix:** Add it at: https://github.com/Aman120520/dummy-whitelabel-base/settings/secrets/actions

### "Failed to set up credentials"
→ The credentials weren't uploaded to EAS servers yet

**Fix:** Run this locally:
```bash
eas credentials --platform ios
```

Then try building again.

### Build is stuck for 30+ minutes
→ EAS build servers are sometimes slow

**Check status:**
1. Go to: https://expo.dev/builds
2. Sign in with your Expo account
3. Look for the stuck build
4. If it's been 30+ min, you can cancel and try again

---

## Summary

1. ✅ Add 2 secrets to GitHub (done in 2 min)
2. ✅ Go to Actions tab
3. ✅ Click "Run workflow"
4. ✅ Fill in app details
5. ✅ Wait 20 minutes
6. ✅ Check TestFlight

That's it! Every time you want to build a new white-label app, just repeat steps 2-6.

---

## Questions?

- **Workflow file:** `.github/workflows/build-and-submit.yml`
- **White-label config:** `scripts/configure-white-label.js`
- **App config:** `app.json`
- **EAS config:** `eas.json`

All files are in your repo and ready to go!
