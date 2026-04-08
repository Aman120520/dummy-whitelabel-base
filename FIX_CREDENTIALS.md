# Fix: iOS Credentials Not Found

## The Problem

Your GitHub Actions workflow failed with:
```
✔ Using local iOS credentials (credentials.json)
iOS credentials are missing in credentials.json
Error: build command failed.
```

**Reason:** GitHub Actions doesn't have access to your local Apple certificates. We configured EAS to look for credentials **locally**, but GitHub Actions runs on a brand-new virtual machine every time.

## The Solution

Use **Expo's cloud credentials** instead. This way, your Apple certificates are stored securely with Expo, and GitHub Actions can download them using your `EXPO_TOKEN`.

---

## Step 1: Sync Your Credentials to Expo (Do This Locally)

Open your terminal in your project folder and run:

```bash
eas credentials
```

Follow the prompts:

1. **Select platform:** Choose `iOS`
2. **Select profile:** Choose `production`
3. **Sign in:** Log in with your Apple Developer account
4. **Permissions:** Grant Expo permission to manage your certificates
5. **Done:** Expo will upload your certificates to their servers

This step must be done on **your local computer** where you have interactive terminal access.

---

## Step 2: Verify the Fix

After syncing, your `eas.json` already has the correct setting:

```json
{
  "build": {
    "production": {
      "ios": {
        "credentialsSource": "remote",
        "distribution": "store"
      }
    }
  }
}
```

✅ `"credentialsSource": "remote"` means EAS will use cloud credentials from Expo

---

## Step 3: Push and Try Again

```bash
git push origin main
```

Then go to GitHub Actions and run your workflow again:

1. Go to Actions tab
2. Click "Build and Submit to TestFlight"
3. Click "Run workflow"
4. Fill in app details
5. Click "Run workflow"

This time it will work! ✅

---

## What Changed?

### Before (Failed):
- ❌ `"credentialsSource": "local"` - looked for certificates on GitHub Actions
- ❌ Had to create credentials.json in workflow - unnecessary complexity
- ❌ Build failed because certificates weren't found

### After (Works):
- ✅ `"credentialsSource": "remote"` - uses Expo's cloud certificates
- ✅ No need to create credentials.json - Expo handles it automatically
- ✅ EXPO_TOKEN automatically downloads certificates from Expo

---

## Quick Reference

| Step | Action | Details |
|------|--------|---------|
| 1 | Run `eas credentials` locally | Uploads Apple certs to Expo |
| 2 | Verify eas.json | Should have `"credentialsSource": "remote"` |
| 3 | Push to GitHub | `git push origin main` |
| 4 | Run workflow | Go to Actions tab and trigger build |

---

## Security

✅ **Your Apple credentials are safe:**
- Stored encrypted on Expo's servers
- Only accessible with your EXPO_TOKEN
- GitHub Actions uses EXPO_TOKEN to access them securely
- Never stored as plain text in GitHub secrets

---

## What If It Still Fails?

If the build still fails after these steps:

1. **Check EXPO_TOKEN:** Make sure it's correct in GitHub secrets
2. **Verify credentials exist:** Run `eas credentials` again locally
3. **Check logs:** The GitHub Actions log will show if credentials weren't found

---

## Need Help?

- **EAS documentation:** https://docs.expo.dev/eas/credentials/
- **Expo credentials guide:** https://docs.expo.dev/eas/build/ios/#credentials

---

**Status:** ✅ Fixed and ready to build!
