# Quick Start: TestFlight Automation

## 5-Minute Setup

### 1. Get Your Secrets
```bash
# Expo Token
eas whoami
# (If not logged in: eas login)

# Apple App Store Connect Key
# - Go to https://appstoreconnect.apple.com
# - Users and Access → Keys → Create New Key
# - Select "App Store Connect API"
# - Download .p8 file
# - Convert to base64: base64 -i AuthKey_XXXX.p8

# Apple ID Password
# - Go to https://appleid.apple.com/account/manage
# - App passwords → Generate for "App Store Connect"
```

### 2. Add GitHub Secrets
Go to: `Settings > Secrets and variables > Actions > New repository secret`

Add these (copy-paste from step 1):
- `EXPO_TOKEN` - your expo token
- `APPLE_TEAM_ID` - your apple team id (10 chars)
- `APP_STORE_CONNECT_KEY_ID` - from .p8 filename (e.g., XXXX in AuthKey_XXXX.p8)
- `APP_STORE_CONNECT_ISSUER_ID` - from App Store Connect
- `APP_STORE_CONNECT_P8_BASE64` - the base64 string
- `APPLE_ID` - your apple id email
- `APPLE_ID_PASSWORD` - the app-specific password

### 3. Trigger Build
1. Go to your GitHub repo
2. Click "Actions" tab
3. Click "Build and Deploy to TestFlight"
4. Click "Run workflow"
5. Fill in:
   - **App Name**: e.g., "Tayyar24 Laundry"
   - **Bundle ID**: e.g., "com.tayyar.laundry24"
   - **Client ID**: e.g., "4565"
6. Click "Run workflow"
7. ☕ Wait ~15-20 minutes

### Done!
Once complete, TestFlight automatically notifies your testers!

## Troubleshooting

| Error | Solution |
|-------|----------|
| `EXPO_TOKEN not found` | Add EXPO_TOKEN to GitHub secrets |
| `Invalid P8 file` | Make sure you base64 encoded the .p8 file correctly |
| `Apple ID authentication failed` | Use app-specific password, not regular password |
| `Bundle ID already registered` | Use a unique bundle ID |
| Build hangs 15+ min | This is normal! Check https://expo.dev/builds for status |

## Full Documentation
See [TESTFLIGHT_AUTOMATION_SETUP.md](TESTFLIGHT_AUTOMATION_SETUP.md) for detailed guide
