# Scripts Documentation

Complete documentation for all scripts in the project.

---

## Overview

The project uses scripts for:
1. **App Configuration** - Dynamic white-label setup
2. **Project Setup** - Initial project reset

### Scripts Directory
```
scripts/
├── configure-white-label.js  ← Main script (actively used)
└── reset-project.js           ← Expo template utility
```

---

## 1. configure-white-label.js

### Purpose
Dynamically configures the app for white-label deployment. Updates configuration files to create a completely unique app for each client.

### What It Does

This script is the **heart** of the white-label system. It:

1. **Updates `app.json`** - The main Expo app configuration
   - Sets app name
   - Sets iOS bundle identifier
   - Sets Android package name
   - Preserves slug (never changes)

2. **Creates `app/config.json`** - Embedded client configuration
   - Stores client ID
   - Stores app name
   - Stores bundle IDs
   - Used by the app at runtime

3. **Updates `eas.json`** - Expo Application Services configuration
   - Sets Apple Team ID for iOS submissions
   - Sets EAS Project ID for builds
   - Configures production build profile

4. **Updates `android/gradle.properties`** - Android build configuration
   - Sets memory limits for compilation
   - Ensures Kotlin compilation doesn't run out of memory

### Usage

#### Automatic (via GitHub Actions)
```bash
# Triggered automatically when you build from web configurator
# GitHub Actions passes these environment variables:
APP_NAME=Tayyar24\ Laundry
IOS_BUNDLE_ID=com.laundry.tayyar24
ANDROID_PACKAGE=com.laundry.tayyar24
CLIENT_ID=4565
APPLE_TEAM_ID=2H9MCN975Q
EAS_PROJECT_ID=952733e3-51a5-40b4-8554-eaac3a5a6390
```

#### Manual (for testing locally)
```bash
# Set environment variables
export APP_NAME="Tayyar24 Laundry"
export IOS_BUNDLE_ID="com.laundry.tayyar24"
export ANDROID_PACKAGE="com.laundry.tayyar24"
export CLIENT_ID="4565"
export APPLE_TEAM_ID="2H9MCN975Q"
export EAS_PROJECT_ID="952733e3-51a5-40b4-8554-eaac3a5a6390"

# Run the script
node scripts/configure-white-label.js
```

### Required Environment Variables

All of these must be provided:

| Variable | Example | Description |
|----------|---------|-------------|
| `APP_NAME` | `Tayyar24 Laundry` | Display name for the app |
| `IOS_BUNDLE_ID` | `com.laundry.tayyar24` | Unique identifier for iOS app |
| `ANDROID_PACKAGE` | `com.laundry.tayyar24` | Unique identifier for Android app |
| `CLIENT_ID` | `4565` | Your organization/client ID |
| `APPLE_TEAM_ID` | `2H9MCN975Q` | Apple Developer Team ID |
| `EAS_PROJECT_ID` | `952733e3-...` | Expo project ID for this app |

### Output Files Modified

**1. app.json**
```json
{
  "expo": {
    "name": "Tayyar24 Laundry",  // UPDATED
    "slug": "dummy-whitelabel-base",  // NOT CHANGED
    "ios": {
      "bundleIdentifier": "com.laundry.tayyar24"  // UPDATED
    },
    "android": {
      "package": "com.laundry.tayyar24"  // UPDATED
    },
    "extra": {
      "eas": {
        "projectId": "952733e3-51a5-40b4-8554-eaac3a5a6390"  // UPDATED
      }
    }
  }
}
```

**2. app/config.json** (created)
```json
{
  "clientId": "4565",
  "appName": "Tayyar24 Laundry",
  "iosBundle": "com.laundry.tayyar24",
  "androidPackage": "com.laundry.tayyar24"
}
```

**3. eas.json**
```json
{
  "build": {
    "production": {
      "ios": {
        "credentialsSource": "remote"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleTeamId": "2H9MCN975Q"
      }
    }
  }
}
```

### Error Handling

The script checks for:
- ✓ APP_NAME provided
- ✓ CLIENT_ID provided
- ✓ Valid JSON in app.json
- ✓ Valid JSON in eas.json

If any required variable is missing:
```
❌ Missing required env var: APP_NAME
```

### Key Features

| Feature | Benefit |
|---------|---------|
| **Idempotent** | Can run multiple times safely |
| **Error Checking** | Validates required variables |
| **File Preservation** | Only updates needed fields |
| **Slug Protection** | Never changes `slug` field |
| **Config Generation** | Creates app/config.json automatically |

### Integration Points

**Called by:**
- `.github/workflows/build-ios-testflight.yml` - iOS builds
- `.github/workflows/build-android-apk.yml` - Android builds
- `.github/workflows/build-ios-android-both.yml` - Parallel builds

**Consumes:**
- Environment variables from GitHub Actions
- Command line arguments (optional)

**Produces:**
- Modified app.json
- Created app/config.json
- Modified eas.json

### How It's Used in GitHub Actions

**Example from build-ios-testflight.yml:**
```yaml
- name: Configure white-label app
  run: node scripts/configure-white-label.js
  env:
    APP_NAME: ${{ github.event.inputs.appName }}
    IOS_BUNDLE_ID: ${{ github.event.inputs.bundleId }}
    ANDROID_PACKAGE: ${{ github.event.inputs.androidPackage }}
    CLIENT_ID: ${{ github.event.inputs.clientId }}
    APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
    EAS_PROJECT_ID: ${{ github.event.inputs.easProjectId }}
```

The workflow receives `inputs` from the web configurator and passes them as environment variables to this script.

### Code Walkthrough

**Part 1: Get Environment Variables**
```javascript
const APP_NAME = process.env.APP_NAME;
const IOS_BUNDLE_ID = process.env.IOS_BUNDLE_ID;
const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE;
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
```

**Part 2: Validate Required Variables**
```javascript
if (!APP_NAME) {
  console.error('❌ Missing required env var: APP_NAME');
  process.exit(1);
}
```

**Part 3: Read Current Files**
```javascript
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
const easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
```

**Part 4: Update Files**
```javascript
appJson.expo.name = APP_NAME;
appJson.expo.ios.bundleIdentifier = IOS_BUNDLE_ID;
appJson.expo.android.package = ANDROID_PACKAGE;
// ... etc
```

**Part 5: Write Files**
```javascript
fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
fs.writeFileSync('app/config.json', JSON.stringify(clientConfig, null, 2));
fs.writeFileSync('eas.json', JSON.stringify(easJson, null, 2));
```

### Troubleshooting

**Problem: Script fails with "Missing required env var"**

**Solution:** Check that all environment variables are exported:
```bash
export APP_NAME="My App"
export IOS_BUNDLE_ID="com.example.app"
# ... all other variables
```

**Problem: app.json becomes invalid JSON**

**Solution:** This shouldn't happen, but if it does:
1. Restore from git: `git checkout app.json`
2. Rerun the script with correct variables

**Problem: app/config.json not created**

**Solution:** Ensure the `app/` directory exists:
```bash
mkdir -p app
node scripts/configure-white-label.js
```

### When Is This Script Called?

1. ✅ **GitHub Actions** - Automatically when you build via web configurator
2. ✅ **Manual testing** - When testing locally
3. ❌ **Development** - Not needed for regular development

### What NOT to Do

- ❌ Don't hardcode values in the script
- ❌ Don't commit configured app.json (it changes per build)
- ❌ Don't manually edit app.json if you're using GitHub Actions
- ❌ Don't change the slug value manually

### Best Practices

1. **Always use GitHub Actions** for production builds
2. **Let the script handle configuration** - don't edit files manually
3. **Keep environment variables in GitHub Secrets** - don't expose tokens
4. **Test locally with dummy values** before running on GitHub

### Extension Ideas

You could extend this script to:
- Generate app icons from a template
- Create app screenshots automatically
- Build and sign certificates
- Generate app store descriptions
- Update version numbers automatically

---

## 2. reset-project.js

### Purpose
One-time utility to reset the Expo project to a blank state. This comes with the Expo template.

### What It Does

Resets the project structure:
1. Backs up existing code to `app-example/`
2. Creates a blank `app/` directory
3. Generates minimal `app/_layout.tsx` and `app/index.tsx`

### Usage

```bash
npm run reset-project
```

### When to Use

- ❌ **Don't use in this project** - You already have a configured app
- ✅ Only use if you want to completely reset to blank Expo app

### Output

Creates:
```
app/
├── _layout.tsx
└── index.tsx
```

Backs up to:
```
app-example/
├── components/
├── constants/
├── hooks/
└── (your previous code)
```

### Notes

- Can be safely deleted from the project if never needed
- Part of the standard Expo template
- Interactive - asks for confirmation before running

---

## Summary Table

| Script | Used By | Purpose | Keep? |
|--------|---------|---------|-------|
| `configure-white-label.js` | GitHub Actions | Dynamic app configuration | ✅ YES |
| `reset-project.js` | Developer | Reset to blank template | ⚠️ OPTIONAL |

---

## Using Scripts in Development

### For Local Testing

To test the white-label configuration locally:

```bash
# Set test variables
export APP_NAME="Test App"
export IOS_BUNDLE_ID="com.test.app"
export ANDROID_PACKAGE="com.test.app"
export CLIENT_ID="9999"
export APPLE_TEAM_ID="2H9MCN975Q"
export EAS_PROJECT_ID="test-project-id"

# Run the configuration script
node scripts/configure-white-label.js

# Build the app with the configured values
npm install
eas build --platform ios --profile production
```

### For CI/CD Integration

Scripts are automatically called by GitHub Actions workflows. The workflows pass environment variables that get consumed by the scripts.

---

## FAQ

### Q: Can I modify the script?

**A:** Yes, but be careful. The script is critical to the white-label system. Changes should be:
- Well-tested
- Documented
- Version-controlled

### Q: What if I want to add a new configuration option?

**A:** 

1. **Update the script** to accept the new env variable:
   ```javascript
   const MY_OPTION = process.env.MY_OPTION;
   ```

2. **Update the output files** to include it:
   ```javascript
   clientConfig.myOption = MY_OPTION;
   ```

3. **Update the GitHub Actions workflow** to pass it:
   ```yaml
   env:
     MY_OPTION: ${{ github.event.inputs.myOption }}
   ```

4. **Update the web form** to collect it:
   ```javascript
   inputs.myOption = formValue;
   ```

### Q: Can I run the script without environment variables?

**A:** No. All required variables must be provided. The script will error if any are missing.

### Q: Is the script safe to run multiple times?

**A:** Yes! The script is idempotent. Running it 10 times with the same inputs produces the same output.

### Q: What happens if the script fails?

**A:** 
- app.json might be partially updated
- Run `git checkout app.json` to restore
- Fix the error and rerun

### Q: Can I use the script outside of GitHub Actions?

**A:** Yes! You can run it locally:
```bash
export APP_NAME="My App"
# ... set all env vars
node scripts/configure-white-label.js
```

---

## Related Documentation

- [WHITE_LABEL_AUTOMATION_GUIDE.md](./WHITE_LABEL_AUTOMATION_GUIDE.md) - Complete system guide
- [.github/workflows/](./github/workflows/) - GitHub Actions workflows
- [CLAUDE.md](./CLAUDE.md) - Project instructions

---

**Last Updated:** April 10, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
