# Testing EAS Workflow Guide

This guide shows you how to test the EAS Workflow in multiple ways.

---

## Option 1: Test from Command Line (Recommended for Testing)

### Prerequisites
- Expo account with project set up
- Apple credentials uploaded: `eas credentials --platform ios`
- EXPO_TOKEN available

### Test Script

```bash
# Test with environment variables
APP_NAME="Test App" \
BUNDLE_ID="com.test.app" \
APPLE_TEAM_ID="XXXXXXXXXX" \
EXPO_TOKEN="your_expo_token_here" \
node scripts/trigger-eas-workflow.js
```

### Or with command-line arguments

```bash
node scripts/trigger-eas-workflow.js \
  --app-name "Test App" \
  --bundle-id "com.test.app" \
  --apple-team-id "XXXXXXXXXX" \
  --expo-token "your_expo_token_here"
```

### Output Example
```
🚀 Triggering EAS Workflow...
   Project ID: 952733e3-51a5-40b4-8554-eaac3a5a6390
   App Name: Test App
   Bundle ID: com.test.app

✅ Workflow triggered successfully!
   Run ID: abc123def456

📊 Check status with:
   eas workflow:status abc123def456
   eas workflow:logs abc123def456

🎯 Build will appear in TestFlight in ~15-20 minutes
```

---

## Option 2: Test from Web Configurator (web-eas.js)

### Setup

1. **Get your Expo Token:**
   ```bash
   eas whoami
   # Or generate new: https://expo.dev/settings/tokens
   ```

2. **Get your Apple Team ID:**
   ```bash
   eas credentials --platform ios --list
   # Or find at: https://developer.apple.com/account
   ```

3. **Use web-eas.js instead of web.js:**
   - Open `web-configrator/web-eas.js` in your browser
   - Or update your React app to use it

4. **Fill in the form:**
   - Expo Token: `expo_xxxxx...`
   - Apple Team ID: `XXXXXXXXXX`
   - Bundle ID: `com.test.app`
   - App Name: `Test App`

5. **Click "Push to TestFlight"**

6. **Watch the logs in real-time**

---

## Option 3: Direct EAS CLI

### Validate workflow file
```bash
eas workflow:validate eas-workflows/build-testflight.yml
```

### Run workflow directly
```bash
eas workflow:run \
  --workflow eas-workflows/build-testflight.yml \
  --env APP_NAME="Test App" \
  --env BUNDLE_ID="com.test.app" \
  --env APPLE_TEAM_ID="XXXXXXXXXX"
```

### Monitor the build
```bash
# List recent runs
eas workflow:runs

# Check specific run
eas workflow:status <RUN_ID>

# View logs
eas workflow:logs <RUN_ID>
```

---

## Step-by-Step Test Flow

### Step 1: Verify Credentials
```bash
# Ensure credentials are uploaded to EAS
eas credentials --platform ios --list

# Should show:
# ✅ Distribution Certificate
# ✅ Provisioning Profile
```

### Step 2: Validate Workflow
```bash
eas workflow:validate eas-workflows/build-testflight.yml

# Should output: ✅ Workflow is valid
```

### Step 3: Trigger Workflow
```bash
# Option A: Using script
APP_NAME="Test App" \
BUNDLE_ID="com.test.app123" \
APPLE_TEAM_ID="XXXXXXXXXX" \
EXPO_TOKEN="expo_xxxx" \
node scripts/trigger-eas-workflow.js

# Option B: Using EAS CLI directly
eas workflow:run --workflow eas-workflows/build-testflight.yml

# Option C: Using web configurator
# Open web-configrator/web-eas.js and click button
```

### Step 4: Monitor Build
```bash
# Get run ID from output above
eas workflow:status <RUN_ID>

# Follow real-time logs
eas workflow:logs <RUN_ID>
```

### Step 5: Check TestFlight
1. Go to https://testflight.apple.com
2. Look for your app in the "iOS Apps" section
3. Should appear ~15-20 minutes after build completes

---

## Troubleshooting

### "Credentials not found"
```bash
# Upload credentials first
eas credentials --platform ios

# Verify they exist
eas credentials --platform ios --list
```

### "Project ID not found"
```bash
# Check app.json has projectId
cat app.json | grep -A 2 '"eas"'

# Should show: "projectId": "xxxxx-xxxxx-xxxxx..."
```

### "Invalid EXPO_TOKEN"
```bash
# Generate new token
eas login
eas whoami

# Or get from: https://expo.dev/settings/tokens
```

### "Workflow file not found"
```bash
# Validate the file
eas workflow:validate eas-workflows/build-testflight.yml

# Check file exists
ls -la eas-workflows/build-testflight.yml
```

### Build stuck in "pending"
```bash
# Check for any build capacity issues
eas workflow:status <RUN_ID>

# View logs for more details
eas workflow:logs <RUN_ID>
```

---

## Files Created for Testing

| File | Purpose |
|---|---|
| `scripts/trigger-eas-workflow.js` | Command-line script to trigger EAS Workflow |
| `web-configrator/web-eas.js` | React web UI for EAS Workflow (alternative to web.js) |
| `eas-workflows/build-testflight.yml` | The actual EAS Workflow definition |
| `.github/workflows/build.yml` | GitHub Actions (fallback) |

---

## Success Criteria

✅ Script completes without errors  
✅ Run ID is printed  
✅ `eas workflow:logs <RUN_ID>` shows real-time build progress  
✅ Build completes successfully  
✅ App appears in TestFlight within 20 minutes  

---

## Next Steps

1. Test with command-line script
2. Monitor with `eas workflow:logs`
3. Verify app in TestFlight
4. Integrate web-eas.js into your application
5. Repeat with different app names/bundle IDs

Good luck! 🚀
