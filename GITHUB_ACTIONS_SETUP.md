# GitHub Actions + EAS Build Setup (Simple)

This is the **simpler** approach: use GitHub Actions to run EAS builds without Fastlane.

## How It Works

1. You upload Apple certificates to GitHub Secrets
2. GitHub Actions creates credentials.json from those secrets
3. EAS uses the credentials to build and submit to TestFlight

---

## Step 1: Get Your Apple Credentials

You need 4 pieces of information:

1. **Apple Team ID**
   - Value: `2H9MCN975Q`

2. **Apple App Store Connect Key ID**
   - Value: `2MFD4KXKR7`

3. **Apple App Store Connect Issuer ID**
   - Value: `69a6de87-46aa-47e3-e053-5b8c7c11a4d1`

4. **Apple App Store Connect Private Key** (the .p8 file)
   - File: `AuthKey_2MFD4KXKR7.p8`

---

## Step 2: Add GitHub Secrets

Go to: https://github.com/YOUR_USERNAME/dummy-whitelabel-base/settings/secrets/actions

Add these 5 secrets:

1. **EXPO_TOKEN** = Your Expo token
2. **APPLE_TEAM_ID** = `2H9MCN975Q`
3. **APPLE_APP_STORE_CONNECT_KEY_ID** = `2MFD4KXKR7`
4. **APPLE_APP_STORE_CONNECT_ISSUER_ID** = `69a6de87-46aa-47e3-e053-5b8c7c11a4d1`
5. **APPLE_APP_STORE_CONNECT_PRIVATE_KEY** = Contents of AuthKey_2MFD4KXKR7.p8

---

## Step 3: Run a Build

1. Go to GitHub Actions
2. Click "Build and Submit to TestFlight"
3. Click "Run workflow"
4. Fill in your app details
5. Watch the build

---

## Quick Workflow

The GitHub Actions automatically:
- Checks out code
- Sets up Node.js & EAS
- Installs dependencies
- Configures your white-label app
- Creates credentials from GitHub secrets
- Builds with EAS
- Submits to TestFlight

---

## Troubleshooting

**"iOS credentials are missing"**
→ Check all 5 secrets are added to GitHub

**"EXPO_TOKEN not found"**
→ Add EXPO_TOKEN secret

**"Build failed: Invalid credentials"**
→ Verify Apple credentials are correct

---

## Fastlane Match Alternative

For enterprise-grade certificate management, see `FASTLANE_MATCH_SETUP.md`

---

Good luck! 🚀
