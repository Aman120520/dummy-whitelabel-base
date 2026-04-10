# GitHub Actions Workflows Documentation

Complete guide to all CI/CD workflows for the white-label app automation system.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Workflow Summary](#workflow-summary)
3. [Build iOS - TestFlight](#build-ios---testflight)
4. [Build Android - APK](#build-android---apk)
5. [Build iOS & Android - Both](#build-ios--android---both)
6. [How to Trigger Workflows](#how-to-trigger-workflows)
7. [Monitoring & Debugging](#monitoring--debugging)
8. [Secrets & Environment Variables](#secrets--environment-variables)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Overview

### What Are GitHub Actions Workflows?

GitHub Actions are automated tasks that run in response to events. In this project:

- **Event:** You click "Build" in the web configurator
- **Trigger:** GitHub Actions API receives the request
- **Workflow:** Automated steps execute on GitHub's servers
- **Result:** App is built and submitted to TestFlight or generated as APK/AAB

### Why Use GitHub Actions?

| Benefit | Why |
|---------|-----|
| **No Local Setup** | Don't need iOS/Android dev environment locally |
| **Always Available** | Runs 24/7 on GitHub's servers |
| **Version Controlled** | Workflow config is in git repository |
| **Scalable** | Handle unlimited builds (within rate limits) |
| **Free Tier** | Includes generous free build minutes |
| **Secure** | Secrets stored encrypted in GitHub |

### Workflow Files Location

```
.github/workflows/
├── build-ios-testflight.yml      ← iOS builds to TestFlight
├── build-android-apk.yml          ← Android builds (APK + AAB)
└── build-ios-android-both.yml     ← Parallel iOS + Android
```

---

## Workflow Summary

### Three Available Workflows

| Workflow | Platform | Output | Time | Trigger |
|----------|----------|--------|------|---------|
| **Build iOS - TestFlight** | iOS only | Submitted to TestFlight | 15-20 min | `build_ios_testflight` |
| **Build Android - APK** | Android only | APK + AAB artifacts | 10-15 min | `build_android_apk` |
| **Build iOS & Android - Both** | Both | TestFlight + artifacts | 20 min (parallel) | `build_ios_android_both` |

### Visual Flow

```
Web Configurator Form
         ↓
   [Select Build Type]
         ↓
    ┌────┴────┬─────────┐
    ↓         ↓         ↓
TestFlight  APK     Both
  (iOS)   (Android) (Parallel)
    ↓         ↓         ↓
GitHub Actions Triggered
    ↓         ↓         ↓
  EAS      Gradle   EAS + Gradle
   Build    Build     Build
    ↓         ↓         ↓
TestFlight  Artifacts Summary
```

---

## Build iOS - TestFlight

### Purpose
Builds iOS app and automatically submits to Apple's TestFlight for beta testing.

### File
`.github/workflows/build-ios-testflight.yml`

### When to Use
- ✅ Testing iOS app
- ✅ Distributing to beta testers
- ✅ Regular iOS releases
- ❌ Not for Android

### Inputs (What You Provide)

When triggered, the workflow accepts these inputs:

```yaml
appName:           # Display name for the app
                   # Example: "Tayyar24 Laundry"
                   # Required: YES

bundleId:          # iOS Bundle Identifier (reverse-DNS format)
                   # Example: "com.laundry.tayyar24"
                   # Format: com.company.appname
                   # Required: YES

clientId:          # Your organization/client ID
                   # Example: "4565"
                   # Required: YES

easProjectId:      # EAS project ID for this client
                   # Example: "952733e3-51a5-40b4-8554-eaac3a5a6390"
                   # Required: NO (but highly recommended)
```

### Step-by-Step Execution

#### 1️⃣ Checkout Code
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
**What happens:** Downloads your repository code to GitHub's server

**Time:** < 1 minute

---

#### 2️⃣ Setup Node.js
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```
**What happens:** 
- Installs Node.js v20 (needed to run JavaScript scripts)
- Caches npm packages for faster subsequent runs

**Time:** 1-2 minutes

---

#### 3️⃣ Setup EAS CLI
```yaml
- name: Setup EAS CLI
  uses: expo/expo-github-action@v8
  with:
    eas-version: latest
    token: ${{ secrets.EXPO_TOKEN }}
```
**What happens:**
- Installs EAS CLI (Expo Application Services)
- Authenticates with your EXPO_TOKEN from GitHub Secrets
- Ready to build iOS apps

**Time:** 1-2 minutes

---

#### 4️⃣ Install Dependencies
```yaml
- name: Install dependencies
  run: npm install
```
**What happens:**
- Downloads all npm packages listed in `package.json`
- Uses cached packages if available (faster)

**Time:** 1-3 minutes

---

#### 5️⃣ Configure White-Label App
```yaml
- name: Configure white-label app
  run: node scripts/configure-white-label.js
  env:
    APP_NAME: ${{ github.event.inputs.appName }}
    IOS_BUNDLE_ID: ${{ github.event.inputs.bundleId }}
    CLIENT_ID: ${{ github.event.inputs.clientId }}
    APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
    EAS_PROJECT_ID: ${{ github.event.inputs.easProjectId }}
```
**What happens:**
- Runs the `configure-white-label.js` script
- Updates `app.json` with your app name and bundle ID
- Creates `app/config.json` with client ID
- Updates `eas.json` with EAS project ID and Apple Team ID

**Time:** < 1 minute

---

#### 6️⃣ Verify EXPO Token
```yaml
- name: Verify EXPO Token
  run: eas whoami
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```
**What happens:**
- Tests that your EXPO_TOKEN is valid
- Shows which Expo account it's authenticated as
- Fails early if token is invalid

**Time:** < 1 minute

---

#### 7️⃣ Validate eas.json
```yaml
- name: Validate eas.json
  run: cat eas.json | jq '.'
```
**What happens:**
- Displays the current `eas.json` configuration
- Validates it's valid JSON
- Helps debug configuration issues

**Time:** < 1 minute

---

#### 8️⃣ Build iOS App with EAS
```yaml
- name: Build iOS app with EAS
  run: eas build --platform ios --profile production --wait
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```
**What happens:**
- EAS builds your iOS app
- Creates native Xcode project
- Compiles Swift/Objective-C code
- Generates signed iOS app (.ipa file)
- `--wait` flag: waits for build to complete before moving on
- `--profile production`: uses production configuration

**Time:** 10-15 minutes (the longest step!)

**Output:** Signed iOS app ready for TestFlight

---

#### 9️⃣ Submit to TestFlight
```yaml
- name: Submit to TestFlight
  run: eas submit --platform ios --profile production --latest
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```
**What happens:**
- Takes the built iOS app
- Submits to Apple TestFlight
- App appears for beta testers in ~15-20 minutes
- `--latest` flag: submits the most recent build

**Time:** 2-5 minutes

**Output:** App on TestFlight

---

#### 🔟 Success Message
```yaml
- name: Success
  if: success()
  run: |
    echo "✅ iOS Build and TestFlight submission successful!"
    # ... display app details and next steps
```
**What happens:**
- Only runs if all previous steps succeeded
- Shows app details
- Provides link to GitHub Actions run

**Time:** < 1 minute

---

### Total Time: 15-20 minutes

### Secrets Required
- `EXPO_TOKEN` - Expo API token for building
- `APPLE_TEAM_ID` - Apple Developer Team ID

### Success Criteria
✅ All steps complete successfully
✅ App appears in TestFlight within 15-20 minutes
✅ Build logs show no errors

---

## Build Android - APK

### Purpose
Builds Android app and generates both APK (direct install) and AAB (Play Store) files.

### File
`.github/workflows/build-android-apk.yml`

### When to Use
- ✅ Testing Android app
- ✅ Direct distribution to users
- ✅ Play Store submission (via AAB)
- ❌ Not for iOS

### Inputs

```yaml
appName:           # Display name
                   # Example: "Tayyar24 Laundry"
                   # Required: YES

androidPackage:    # Android Package ID (reverse-DNS format)
                   # Example: "com.laundry.tayyar24"
                   # Format: com.company.appname
                   # Required: YES

clientId:          # Your organization/client ID
                   # Example: "4565"
                   # Required: YES
```

### Step-by-Step Execution

#### 1️⃣ Checkout Code
Same as iOS workflow - downloads your code

**Time:** < 1 minute

---

#### 2️⃣ Setup Node.js
Same as iOS workflow - installs Node.js

**Time:** 1-2 minutes

---

#### 3️⃣ Setup Java
```yaml
- name: Setup Java
  uses: actions/setup-java@v4
  with:
    distribution: 'zulu'
    java-version: '17'
    cache: 'gradle'
```
**What happens:**
- Installs Java 17 (required for Android development)
- Uses Zulu distribution (free, open-source)
- Caches Gradle packages for faster builds

**Time:** 1-2 minutes

---

#### 4️⃣ Install Dependencies
Same as iOS - runs `npm install`

**Time:** 1-3 minutes

---

#### 5️⃣ Configure White-Label App
Same as iOS - runs configuration script

**Time:** < 1 minute

---

#### 6️⃣ Build Android APK & AAB
```yaml
- name: Build Android APK & AAB
  run: |
    cd android
    export NODE_OPTIONS="--max-old-space-size=4096"
    export _JAVA_OPTIONS="-Xmx4096m -XX:MaxMetaspaceSize=1024m"
    
    echo "Building APK..."
    ./gradlew assembleRelease -x lint --no-daemon
    
    echo "Building AAB..."
    ./gradlew bundleRelease -x lint --no-daemon
```

**What happens:**

**Part A: Set Memory Limits**
- Allocates 4GB RAM for Node.js
- Allocates 4GB heap + 1GB metaspace for Java/Gradle
- Prevents out-of-memory errors

**Part B: Build APK**
- `./gradlew assembleRelease` - Gradle builds Android app
- `-x lint` - Skip lint checks (time savings)
- `--no-daemon` - Don't use persistent daemon (cleaner)
- Output: `android/app/build/outputs/apk/release/*.apk`
- APK is the actual app file you can install

**Part C: Build AAB**
- `./gradlew bundleRelease` - Gradle bundles for Play Store
- Output: `android/app/build/outputs/bundle/release/*.aab`
- AAB is Google Play's distribution format

**Time:** 8-12 minutes (the longest step!)

---

#### 7️⃣ Upload APK Artifact
```yaml
- name: Upload APK Artifact
  uses: actions/upload-artifact@v4
  with:
    name: ${{ github.event.inputs.appName }}-apk
    path: android/app/build/outputs/apk/release/*.apk
    retention-days: 30
```

**What happens:**
- Takes the APK file
- Uploads to GitHub Actions Artifacts
- Stores for 30 days
- Accessible from GitHub Actions page

**Time:** 1-2 minutes

---

#### 8️⃣ Upload AAB Artifact
Same as APK upload - for the AAB file

**Time:** 1-2 minutes

---

#### 9️⃣ Success Message
Displays build information and download instructions

**Time:** < 1 minute

---

### Total Time: 10-15 minutes

### Secrets Required
- None (uses keystore from repository)

### Success Criteria
✅ All steps complete successfully
✅ APK artifact available for download
✅ AAB artifact available for download
✅ Build logs show no errors

### How to Download Artifacts
1. Go to GitHub repository
2. Click "Actions" tab
3. Find your build run
4. Scroll down to "Artifacts"
5. Download `{appName}-apk` or `{appName}-aab`

---

## Build iOS & Android - Both

### Purpose
Builds iOS and Android apps simultaneously (parallel), combining both workflows.

### File
`.github/workflows/build-ios-android-both.yml`

### When to Use
- ✅ Need both iOS and Android
- ✅ Want to save time (runs in parallel)
- ✅ Complete app release

### Inputs

Accepts all inputs from both iOS and Android workflows:

```yaml
appName:           # Display name
bundleId:          # iOS Bundle ID
androidPackage:    # Android Package ID
clientId:          # Organization ID
easProjectId:      # EAS Project ID (for iOS)
```

### Structure

This workflow has 3 jobs:

```
┌─────────────────────────────────────────────┐
│  build_ios (runs on macos-latest)          │
│  - Setup Node.js, EAS CLI                  │
│  - Configure app                           │
│  - Build iOS                               │
│  - Submit to TestFlight                    │
│  Time: 15-20 minutes                       │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────┴──────────────────────┐
│  build_android (runs on ubuntu-latest)     │
│  - Setup Node.js, Java                     │
│  - Configure app                           │
│  - Build APK & AAB                         │
│  Time: 10-15 minutes                       │
└──────────────────────┬──────────────────────┘
                       │
                (Both run in parallel)
                       │
┌──────────────────────┴──────────────────────┐
│  summary (runs after both)                 │
│  - Waits for iOS and Android to complete   │
│  - Shows combined results                  │
│  - Links to artifacts                      │
└──────────────────────────────────────────────┘
```

### Jobs Explanation

#### Job 1: build_ios
Identical to "Build iOS - TestFlight" workflow

Steps:
1. Checkout code
2. Setup Node.js
3. Setup EAS CLI
4. Install dependencies
5. Configure white-label app
6. Verify EXPO Token
7. Validate eas.json
8. Build iOS app
9. Submit to TestFlight
10. iOS Success message

**Runs on:** `macos-latest` (macOS machine)
**Time:** 15-20 minutes

---

#### Job 2: build_android
Identical to "Build Android - APK" workflow

Steps:
1. Checkout code
2. Setup Node.js
3. Setup Java
4. Install dependencies
5. Configure white-label app
6. Build Android APK & AAB
7. Upload APK artifact
8. Upload AAB artifact
9. Android Success message

**Runs on:** `ubuntu-latest` (Linux machine)
**Time:** 10-15 minutes

---

#### Job 3: summary
Combines results from both builds

```yaml
summary:
  if: always()
  needs: [build_ios, build_android]
  runs-on: ubuntu-latest
```

**What happens:**
- `if: always()` - Runs even if previous jobs failed
- `needs: [build_ios, build_android]` - Waits for both to finish
- Shows status of both builds
- Provides artifact download links
- Shows GitHub Actions run URL

**Runs on:** `ubuntu-latest`
**Time:** < 1 minute

**Output Example:**
```
==========================================
Build Complete - iOS & Android
==========================================

Client: 4565
App: Tayyar24 Laundry

📱 iOS Status: SUCCESS
   → Submitted to TestFlight
   → Check in 15-20 minutes

🤖 Android Status: SUCCESS
   → APK available in artifacts
   → Download and distribute
```

---

### Total Time: 20 minutes (parallel)
vs. 25-35 minutes (sequential)

### Parallel Execution Advantage

```
Sequential (iOS then Android):
|----iOS (15-20 min)----|----Android (10-15 min)----| = 25-35 min

Parallel (iOS and Android together):
|----iOS (15-20 min)    |
|----Android (10-15 min)----| = 20 minutes (fastest job decides)
```

You save 5-15 minutes by running both simultaneously!

---

## How to Trigger Workflows

### Option 1: Web Configurator (Recommended)

1. Go to `http://localhost:3000`
2. Fill out the form
3. Select build type (TestFlight, APK, or Both)
4. Click "Build" button
5. Web form triggers GitHub Actions automatically

**Advantages:**
- ✅ Easy UI
- ✅ Form validation
- ✅ Real-time logs
- ✅ No technical knowledge needed

---

### Option 2: GitHub Web Interface

1. Go to your GitHub repository
2. Click "Actions" tab
3. Select workflow:
   - "Build iOS - TestFlight"
   - "Build Android - APK"
   - "Build iOS & Android - Both"
4. Click "Run workflow"
5. Fill in inputs
6. Click "Run workflow" button

**Advantages:**
- ✅ Direct GitHub control
- ✅ No web form needed
- ✅ See workflow progress in real-time

---

### Option 3: GitHub CLI (Command Line)

```bash
# List available workflows
gh workflow list

# Trigger iOS build
gh workflow run build-ios-testflight.yml \
  -f appName="My App" \
  -f bundleId="com.example.app" \
  -f clientId="123" \
  -f easProjectId="abc-def-ghi"

# Trigger Android build
gh workflow run build-android-apk.yml \
  -f appName="My App" \
  -f androidPackage="com.example.app" \
  -f clientId="123"

# Trigger both builds
gh workflow run build-ios-android-both.yml \
  -f appName="My App" \
  -f bundleId="com.example.app" \
  -f androidPackage="com.example.app" \
  -f clientId="123" \
  -f easProjectId="abc-def-ghi"
```

**Advantages:**
- ✅ Automatable
- ✅ Scriptable
- ✅ CLI integration

---

### Option 4: GitHub API (Programmatic)

```bash
curl -X POST \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/build-ios-testflight.yml/dispatches \
  -H "Authorization: Bearer GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ref": "main",
    "inputs": {
      "appName": "My App",
      "bundleId": "com.example.app",
      "clientId": "123",
      "easProjectId": "abc-def-ghi"
    }
  }'
```

**Advantages:**
- ✅ Full programmatic control
- ✅ Integrate with other systems
- ✅ Automation-friendly

---

## Monitoring & Debugging

### View Workflow Logs

**Option 1: GitHub Web Interface**
1. Go to repository
2. Click "Actions" tab
3. Find your workflow run
4. Click to open
5. Expand each job step to see logs

**Option 2: GitHub CLI**
```bash
# List recent runs
gh run list

# Watch specific run
gh run view <RUN_ID> --log

# Get specific job log
gh run view <RUN_ID> --job <JOB_ID>
```

---

### Understanding Log Output

**Success Example:**
```
✅ iOS Build and TestFlight submission successful!

App Details:
  Name: Tayyar24 Laundry
  Bundle ID: com.laundry.tayyar24
  Client ID: 4565

📱 Check TestFlight in ~15-20 minutes
📊 View build: https://github.com/...
```

**Failure Example:**
```
❌ Error during build:
java.lang.OutOfMemoryError: Metaspace
```
(See troubleshooting section)

---

### Real-time Monitoring

**Option 1: Web Form**
The web configurator shows live logs as they happen

**Option 2: GitHub Actions Page**
- Go to Actions tab
- Click active workflow run
- Watch progress in real-time

**Option 3: CLI Watch**
```bash
gh run watch <RUN_ID>
```

---

## Secrets & Environment Variables

### Required GitHub Secrets

These must be added to your repository settings:

#### 1. EXPO_TOKEN
**What it is:** API token for Expo/EAS authentication
**Where to get it:**
```bash
eas login
eas secrets create
```
**How to add to GitHub:**
1. Go to Repository Settings
2. Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `EXPO_TOKEN`
5. Value: (paste your token)
6. Click "Add secret"

**Used by:** iOS workflows

---

#### 2. APPLE_TEAM_ID
**What it is:** Your Apple Developer Team ID
**Format:** `2H9MCN975Q` (10 characters)
**Where to get it:**
- Apple Developer Account → Membership
- Or check in Xcode: Preferences → Accounts

**How to add to GitHub:**
1. Go to Repository Settings
2. Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `APPLE_TEAM_ID`
5. Value: (paste your team ID)
6. Click "Add secret"

**Used by:** iOS workflows

---

### Environment Variables (in workflows)

These are set by the workflows automatically:

```yaml
APP_NAME: ${{ github.event.inputs.appName }}
IOS_BUNDLE_ID: ${{ github.event.inputs.bundleId }}
ANDROID_PACKAGE: ${{ github.event.inputs.androidPackage }}
CLIENT_ID: ${{ github.event.inputs.clientId }}
APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
EAS_PROJECT_ID: ${{ github.event.inputs.easProjectId }}
```

**What they do:**
- Passed to `configure-white-label.js` script
- Used to dynamically configure each build
- Different for each app being built

---

### Memory Environment Variables

```yaml
export NODE_OPTIONS="--max-old-space-size=4096"
export _JAVA_OPTIONS="-Xmx4096m -XX:MaxMetaspaceSize=1024m"
```

**What they do:**
- Allocate memory to prevent out-of-memory errors
- `NODE_OPTIONS`: 4GB for Node.js
- `_JAVA_OPTIONS`: 4GB heap + 1GB metaspace for Java

---

## Troubleshooting

### Problem 1: "EXPO_TOKEN invalid"

**Error:**
```
Error: Invalid EXPO_TOKEN
eas whoami: failed
```

**Causes:**
- Token expired
- Token revoked
- Token not added to GitHub Secrets

**Solution:**
1. Create new token:
   ```bash
   eas logout
   eas login
   eas secrets create
   ```
2. Update GitHub Secret:
   - Go to Repository Settings
   - Update `EXPO_TOKEN` value
   - Re-run workflow

---

### Problem 2: "Out of Memory Error"

**Error:**
```
java.lang.OutOfMemoryError: Metaspace
```

**Causes:**
- Complex app with many dependencies
- Large number of architectures being built
- GitHub Actions runner memory limits

**Solutions:**

**A. Reduce architectures (in android/gradle.properties):**
```
# Before:
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64

# After (Android 5.0+ only):
reactNativeArchitectures=arm64-v8a
```

**B. Clean build cache:**
```bash
cd android
./gradlew clean
```

**C. Use self-hosted runner:**
- Set up a machine with more RAM
- Configure as GitHub Actions runner
- Update workflow: `runs-on: [self-hosted]`

---

### Problem 3: "Invalid Bundle ID"

**Error:**
```
Invalid iOS Bundle ID! Format should be reverse-DNS: 'com.company.appname'
```

**Causes:**
- Format doesn't follow reverse-DNS
- Contains invalid characters
- Too short or too long

**Valid Examples:**
- ✅ `com.laundry.tayyar24`
- ✅ `com.example.myapp`
- ✅ `org.company.appname`

**Invalid Examples:**
- ❌ `laundry-tayyar24` (no dots)
- ❌ `com.laundry.tayyar 24` (space)
- ❌ `tayyar24` (not reverse-DNS)

**Solution:**
Use correct format: `com.company.appname`

---

### Problem 4: "TestFlight submission failed"

**Error:**
```
Failed to submit to TestFlight
```

**Causes:**
- Invalid APPLE_TEAM_ID
- EAS credentials not validated
- App not registered in App Store Connect

**Solutions:**

**A. Validate credentials locally:**
```bash
eas credentials --platform ios
```

**B. Check APPLE_TEAM_ID:**
- Should be 10 characters
- Go to Apple Developer Account to verify
- Update in GitHub Secrets if wrong

**C. Check App Store Connect:**
- Make sure app exists in your account
- Bundle ID matches exactly

---

### Problem 5: "APK build fails"

**Error:**
```
Error: ./gradlew assembleRelease failed
```

**Causes:**
- Out of memory
- Keystore configuration issues
- Android SDK problems

**Solutions:**

**A. Check keystore:**
```bash
cd android
cat keystore.properties
```

**B. Clean and retry:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

**C. Check Gradle version:**
```bash
cd android
./gradlew --version
```

---

### Problem 6: "Workflow file syntax error"

**Error:**
```
YAML syntax error in workflow file
```

**Causes:**
- Invalid YAML indentation
- Missing quotes
- Typos in syntax

**Solution:**
1. Check syntax in GitHub UI (it shows errors)
2. Use online YAML validator
3. Check recent changes to workflow file

---

### Problem 7: "Configure script fails"

**Error:**
```
configure-white-label.js: APP_NAME not provided
```

**Causes:**
- Environment variable not passed
- Typo in variable name
- Variable is empty

**Solution:**
Check workflow file has correct input names:
```yaml
env:
  APP_NAME: ${{ github.event.inputs.appName }}  # Must match exactly
```

---

## Best Practices

### 1. **Always Use Specific Versions**

❌ Bad:
```yaml
uses: actions/setup-node@latest
```

✅ Good:
```yaml
uses: actions/setup-node@v4
```

**Why:** Pinned versions are stable and predictable

---

### 2. **Cache Dependencies**

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: 'npm'  # ← Enable caching
```

**Why:** Saves 1-2 minutes per build

---

### 3. **Use Meaningful Job Names**

❌ Bad:
```yaml
jobs:
  build:
  test:
```

✅ Good:
```yaml
jobs:
  build_ios:
  build_android:
  summary:
```

**Why:** Easier to identify which job failed

---

### 4. **Log Important Information**

```yaml
- name: Log Configuration
  run: |
    echo "App Name: ${{ github.event.inputs.appName }}"
    echo "Build Type: iOS"
    cat eas.json | jq '.'
```

**Why:** Helps with debugging if build fails

---

### 5. **Use Conditional Steps**

```yaml
- name: Submit to TestFlight
  if: success()  # ← Only if previous steps succeeded
  run: eas submit ...
```

**Why:** Prevents submitting broken apps

---

### 6. **Handle Failures Gracefully**

```yaml
- name: Build
  run: ./gradlew assembleRelease
  continue-on-error: true  # ← Continue even if fails

- name: Report Status
  if: failure()  # ← Only runs if previous step failed
  run: echo "Build failed!"
```

**Why:** Allows cleanup before exit

---

### 7. **Use Secrets Safely**

❌ Bad:
```yaml
env:
  TOKEN: ${{ secrets.MY_TOKEN }}
run: echo $TOKEN  # ← Logs the token!
```

✅ Good:
```yaml
run: eas whoami  # ← Only outputs username
env:
  EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

**Why:** Prevents token exposure in logs

---

### 8. **Archive Build Artifacts**

```yaml
- name: Upload Artifacts
  uses: actions/upload-artifact@v4
  with:
    name: my-app-build
    path: build/
    retention-days: 30  # ← Auto-delete after 30 days
```

**Why:** Saves storage and prevents clutter

---

### 9. **Use Parallelism for Speed**

The "Both" workflow runs iOS and Android in parallel instead of sequential.

**Benefit:** 5-15 minutes faster

---

### 10. **Monitor Resource Usage**

Add this step to monitor memory:
```yaml
- name: Check System Resources
  run: |
    free -h  # Linux/macOS memory
    df -h    # Disk space
```

**Why:** Helps identify resource constraints early

---

## Workflow Customization

### Adding a New Step

To add a step (e.g., send Slack notification):

1. Edit the workflow file
2. Add new step in appropriate job
3. Use existing GitHub Actions

**Example: Send Slack Notification**

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "App ${{ github.event.inputs.appName }} build complete!",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "✅ Build Successful"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

### Adding New Input Fields

To add a new input (e.g., app version):

```yaml
on:
  workflow_dispatch:
    inputs:
      appName:
        description: 'App Name'
        required: true
        type: string
      appVersion:  # ← NEW INPUT
        description: 'App Version'
        required: false
        type: string
```

Then use in steps:
```yaml
- name: Display Version
  run: echo "Building version: ${{ github.event.inputs.appVersion }}"
```

---

### Adding Environment-Specific Builds

To build for different environments (dev/staging/prod):

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment'
        required: true
        type: choice
        options:
          - development
          - staging
          - production
```

Then use conditionally:
```yaml
- name: Build
  run: |
    if [ "${{ github.event.inputs.environment }}" = "production" ]; then
      eas build --profile production
    else
      eas build --profile development
    fi
```

---

## FAQ

### Q: Can I cancel a running build?

**A:** Yes!
1. Go to Actions tab
2. Click the running workflow
3. Click "Cancel workflow"

---

### Q: How do I see build artifacts?

**A:** 
1. Go to Actions tab
2. Click the completed run
3. Scroll to "Artifacts" section
4. Download your file

---

### Q: How long are artifacts kept?

**A:** 30 days by default (can be configured in workflow)

---

### Q: Can I re-run a failed build?

**A:** Yes!
1. Go to the failed run
2. Click "Re-run jobs"
3. Choose which jobs to re-run

---

### Q: What's the difference between APK and AAB?

**A:**
- **APK:** Single file, direct install, all architectures in one
- **AAB:** Google Play format, Play Store delivers correct version per device

---

### Q: Can I build without the web form?

**A:** Yes! Use GitHub Actions UI directly or GitHub CLI

---

### Q: How do I add a new workflow?

**A:**
1. Create new file in `.github/workflows/`
2. Write YAML configuration
3. Push to GitHub
4. New workflow appears in Actions tab

---

## Related Documentation

- [WHITE_LABEL_AUTOMATION_GUIDE.md](./WHITE_LABEL_AUTOMATION_GUIDE.md)
- [SCRIPTS_DOCUMENTATION.md](./SCRIPTS_DOCUMENTATION.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [EAS Documentation](https://docs.expo.dev/build/introduction/)

---

**Last Updated:** April 10, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
