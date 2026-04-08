# iOS Certificate Management Guide

You now have **two proven approaches** for managing iOS certificates in GitHub Actions. Choose based on your needs.

---

## 🚀 Quick Comparison

| Feature | GitHub Actions + EAS | Fastlane Match |
|---------|-------------------|-----------------|
| **Setup Time** | 5 minutes | 15 minutes |
| **Complexity** | Simple | Advanced |
| **Certificates Stored** | GitHub Secrets | Encrypted Git Repo |
| **Multi-Project Support** | Good | Excellent |
| **Enterprise-Ready** | ✅ Yes | ✅ Yes |
| **Certificate Rotation** | Manual | Automatic |
| **Best For** | White-label apps | Large teams |

---

## Option 1: GitHub Actions + EAS (RECOMMENDED FOR YOU)

### Why Choose This?
- ✅ Simplest setup (5 minutes)
- ✅ Works great for white-label apps
- ✅ Fewer moving parts to manage
- ✅ No additional tools needed

### What You Do
1. Add 5 GitHub secrets (Apple credentials)
2. Push code to GitHub
3. Run workflow from Actions tab

### Setup Instructions
👉 See: **GITHUB_ACTIONS_SETUP.md**

### Workflow File
- `.github/workflows/build-and-submit.yml`

---

## Option 2: Fastlane Match (ADVANCED)

### Why Choose This?
- ✅ Enterprise-grade certificate management
- ✅ Certificates encrypted in Git repo
- ✅ Automatic certificate syncing
- ✅ Works with multiple Xcode projects
- ✅ Team-friendly

### What You Do
1. Create a private GitHub repo for certificates
2. Install Fastlane locally
3. Run `fastlane match init` and `fastlane match create`
4. Add 5 GitHub secrets
5. Push code to GitHub
6. Run workflow from Actions tab

### Setup Instructions
👉 See: **FASTLANE_MATCH_SETUP.md**

### Workflow File
- `.github/workflows/build-and-submit-fastlane.yml`

### Fastlane Files
- `ios/Fastfile` - Fastlane configuration
- `ios/Matchfile` - Match certificate configuration

---

## Current Status

### ✅ Completed
- [x] Expo app setup with white-label support
- [x] EAS build configuration (eas.json)
- [x] GitHub Actions workflow (simple + Fastlane)
- [x] White-label configuration script
- [x] Comprehensive setup guides

### ⏳ Remaining (Choose One)
- [ ] Option 1: Add GitHub Secrets (GitHub Actions + EAS)
- [ ] Option 2: Setup Fastlane Match (Enterprise)

---

## Decision Tree

**Are you working alone or with a small team?**
→ Use **GitHub Actions + EAS** (Option 1)

**Are you managing certificates for a large team?**
→ Use **Fastlane Match** (Option 2)

**Need automatic certificate rotation and syncing?**
→ Use **Fastlane Match** (Option 2)

**Want the simplest possible setup?**
→ Use **GitHub Actions + EAS** (Option 1)

---

## What Happens When You Build

Both workflows do the same thing (in different ways):

1. ✅ Checkout your code
2. ✅ Set up Node.js & dependencies
3. ✅ Configure white-label app (name, bundle ID, etc.)
4. ✅ Sync Apple certificates/provisioning profiles
5. ✅ Build iOS app
6. ✅ Submit to TestFlight
7. ✅ Done! Check TestFlight in 15-20 minutes

---

## Credentials You'll Need

Regardless of approach, you'll need:

```
APPLE_TEAM_ID: 2H9MCN975Q
APPLE_APP_STORE_CONNECT_KEY_ID: 2MFD4KXKR7
APPLE_APP_STORE_CONNECT_ISSUER_ID: 69a6de87-46aa-47e3-e053-5b8c7c11a4d1
EXPO_TOKEN: [Your Expo token from https://expo.dev]
FASTLANE_USER: your.email@apple.com (if using Fastlane Match)
FASTLANE_PASSWORD: App-specific password (if using Fastlane Match)
```

---

## Next Steps

### For GitHub Actions + EAS:
1. Read **GITHUB_ACTIONS_SETUP.md**
2. Add 5 GitHub secrets
3. Go to Actions and run workflow

### For Fastlane Match:
1. Read **FASTLANE_MATCH_SETUP.md**
2. Create private certificates repo
3. Run Fastlane locally
4. Add GitHub secrets
5. Go to Actions and run workflow

---

## Files in This Project

```
.github/workflows/
  ├── build-and-submit.yml              ← Use this (simple EAS)
  └── build-and-submit-fastlane.yml     ← Or this (Fastlane Match)

ios/
  ├── Fastfile                          ← Fastlane config
  └── Matchfile                         ← Match config

scripts/
  └── configure-white-label.js          ← Auto-configures app

eas.json                                ← EAS build config
app.json                                ← App config
credentials.json                        ← Local credentials ref

GITHUB_ACTIONS_SETUP.md                 ← Start here (simple)
FASTLANE_MATCH_SETUP.md                 ← Start here (advanced)
```

---

## Questions?

- **How do I test locally?**
  → Run `npm run ios` or `npm run android`

- **How do I get a new Apple key?**
  → App Store Connect → Keys → Create new key

- **How do I rotate certificates?**
  → GitHub Actions: manually in secrets
  → Fastlane Match: `fastlane match nuke` then `fastlane match create`

- **What if the build fails?**
  → Check the Actions log for the error
  → Most common: wrong credentials or GitHub secrets not set

---

## Security Best Practices

✅ **Do:**
- Use GitHub Secrets for sensitive data
- Keep Apple credentials private
- Use app-specific passwords (not main password)
- Regenerate tokens yearly

❌ **Don't:**
- Commit `.p8` files to Git
- Share credentials in Slack/email
- Use personal Apple password in secrets
- Leave old tokens in GitHub

---

Choose your path and let me know if you hit any issues! 🚀
