# Automated White-Label Multi-App Setup (50+ Apps, Single Codebase)

This system allows you to manage **50+ completely separate apps** with a single codebase. Just change the app name and bundle ID in the web UI, and a brand new app is automatically created on both App Store Connect and Google Play Console.

## Architecture

```
Single Codebase (dummy-whitelabel-base)
    ↓
Web Configurator (User enters: App Name, Bundle ID, Package Name)
    ↓
GitHub Actions Workflow
    ↓
├─ Create iOS App on App Store Connect (App Store Connect API)
├─ Create Android App on Google Play Console (Google Play API)
├─ Build iOS app (EAS Build)
├─ Build Android APK (Gradle)
├─ Submit to TestFlight/Play Store (Automated)
    ↓
50 Completely Separate Apps
```

## What Gets Automated

When you use the web configurator:

1. **Create App on App Store Connect**
   - New iOS app created automatically
   - Bundle ID: Your input (e.g., `com.client1.app`)
   - App Name: Your input (e.g., `Laundry Pro`)

2. **Create App on Google Play Console**
   - New Android app created automatically
   - Package Name: Your input (e.g., `com.client1.app`)
   - App Name: Your input (e.g., `Laundry Pro`)

3. **Build & Submit**
   - iOS: Build with EAS, submit to TestFlight
   - Android: Build APK, upload to Play Store
   - Both use the brand new apps created above

## Required Setup

### 1. App Store Connect API Credentials

You need an Apple API Key (.p8 file) with permissions:
- App Manager
- Create Apps
- Modify App Information

**Steps:**
1. Go to https://appstoreconnect.apple.com
2. Account → Users and Access → Keys (Apps)
3. Click "Generate a Key"
4. Select role: "Developer"
5. Download the .p8 file
6. Add to GitHub Secrets:
   - `APPLE_API_KEY_ID`: Key ID
   - `APPLE_API_ISSUER_ID`: Issuer ID
   - `APPLE_API_KEY_PATH`: .p8 file content

### 2. Google Play API Credentials

Create a Google Cloud service account with Play API access.

**Steps:**
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable "Google Play Android Developer API"
4. Create service account with Editor role
5. Download JSON key
6. Link to Play Console: Settings → API access → Service accounts
7. Add to GitHub Secrets:
   - `GOOGLE_PLAY_CREDENTIALS_PATH`: JSON file content

### 3. EAS Account

Keep your single EAS account. No need for per-client EAS projects anymore!

## Web Configurator (Simplified)

```
App Name: Laundry Pro
iOS Bundle ID: com.laundry.pro
Android Package: com.laundry.pro
GitHub PAT: your-token
```

That's it! System handles:
- Creating the iOS app on App Store Connect
- Creating the Android app on Google Play Console
- Building both
- Submitting both

## Workflow for 50 Clients

```
Client 1: App Name → Bundle ID → New iOS app + New Android app
Client 2: App Name → Bundle ID → New iOS app + New Android app
... repeat for all 50 ...
```

Single codebase, 50 completely separate apps!

## GitHub Secrets Required

```
APPLE_API_KEY_ID              
APPLE_API_ISSUER_ID           
APPLE_API_KEY_PATH            
GOOGLE_PLAY_CREDENTIALS_PATH   
APPLE_TEAM_ID                 
EXPO_TOKEN                     
```

## Key Points

✅ **One shared EAS account** (no per-client EAS projects needed)
✅ **API-driven app creation** (automatic on App Store + Google Play)
✅ **Single codebase** (50+ apps from one repo)
✅ **Fully automated** (app creation → build → submit in one workflow)
✅ **Scalable** (same process for 50 or 500 clients)
