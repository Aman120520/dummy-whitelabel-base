# GitHub Actions EAS Build & Submit Setup Guide

This guide explains how to set up GitHub Actions for automated iOS builds and TestFlight submissions using EAS.

## ⚠️ Important: Use EAS Credentials Store (Not Local Keys)

EAS stores credentials on their servers, not locally. When you run `eas build` interactively, EAS saves your Apple credentials remotely. GitHub Actions will use these stored credentials automatically—**no local API keys needed in GitHub secrets**.

## Prerequisites

1. **EAS Credentials Already Set Up**: You must have already built the app at least once interactively (which you have done)
   - This stores your Apple credentials on EAS servers
   - Run: `eas credentials` to verify they're stored

2. **EXPO_TOKEN**: Only secret needed in GitHub

## Step 1: Verify EAS Credentials Are Stored

Run this locally to confirm:

```bash
eas credentials
```

You should see output like:
```
Credentials for @wesencedev/dummy-whitelabel-base:
  iOS:
    ✔ Distribution Certificate
    ✔ Provisioning Profile
```

If credentials are missing, run an interactive build first:

```bash
eas build --platform ios --profile production --interactive
```

This will prompt you to authenticate with Apple and save the credentials on EAS servers.

## Step 2: Create EXPO_TOKEN GitHub Secret

1. Generate an EAS token locally:
   ```bash
   eas token create --name github-actions
   ```

2. Go to your GitHub repository:
   - Settings → Secrets and variables → Actions
   - Click **New repository secret**
   - Name: `EXPO_TOKEN`
   - Value: Paste the token you just created

That's it! Only **1 secret** needed.

## Step 3: Update eas.json (Already Done)

Your `eas.json` is already configured with:

```json
{
  "build": {
    "production": {
      "ios": {
        "credentialsSource": "remote",
        "distribution": "store"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "6761165135",
        "appleTeamId": "2H9MCN975Q"
      }
    }
  }
}
```

## Step 4: Run the Workflow

1. Go to GitHub → **Actions** tab
2. Select **Build and Submit to TestFlight**
3. Click **Run workflow**
4. Fill in the inputs:
   - App Name: `dummy-whitelabel-base`
   - Bundle ID: `com.wesence.dummywhitelabelbase`
   - Client/Organization ID: Your client identifier

The workflow will:
- ✅ Authenticate via EXPO_TOKEN
- ✅ Use EAS-stored Apple credentials (no API keys needed)
- ✅ Build the iOS app
- ✅ Auto-increment build number
- ✅ Submit to TestFlight

## Workflow Steps

1. Checkout code
2. Setup Node.js & EAS CLI
3. Install dependencies
4. Configure white-label app
5. Build with EAS (uses remote credentials)
6. Submit to TestFlight (uses remote credentials)

## Troubleshooting

### "Credentials are not set up"
- **Solution**: Run `eas build --platform ios --profile production --interactive` locally
- This will prompt for Apple login and save credentials on EAS
- Then try GitHub workflow again

### "ascAppId not found"
- Verify `ascAppId: "6761165135"` is in `eas.json` under `submit.production.ios`

### Build still fails in GitHub but works locally
- Ensure `EXPO_TOKEN` is set correctly in GitHub secrets
- Test token locally: `EXPO_TOKEN=<token> eas whoami`

### Build takes forever or stays queued
- Check EAS dashboard: https://expo.dev/accounts/wesencedev/projects/dummy-whitelabel-base/builds
- Free tier has slow queues; consider upgrading

## How It Works

```
Local (Interactive):
  eas build → prompts Apple login → stores credentials on EAS servers

GitHub Actions (Non-Interactive):
  EXPO_TOKEN → authenticates with EAS → retrieves stored credentials → builds
```

The key difference: You're **not storing Apple credentials in GitHub**. You're storing an EAS token that lets GitHub access credentials already stored on EAS servers.

## Notes

- Build number auto-increments via `"autoIncrement": true` in eas.json
- Build takes 10-20 minutes depending on queue
- TestFlight submission is automatic once build completes
- Uses macOS runner for best compatibility with Apple build tools
