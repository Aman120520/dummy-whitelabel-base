# White-Label App Automation System - Complete Guide

## 📖 Table of Contents
1. [What is This System?](#what-is-this-system)
2. [How It Works (Step-by-Step)](#how-it-works-step-by-step)
3. [For Non-Technical Users](#for-non-technical-users)
4. [For Developers](#for-developers)
5. [Limitations & Constraints](#limitations--constraints)
6. [Pros & Cons](#pros--cons)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## What is This System?

### The Big Picture
This is a **white-label app automation engine**. Imagine you have a single app codebase, but you want to create 50+ completely different apps for different clients (each with their own name, colors, bundle ID, and branding) **without writing any code**.

**Example:**
- You have one app called "dummy-whitelabel-base"
- Client A wants "Tayyar24 Laundry" (blue theme, com.laundry.tayyar24)
- Client B wants "QuickDry Cleaning" (green theme, com.quickdry.cleaning)
- Client C wants "Wash Pro" (orange theme, com.washpro.app)

All three are built from the **same code**, but they look completely different. That's what this system does.

### What Makes It "Automated"?
You don't need to:
- ❌ Manually edit code files
- ❌ Manually run build commands
- ❌ Manually configure bundle IDs and package names
- ❌ Manually submit to TestFlight or Play Store

Instead, you just:
- ✅ Fill out a web form with app details
- ✅ Click "Build"
- ✅ Get your APK/AAB/iOS app automatically

---

## How It Works (Step-by-Step)

### The Complete Flow

```
┌─────────────────────────────────────────────────────────┐
│  YOU: Open Web Configurator (localhost:3000)            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Fill Out the Form                              │
│  - App Name: "Tayyar24 Laundry"                         │
│  - iOS Bundle ID: "com.laundry.tayyar24"                │
│  - Android Package: "com.laundry.tayyar24"              │
│  - Client ID: "4565"                                    │
│  - EAS Project ID: "952733e3-51a5-40b4-..."             │
│  - Choose Build Type: TestFlight, APK, or Both          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Click "Build" Button                           │
│  System validates your inputs and sends to GitHub       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 3: GitHub Actions Triggers                        │
│  Correct workflow is selected based on your choice:     │
│  - TestFlight → build-ios-testflight.yml                │
│  - APK → build-android-apk.yml                          │
│  - Both → build-ios-android-both.yml                    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 4: Configuration Script Runs                      │
│  File: scripts/configure-white-label.js                 │
│                                                         │
│  Does:                                                  │
│  ✓ Updates app.json with app name                       │
│  ✓ Updates app.json with iOS bundle ID                  │
│  ✓ Updates app.json with Android package name           │
│  ✓ Creates app/config.json with client ID               │
│  ✓ Updates eas.json with EAS project ID                 │
│  ✓ Updates eas.json with Apple Team ID                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 5: App Builds                                     │
│                                                         │
│  iOS Build (if selected):                               │
│  - EAS builds native iOS app                            │
│  - Uses embedded client ID to identify the app          │
│  - Auto-submits to TestFlight (if configured)           │
│  - Takes 15-20 minutes                                  │
│                                                         │
│  Android Build (if selected):                           │
│  - Gradle assembles APK                                 │
│  - Gradle bundles AAB                                   │
│  - Takes 10-15 minutes                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 6: Results Available                              │
│                                                         │
│  iOS:                                                   │
│  - Live on TestFlight (testers can install)             │
│  - Ready for App Store submission                       │
│                                                         │
│  Android:                                               │
│  - APK available in GitHub Actions Artifacts            │
│  - AAB available in GitHub Actions Artifacts            │
│  - Ready for distribution or Google Play                │
└─────────────────────────────────────────────────────────┘
```

### What Happens Behind the Scenes

#### 1. Web Configurator (localhost:3000)
**File:** `web-configrator/web.js`

**What it does:**
- Provides a beautiful UI form for you to enter app details
- Validates your inputs (checks that bundle IDs are valid format)
- Sends your data to GitHub Actions via API call
- Shows you build logs in real-time

**What you enter:**
```
App Name:          "Tayyar24 Laundry"
iOS Bundle ID:     "com.laundry.tayyar24"
Android Package:   "com.laundry.tayyar24"
Client ID:         "4565"
EAS Project ID:    "952733e3-51a5-40b4-8554-eaac3a5a6390"
GitHub PAT:        Your personal access token
Build Type:        TestFlight / APK / Both
```

#### 2. Configuration Script (configure-white-label.js)
**File:** `scripts/configure-white-label.js`

**What it does:**
1. **Updates `app.json`** - The main app configuration file:
   ```json
   {
     "expo": {
       "name": "Tayyar24 Laundry",  // Your app name
       "slug": "dummy-whitelabel-base",  // NEVER CHANGES
       "ios": {
         "bundleIdentifier": "com.laundry.tayyar24"  // Your iOS ID
       },
       "android": {
         "package": "com.laundry.tayyar24"  // Your Android package
       }
     }
   }
   ```

2. **Creates `app/config.json`** - Embedded client configuration:
   ```json
   {
     "clientId": "4565",
     "appName": "Tayyar24 Laundry",
     "iosBundle": "com.laundry.tayyar24",
     "androidPackage": "com.laundry.tayyar24"
   }
   ```

3. **Updates `eas.json`** - EAS (Expo Application Services) configuration:
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

#### 3. GitHub Actions Workflows
**Files:** 
- `.github/workflows/build-ios-testflight.yml`
- `.github/workflows/build-android-apk.yml`
- `.github/workflows/build-ios-android-both.yml`

**What they do:**

**iOS TestFlight Workflow:**
```
1. Checkout code from GitHub
2. Setup Node.js environment
3. Install dependencies (npm install)
4. Run configure-white-label.js script
5. EAS build --platform ios --profile production
6. EAS submit to TestFlight
7. Done! App is on TestFlight
```

**Android APK Workflow:**
```
1. Checkout code from GitHub
2. Setup Java/Android environment
3. Install dependencies (npm install)
4. Run configure-white-label.js script
5. ./gradlew assembleRelease (build APK)
6. ./gradlew bundleRelease (build AAB)
7. Upload both as artifacts
8. Done! Download from GitHub Actions
```

#### 4. App Runtime Configuration
**File:** `app/(tabs)/index.tsx`

**What happens when the app runs:**
1. App starts and reads `app/config.json` to get the client ID
2. App makes API request: `GET https://configs.quickdrycleaning.com/api/configuration/{clientId}`
3. API returns the client's custom configuration:
   ```json
   {
     "appName": "Tayyar24 Laundry",
     "primaryColor": "#202f66",
     "secondaryColor": "#f0f4f8",
     "logoUrl": "https://...",
     ...
   }
   ```
4. App displays all custom branding (colors, logo, name, etc.)
5. If API fails, app falls back to default theme

---

## For Non-Technical Users

### Quick Start (5 minutes)

**1. Open Web Configurator:**
```
Go to: http://localhost:3000
```

**2. Fill Out the Form:**
- **App Name:** What you want the app called (e.g., "Tayyar24 Laundry")
- **iOS Bundle ID:** Unique identifier for Apple (e.g., "com.laundry.tayyar24")
- **Android Package ID:** Unique identifier for Google (e.g., "com.laundry.tayyar24")
- **Client ID:** Your company's ID (e.g., "4565")
- **EAS Project ID:** Your Expo project ID (ask your dev team)
- **GitHub PAT:** Your GitHub token (ask your dev team)

**3. Choose Build Type:**
- 📱 **TestFlight** - iOS only, sends to Apple's test platform
- 🤖 **APK** - Android only, generates downloadable files
- ⚡ **Both** - iOS and Android at the same time

**4. Click Build:**
System automatically:
- Configures everything
- Builds your app
- Submits to TestFlight (iOS) or generates APK/AAB (Android)

**5. Check Results:**
- **iOS:** Go to TestFlight app on your iPhone to test
- **Android:** Download from GitHub Actions artifacts

### Common Questions (Non-Technical)

**Q: How long does it take?**
A: 
- iOS: 15-20 minutes
- Android: 10-15 minutes
- Both together: 20 minutes (they run in parallel)

**Q: Can I change colors and logos?**
A: Yes! But NOT through this web form. Colors/logos are stored in your API database. Contact your backend team to update those.

**Q: What if something fails?**
A: Check the "Build Terminal" section in the web form. It shows real-time logs. Common fixes:
- Invalid bundle ID format
- Wrong Client ID
- Missing GitHub PAT token

**Q: Can multiple people build at the same time?**
A: No. GitHub will queue builds, but each one takes time. Try to avoid building more than one app simultaneously.

**Q: How do I distribute the APK?**
A: Once you download the APK from GitHub:
- Email it to testers
- Upload to a private server
- Use Google Play's internal testing track (for AAB)

**Q: How do testers install the iOS app?**
A: Through TestFlight app on their iPhone. They need an Apple ID and the link you send them.

---

## For Developers

### Architecture Overview

**Technology Stack:**
- **Frontend:** React (Web Configurator)
- **Mobile:** React Native + Expo
- **Build System:** EAS CLI (iOS), Gradle (Android)
- **CI/CD:** GitHub Actions
- **Configuration:** JSON files
- **Theme API:** Custom REST API

### Key Files and Their Roles

```
project-root/
├── web-configrator/
│   ├── web.js                    # React component (UI form)
│   ├── app.js                    # Entry point
│   ├── webpack.config.js         # Bundler config
│   └── package.json              # Dependencies
│
├── scripts/
│   └── configure-white-label.js  # Configuration script
│
├── app/
│   ├── config.json               # Embedded client config (generated)
│   ├── _layout.tsx               # Root layout
│   └── (tabs)/index.tsx          # Home screen (fetches API config)
│
├── .github/workflows/
│   ├── build-ios-testflight.yml  # iOS build workflow
│   ├── build-android-apk.yml     # Android build workflow
│   └── build-ios-android-both.yml # Parallel build workflow
│
├── app.json                      # Expo app config (updated by script)
├── eas.json                      # EAS build config (updated by script)
└── android/gradle.properties     # Android build props
```

### How to Extend This System

#### 1. Add More Configuration Options
**File:** `web-configrator/web.js`

Currently supports:
- App Name
- iOS Bundle ID
- Android Package
- Client ID
- EAS Project ID

To add a new field (e.g., "App Version"):
```javascript
// In web.js, add to state:
const [pipeline, setPipeline] = useState({
  // ... existing fields
  appVersion: '1.0.0',  // NEW
});

// Add input field in form:
<input
  value={pipeline.appVersion}
  onChange={(e) => setPipeline({ ...pipeline, appVersion: e.target.value })}
/>

// Pass to workflow:
const inputs = {
  // ... existing inputs
  appVersion: pipeline.appVersion,  // NEW
};
```

Then update the workflow YAML to receive it.

#### 2. Add More Workflow Steps
**File:** `.github/workflows/build-ios-testflight.yml`

Example: Add automatic Play Store submission for Android:
```yaml
- name: Submit to Google Play
  run: |
    bundletool upload-bundle \
      --bundle=app.aab \
      --release-notes=en-US="New build"
```

#### 3. Add Email Notifications
After build completes:
```yaml
- name: Send Email Notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USER }}
    password: ${{ secrets.EMAIL_PASS }}
    to: client@example.com
    subject: "App build complete: ${{ github.event.inputs.appName }}"
    body: "Your app is ready for testing"
```

#### 4. Custom Configuration Values
To pass custom values to the app at build time:

**In configure-white-label.js:**
```javascript
const clientConfig = {
  clientId: CLIENT_ID,
  appName: APP_NAME,
  iosBundle: IOS_BUNDLE_ID,
  androidPackage: ANDROID_PACKAGE,
  customField: process.env.CUSTOM_VALUE,  // NEW
};
```

**In app code:**
```javascript
import config from '@/config.json';
console.log(config.customField);
```

### Environment Variables

**Required in GitHub Secrets:**
- `APPLE_TEAM_ID` - Your Apple Developer Team ID
- `EAS_TOKEN` - Expo API token for builds (if needed)

**Optional:**
- `SLACK_WEBHOOK` - For build notifications
- `EMAIL_SERVICE_KEY` - For email notifications

### API Integration

The app fetches configuration from an API. Currently configured for:
```
https://configs.quickdrycleaning.com/api/configuration/{clientId}
```

**Expected API Response:**
```json
{
  "appName": "Tayyar24 Laundry",
  "primaryColor": "#202f66",
  "secondaryColor": "#f0f4f8",
  "textColor": "#0f172a",
  "logoUrl": "https://...",
  "assets": {
    "logoUrl": "https://..."
  }
}
```

To use a different API:
**File:** `app/(tabs)/index.tsx`
```javascript
const apiUrl = `https://your-api.com/config/${organizationId}`;
```

---

## Limitations & Constraints

### 1. **Slug Never Changes**
- The `slug` field in `app.json` always stays as `"dummy-whitelabel-base"`
- This is intentional - it's the internal identifier
- Bundle ID and Package name are what differ between apps

### 2. **One Build at a Time**
- GitHub free tier limits concurrent builds
- You can't build 50 apps simultaneously
- Builds get queued and run sequentially

### 3. **iOS Requires EAS Credentials**
- Each app needs its own EAS project
- Credentials must be validated locally first:
  ```bash
  eas credentials --platform ios
  ```
- Can't build iOS without setting this up

### 4. **Android Requires Keystore**
- Must be configured in `android/keystore.properties`
- Same keystore can be used for all apps
- If lost, can't update existing apps on Play Store

### 5. **API Configuration Not Automated**
- Colors, logos, theme changes are NOT set by the web form
- Those must be configured in your backend API database
- App fetches those at runtime

### 6. **Memory Constraints**
- GitHub Actions has limited memory
- Large apps may fail Kotlin compilation
- Mitigated with: `-Xmx4096m -XX:MaxMetaspaceSize=1024m`

### 7. **No Rollback**
- Once built and submitted, can't easily undo
- New build creates new version
- Must have versioning strategy

### 8. **Bundle ID Changes are Permanent**
- Can't change bundle ID after submitting to App Store
- iOS treats different bundle IDs as different apps
- Must plan bundle IDs carefully

### 9. **Web Configurator Runs Locally**
- Must be accessed from `localhost:3000`
- Can't use from remote servers (yet)
- Could be deployed but requires infrastructure

### 10. **No Built-in Analytics**
- System doesn't track who built what when
- Could add GitHub commit message logging
- Would need database to track builds

---

## Pros & Cons

### ✅ Pros

| Benefit | Why It Matters |
|---------|----------------|
| **Single Codebase** | Update once, all 50 apps get updates |
| **No Code Changes** | Anyone can build apps without programming |
| **Fully Automated** | No manual configuration, no human error |
| **Fast Deployment** | 15-20 mins from form to TestFlight |
| **Consistent Quality** | All apps built from same tested code |
| **Cost Effective** | One codebase = one team maintains |
| **Easy Scaling** | Add 100 clients without code changes |
| **Version Control** | All changes tracked in GitHub |
| **Reproducible** | Same inputs always produce same app |
| **No DevOps Needed** | Uses GitHub Actions (free tier available) |

### ❌ Cons

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| **Local Web Form** | Must run from your machine | Deploy to cloud server |
| **One Build at a Time** | Can't build 50 apps simultaneously | Use scheduled builds / queue system |
| **API Dependency** | If API is down, app shows fallback | Embed all config at build time |
| **Manual API Updates** | Branding changes need backend edit | Build admin panel for API updates |
| **GitHub Rate Limits** | Limited concurrent builds | Use self-hosted runners |
| **EAS Project per App** | Each iOS app needs separate EAS project | Automate EAS project creation |
| **No Automatic Versioning** | Must manually set version numbers | Add auto-versioning script |
| **Limited Debugging** | Hard to debug from web form | Add detailed logs to GitHub Actions |
| **No Rollback** | Can't undo bad builds | Implement version tagging system |
| **Storage Growth** | Each app adds to GitHub artifacts | Clean up old builds regularly |

---

## Troubleshooting

### Problem: "Invalid iOS Bundle ID format"

**Error:** `Invalid iOS Bundle ID! Format should be reverse-DNS`

**Cause:** Bundle ID doesn't follow Apple's format (e.g., "com.company.appname")

**Fix:** 
- Use format: `com.` + company + `.` + appname
- Example: `com.laundry.tayyar24` ✅
- Wrong: `laundry_tayyar24` ❌

### Problem: "GitHub PAT token is invalid"

**Error:** `Error 401: Unauthorized`

**Cause:** GitHub Personal Access Token expired or revoked

**Fix:**
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Create new token with `workflow` scope
3. Copy token and paste in web form
4. Make sure token hasn't expired

### Problem: "EAS build failed: Metaspace OutOfMemory"

**Error:** `java.lang.OutOfMemoryError: Metaspace`

**Cause:** GitHub Actions runner ran out of memory during Android compilation

**Fix:** Already configured in workflows with `-XX:MaxMetaspaceSize=1024m`

If still failing:
- Reduce number of architectures in `android/gradle.properties`:
  ```
  reactNativeArchitectures=arm64-v8a
  ```

### Problem: "TestFlight submission failed"

**Error:** `Failed to submit to TestFlight`

**Cause:** EAS credentials not validated or Apple Team ID wrong

**Fix:**
1. Run locally: `eas credentials --platform ios`
2. Validate credentials on EAS servers
3. Check Apple Team ID in `eas.json`

### Problem: "App name not updated in APK"

**Error:** Built APK still shows old app name

**Cause:** App reads name from API at runtime, not from `app.json`

**Fix:**
1. Ensure Client ID is correct
2. Update your API database with correct app name
3. App fetches from API when it starts, so restart app to see changes

### Problem: "Build terminal shows no logs"

**Error:** Web form build logs are empty

**Cause:** GitHub Actions workflow still running

**Fix:**
1. Check GitHub Actions dashboard directly
2. Workflow logs are more detailed there
3. Wait for build to complete

### Problem: "APK/AAB not appearing in artifacts"

**Error:** Can't download from GitHub Actions

**Cause:** Build failed and artifacts weren't created

**Fix:**
1. Check build logs for errors
2. Common: Gradle build failed
3. Try building with fewer architectures
4. Check Android/Gradle configuration

### Problem: "Web form not loading at localhost:3000"

**Error:** "Cannot GET /"

**Cause:** Webpack dev server not running properly

**Fix:**
```bash
cd web-configrator
npm install  # Reinstall dependencies
npm start    # Start dev server
```

### Problem: "Port 3000 already in use"

**Error:** `Port 3000 is already in use`

**Fix:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
npm start -- --port 3001
```

---

## FAQ

### Q: Can I build apps for clients I don't have API credentials for?

**A:** No. You need:
1. Access to Apple Developer Account (for iOS)
2. Access to Google Play Developer Account (for Android)
3. EAS Project ID (for iOS through Expo)
4. GitHub personal access token

You can't create a client's app without these.

---

### Q: What if I want to change the app colors for one client?

**A:** Colors are stored in your API database, not in this system. To change:
1. Update your API database with new colors
2. App fetches these at runtime
3. Restart the app to see changes
4. **Don't need to rebuild the app** - it's just a configuration change

---

### Q: Can I use this for 100 clients?

**A:** Yes, technically. But:
- You'd need 100 EAS projects (for iOS)
- Each build takes 15-20 minutes
- Building all 100 would take 25+ hours
- Better approach: Use separate runners or scheduled builds

---

### Q: What if the API is down when the app starts?

**A:** The app has a fallback mechanism:
```javascript
// If API request fails:
setTheme({
  appName: "App Name (Fallback)",
  primaryColor: "#202f66",
  secondaryColor: "#f0f4f8",
  // ... other defaults
});
```

Users can still use the app with default branding.

---

### Q: Can I customize the web form?

**A:** Yes. Edit `web-configrator/web.js`:
- Change input fields
- Add new configuration options
- Change colors and styling
- Add validation rules

All changes show up instantly when you `npm start`.

---

### Q: How do I add a new step to the build process?

**A:** Edit the GitHub Actions workflow:

**File:** `.github/workflows/build-ios-testflight.yml`

Example: Add a step to send Slack notification:
```yaml
- name: Send Slack Notification
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "App build complete: ${{ github.event.inputs.appName }}"
      }
```

---

### Q: Can I test the app locally before building?

**A:** Yes!

```bash
# Install dependencies
npm install

# Test iOS
npx expo start --ios

# Test Android
npx expo start --android

# Test Web
npx expo start --web
```

This runs the app with default configuration. To test with your custom values, manually edit `app/config.json`.

---

### Q: What happens to old builds?

**A:** 
- **GitHub Actions Artifacts** - Keep for 90 days by default
- **TestFlight** - Can keep multiple versions
- **App Store** - Keep all versions in history

To clean up old artifacts, you can configure retention in GitHub Actions settings.

---

### Q: Can multiple people use the web form at the same time?

**A:** The web form works locally on your machine. Multiple people would need:
- Option 1: Each run it on their own computer
- Option 2: Deploy web form to a server and share the URL

Currently, it's a local-only tool.

---

### Q: What if I need to add a new EAS project?

**A:** 
1. Create new EAS project: `eas project:create`
2. Get the project ID
3. In web form, enter the new EAS Project ID
4. System automatically uses it for that build

---

### Q: Can I use custom branding per app?

**A:** Yes, there are two ways:

**Option 1: API (Current - Recommended)**
- Store colors, logos in your API database
- Apps fetch at runtime
- No rebuild needed for branding changes

**Option 2: Build-time**
- Pass branding to configure-white-label.js
- Embed in app
- Requires rebuild for branding changes

---

### Q: Is there a way to schedule builds?

**A:** Not built-in, but you can add GitHub Actions scheduling:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
```

This would automatically build at scheduled time.

---

### Q: What if I need to build a specific app multiple times?

**A:** Just fill the form again and click Build. You can:
- Build the same app 10 times if needed
- Each creates a new version
- Old versions stay in TestFlight/Play Store

---

### Q: Can I automate the web form itself?

**A:** Yes, the web form sends HTTP requests. You could:
1. Create a script that calls the GitHub Actions API directly
2. Bypass the web form entirely
3. Build apps programmatically

```javascript
const response = await fetch(
  `https://api.github.com/repos/owner/repo/actions/workflows/build-ios-testflight.yml/dispatches`,
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        appName: 'MyApp',
        bundleId: 'com.example.myapp',
        // ... other inputs
      }
    })
  }
);
```

---

## Next Steps

1. **Configure Your First App:**
   - Go to `localhost:3000`
   - Fill out the form
   - Click Build

2. **Monitor the Build:**
   - Watch logs in web form
   - Or check GitHub Actions dashboard
   - Takes 15-20 minutes

3. **Get Your App:**
   - iOS: Check TestFlight app
   - Android: Download from GitHub Actions Artifacts

4. **Update Your API:**
   - Set correct colors, logos, branding
   - App will fetch on next start

5. **Distribute to Clients:**
   - iOS: Send TestFlight link
   - Android: Email APK or upload to Play Store

---

## Support & Help

**For Questions:**
- Check this guide first (FAQ section)
- Review the troubleshooting section
- Check GitHub Actions logs for detailed errors

**For Errors:**
- Read build logs carefully
- Check GitHub Actions dashboard
- Common issues are in Troubleshooting section

---

**Last Updated:** April 10, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
