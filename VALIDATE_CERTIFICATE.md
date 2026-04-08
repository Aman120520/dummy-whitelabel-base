# Validate Distribution Certificate (One-Time Setup)

## The Issue

```
✔ Using remote iOS credentials (Expo server)
✗ Distribution Certificate is not validated
✗ Failed to set up credentials.
```

**What this means:** Your Apple Distribution Certificate exists but hasn't been validated yet. Apple requires validation on a trusted machine (your Mac) before it can be used for non-interactive builds (like GitHub Actions).

---

## The Fix (One-Time, Takes 15-20 Minutes)

### Step 1: Build Locally (Interactive)

Open your terminal and run:

```bash
eas build --platform ios --profile production --interactive
```

**Important:** Use `--interactive` (NOT `--non-interactive`)

This will:
- ✅ Validate your Distribution Certificate interactively
- ✅ Build your app
- ✅ Store the validation on Expo's servers
- ✅ Enable future non-interactive builds (GitHub Actions)

### Step 2: Follow the Prompts

You may be asked to:
- Confirm your bundle ID
- Confirm your app name
- Select a device or simulator for testing

Just follow the on-screen prompts.

### Step 3: Wait for Build (15-20 minutes)

Watch the logs. You should see:
```
🔨 Building...
✅ Build completed successfully
```

### Step 4: Push to GitHub

```bash
git push origin main
```

### Step 5: Try GitHub Actions Again

1. Go to GitHub Actions
2. Click "Build and Submit to TestFlight"
3. Click "Run workflow"
4. Fill in your app details
5. Click "Run workflow"

**This time it will work! ✅**

---

## Why This Happens

Apple has a security requirement:
- Distribution Certificates must be validated on a **trusted machine** first
- The validation proves you control the certificate
- Once validated, Expo's servers can use it remotely

It's a one-time setup. After this, GitHub Actions will work every time.

---

## What Gets Stored

After validation:
- ✅ Your Apple Distribution Certificate is stored encrypted on Expo's servers
- ✅ The validation proof is stored
- ✅ Your `EXPO_TOKEN` can access it securely from GitHub Actions
- ✅ Your local Mac never stores raw certificates

---

## If Build Fails Locally

If the local build fails:

1. **Check your bundle ID** - Make sure it matches your Apple Developer account
2. **Check your provisioning profile** - Run `eas credentials` again
3. **Check Expo connection** - Make sure you're logged in to Expo

---

## Workflow After This

Once validation is complete, the workflow is:

```
Local Mac                    GitHub Actions              TestFlight
    |                             |                          |
    | eas build --interactive     |                          |
    | (validates cert)            |                          |
    |---(validation stored)-----→ Expo Servers              |
    |                             |                          |
                                  | git push                |
                                  |                          |
                                  | eas build --non-interactive
                                  | (uses validated cert)  |
                                  |---(builds app)----------→ TestFlight
                                  |                          |
                                  |---(submits)-------------→ TestFlight
```

---

## Quick Checklist

- [ ] Run `eas build --platform ios --profile production --interactive`
- [ ] Wait for build to complete (15-20 min)
- [ ] See "Build completed successfully" message
- [ ] Run `git push origin main`
- [ ] Go to GitHub Actions and trigger workflow
- [ ] Watch build succeed
- [ ] Check TestFlight for your app

---

## Need Help?

- **EAS Build documentation:** https://docs.expo.dev/eas/build/
- **Certificate validation:** https://docs.expo.dev/eas/credentials/#ios

---

**After this one step, GitHub Actions will work forever!** 🚀
