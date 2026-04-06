# TestFlight Automation Setup Guide

This guide explains how to automate iOS app builds and TestFlight submissions using GitHub Actions and EAS.

## What You Need

### 1. Apple Developer Account
- Apple Team ID (found in Xcode or Apple Developer)
- App Store Connect credentials

### 2. Expo/EAS Account
- Create account at https://expo.dev
- Create a project (or use existing)

### 3. GitHub Repository Secrets
Add these secrets to your GitHub repository settings (`Settings > Secrets and variables > Actions`):

```
EXPO_TOKEN                        = your_expo_token
APPLE_TEAM_ID                     = your_apple_team_id
APP_STORE_CONNECT_KEY_ID          = your_key_id
APP_STORE_CONNECT_ISSUER_ID       = your_issuer_id
APP_STORE_CONNECT_P8_BASE64       = base64_encoded_p8_file
APPLE_ID                          = your_apple_id@email.com
APPLE_ID_PASSWORD                 = app_specific_password
```

## Setup Steps

### Step 1: Get Your Expo Token
```bash
# Login to Expo
eas whoami

# Or get token from: https://expo.dev/settings/tokens
```

### Step 2: Create Apple App Store Connect Key
1. Go to https://appstoreconnect.apple.com
2. Users and Access → Keys → Create New Key
3. Select "App Store Connect API"
4. Download the `.p8` file

### Step 3: Convert P8 to Base64
```bash
base64 -i AuthKey_XXXX.p8 -o p8_base64.txt
cat p8_base64.txt
```

Copy this value to `APP_STORE_CONNECT_P8_BASE64` secret in GitHub.

### Step 4: Get App Specific Password
1. Go to https://appleid.apple.com/account/manage
2. App passwords → Generate password for "App Store Connect"
3. Copy and save as `APPLE_ID_PASSWORD` secret

### Step 5: Trigger the Build

Go to your GitHub repo → Actions → "Build and Deploy to TestFlight" → Run workflow

Enter:
- **App Name**: e.g., "My Awesome App"
- **Bundle ID**: e.g., "com.company.appname"
- **Client ID**: e.g., "123" (your organization ID)

Click "Run workflow"

## How It Works

1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Configure white-label settings (app name, bundle ID)
4. ✅ Build iOS app with EAS (takes ~15-20 minutes)
5. ✅ Automatically submit to TestFlight
6. ✅ Done! Testers receive beta invitation

## Troubleshooting

### "Failed to set up credentials"
- Ensure all GitHub secrets are set correctly
- Check EXPO_TOKEN is valid: `eas whoami`
- Verify P8 file is valid and not expired

### "Could not authenticate with Apple"
- Check APPLE_ID and password are correct
- Ensure app-specific password is used, not regular password
- Verify account has TestFlight access

### "Bundle ID already registered"
- Make sure the bundle ID hasn't been used in another app
- Each app needs a unique bundle ID

### Build timeout
- EAS builds can take 15-30 minutes
- Check build status at https://expo.dev/builds

## Environment Variables Used

### Build Profile (`eas.json`)
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_CONFIG_API_URL": "...",
        "EXPO_PUBLIC_COUPONS_API_URL": "...",
        "EAS_BUILD_NO_EXPO_GO_WARNING": "true"
      }
    }
  }
}
```

### Secrets (stored in GitHub, passed to EAS)
- `EXPO_TOKEN` - Expo authentication
- `APPLE_TEAM_ID` - Apple team identifier
- `APP_STORE_CONNECT_*` - App Store Connect credentials
- `APPLE_ID*` - Apple account credentials

## Manual Build (Local)

If you want to build locally:

```bash
# Configure for specific client
APP_NAME="Client App" \
BUNDLE_ID="com.client.app" \
APPLE_TEAM_ID="XXXXXXXXXX" \
node scripts/configure-white-label.js

# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios --profile production --latest
```

## Next Steps

1. Add more environment variables to `eas.json` as needed
2. Set up email notifications for build status
3. Configure multiple profiles for different clients
4. Add code signing certificate management
