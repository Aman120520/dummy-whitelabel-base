# Quick Start Guide

## ⚡ 5-Minute Setup (GitHub Actions + EAS)

### Step 1: Add GitHub Secrets (2 min)

Go to: https://github.com/Aman120520/dummy-whitelabel-base/settings/secrets/actions

Add 5 secrets:
```
EXPO_TOKEN                           → Your Expo token
APPLE_TEAM_ID                        → 2H9MCN975Q
APPLE_APP_STORE_CONNECT_KEY_ID       → 2MFD4KXKR7
APPLE_APP_STORE_CONNECT_ISSUER_ID    → 69a6de87-46aa-47e3-e053-5b8c7c11a4d1
APPLE_APP_STORE_CONNECT_PRIVATE_KEY  → Contents of AuthKey_2MFD4KXKR7.p8
```

### Step 2: Push Code (1 min)

```bash
git push origin main
```

### Step 3: Run Workflow (2 min)

1. Go to Actions tab: https://github.com/Aman120520/dummy-whitelabel-base/actions
2. Click "Build and Submit to TestFlight"
3. Click "Run workflow" 
4. Fill in:
   - App Name: `Tayyar24 Laundry`
   - Bundle ID: `com.laundry.tayyar24`
   - Client ID: `4565`
5. Click "Run workflow"

### Done! ✅

Wait 15-20 minutes and check TestFlight:
https://testflight.apple.com

---

## 📚 Need Help?

- **Setup issues?** → See `GITHUB_ACTIONS_SETUP.md`
- **Test results?** → See `TEST_RESULTS.md`
- **Deployment guide?** → See `READY_TO_DEPLOY.md`
- **Choose approach?** → See `CERTIFICATE_MANAGEMENT_GUIDE.md`

---

## ⚙️ Advanced: Fastlane Match

See `FASTLANE_MATCH_SETUP.md` for enterprise-grade setup.

---

**Status:** ✅ All tests passed - You're ready to go!
