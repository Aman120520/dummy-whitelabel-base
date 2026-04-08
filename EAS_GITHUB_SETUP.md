# GitHub Actions EAS Build & Submit Setup Guide

This guide explains how to set up GitHub Actions secrets for automated iOS builds and TestFlight submissions using EAS.

## Prerequisites

- Access to Apple Developer Account
- An App Store Connect API Key created in your developer account
- EAS project initialized

## GitHub Secrets Setup

You need to add the following secrets to your GitHub repository:

### 1. EXPO_TOKEN
- **Description**: Authentication token for EAS services
- **How to get**: 
  - Run `eas whoami` to verify you're logged in
  - Run `eas token create --name github-actions` to generate a token
  - Copy the token value

### 2. APPLE_API_KEY_ID
- **Description**: Your App Store Connect API Key ID
- **How to get**:
  - Go to App Store Connect → Users and Access → Keys
  - Create a new key or find your existing "GitHub Actions Configurator" key
  - Copy the Key ID (looks like: `2MFD4KXKR7`)

### 3. APPLE_API_ISSUER_ID
- **Description**: Your App Store Connect Issuer ID
- **How to get**:
  - Go to App Store Connect → Users and Access → Keys
  - The Issuer ID is displayed at the top of the page
  - Copy the Issuer ID (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### 4. APPLE_API_KEY_CONTENT
- **Description**: The actual API key file content (.p8)
- **How to get**:
  1. Go to App Store Connect → Users and Access → Keys
  2. Click the download button next to your API key
  3. You'll get a `.p8` file
  4. Open the file in a text editor
  5. Copy the entire content (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

### 5. APPLE_TEAM_ID (Optional)
- **Description**: Your Apple Team ID
- **How to get**: Found in your Apple Developer Account settings or in Xcode

## Adding Secrets to GitHub

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the appropriate name and value
5. Repeat for all 4 required secrets

## Workflow Behavior

The workflow (`build-and-submit.yml`) does the following:

1. Checks out your code
2. Sets up Node.js and EAS CLI
3. Installs dependencies
4. Configures the white-label app with your specified app name and bundle ID
5. Sets up Apple API credentials
6. Builds the iOS app with EAS (increments build number automatically)
7. Submits to TestFlight
8. Shows success message

## Manual Workflow Dispatch

To trigger the workflow:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Build and Submit to TestFlight**
4. Click **Run workflow**
5. Fill in:
   - **App Name**: The display name of your app
   - **Bundle ID**: iOS bundle identifier (e.g., `com.wesence.dummywhitelabelbase`)
   - **Client/Organization ID**: Your client identifier

## Troubleshooting

### Build fails with "credentials not found"
- Ensure all 4 secrets are set correctly in GitHub
- Verify the APPLE_API_KEY_CONTENT has proper formatting (multiline key)

### "ascAppId not found"
- Make sure your ASC App ID (6761165135) is in `eas.json` under `submit.production.ios.ascAppId`

### Build queued but never starts
- Check if your EAS account is on a paid plan (free tier has slower queues)
- Check EAS dashboard at https://expo.dev for build status

### Submission fails
- Verify the build completed successfully before submission
- Check that TestFlight is enabled for your app in App Store Connect

## Key Differences from Manual Terminal Commands

The GitHub Actions workflow automates:

1. **Interactive Apple login** → Uses API key credentials stored in secrets
2. **Manual build number increment** → Done by EAS automatically (configured in eas.json)
3. **Environment variable loading** → Uses GitHub secrets instead of terminal env vars

## Environment Variables

The workflow sets these automatically:

- `EXPO_TOKEN`: From GitHub secrets
- `APPLE_API_KEY_ID`: From GitHub secrets
- `APPLE_API_ISSUER_ID`: From GitHub secrets
- `EAS_BUILD_NO_EXPO_GO_WARNING`: Set in eas.json

## Notes

- Build takes 10-20 minutes depending on EAS queue
- TestFlight submission is automatic once build completes
- Build number auto-increments via `"autoIncrement": true` in eas.json
- Uses macOS runner for better compatibility with Apple tooling
