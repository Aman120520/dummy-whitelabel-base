# Architecture: Web Configurator → GitHub Actions → TestFlight

## End-to-End Flow

### 1. User Interface (Web Configurator)
**File**: `web-configrator/web-eas.js`

```
┌─────────────────────────────────────┐
│  White-Label App Configurator       │
├─────────────────────────────────────┤
│                                     │
│  Section 1: App Styling             │
│  - App Name input                   │
│  - Primary Color picker             │
│  - Secondary Color picker           │
│  [Save to Database]                 │
│                                     │
│  Section 2: Build & Deploy          │
│  - Bundle ID input                  │
│  [Push to TestFlight (iOS)] ◄──┐    │
│                                 │    │
│  Build Terminal                 │    │
│  [Live logs appear here]        │    │
│                                 │    │
└─────────────────────────────────────┘
                                      │
                          User clicks button
                                      │
                                      ▼
```

**Form Data Sent:**
```javascript
{
  appName: "Tayyar24 Laundry",
  bundleId: "com.laundry.tayyar24",
  clientId: "white-label-app",
  primaryColor: "#202f66",
  secondaryColor: "#f0f4f8"
}
```

### 2. API Layer
**File**: `api/trigger-workflow.js`

**Endpoint**: `POST /api/trigger-workflow`

```
Frontend Request
    ↓
┌─────────────────────────────────────────┐
│  API Endpoint (trigger-workflow.js)     │
├─────────────────────────────────────────┤
│  1. Validate inputs                     │
│  2. Read GITHUB_TOKEN from env          │
│  3. Make GitHub API request             │
│  4. Return response to frontend         │
└─────────────────────────────────────────┘
    ↓
GitHub API: POST /repos/{owner}/{repo}/actions/workflows/build.yml/dispatches
    ↓
Response
```

**Environment Variables (required):**
```
GITHUB_TOKEN          = Personal access token with repo scope
GITHUB_REPO_OWNER     = Repository owner (username/org)
GITHUB_REPO_NAME      = Repository name
```

**Request to GitHub:**
```json
{
  "ref": "main",
  "inputs": {
    "appName": "Tayyar24 Laundry",
    "bundleId": "com.laundry.tayyar24",
    "clientId": "white-label-app",
    "primaryColor": "#202f66",
    "secondaryColor": "#f0f4f8"
  }
}
```

### 3. GitHub Actions Workflow
**File**: `.github/workflows/build.yml`

```
GitHub Actions Queue
    ↓
┌──────────────────────────────────────────────────────────────┐
│  Step 1: Checkout Code                                       │
│  - Clone repository                                          │
└──────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────┐
│  Step 2: Setup Node.js & Expo/EAS                            │
│  - Node 20                                                   │
│  - EAS CLI (latest)                                          │
│  - EXPO_TOKEN from secrets                                   │
└──────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────┐
│  Step 3: Setup App Store Connect Credentials                 │
│  - Decode P8 key from base64                                 │
│  - Write to ~/.appstoreconnect/private_keys/                 │
└──────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────┐
│  Step 4: Update app.json with White-Label Config             │
│  - appName → "Tayyar24 Laundry"                              │
│  - bundleIdentifier → "com.laundry.tayyar24"                 │
│  - slug → "tayyar24"                                         │
│  - extra.primaryColor → "#202f66"                            │
│  - extra.secondaryColor → "#f0f4f8"                          │
└──────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────┐
│  Step 5: Build iOS App with EAS                              │
│  - eas build --platform ios --profile production             │
│  - Wait for build to complete                                │
│  - Environment: EXPO_TOKEN, APPLE_TEAM_ID, P8 key creds     │
└──────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────┐
│  Step 6: Submit to TestFlight                                │
│  - eas submit --platform ios --profile production            │
│  - Uses App Store Connect credentials                        │
│  - Submits latest build to TestFlight                        │
└──────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────┐
│  Step 7: Build Summary                                       │
│  - Success message with app details                          │
│  - Logs available in GitHub Actions tab                      │
└──────────────────────────────────────────────────────────────┘
    ↓
Build Complete
```

### 4. TestFlight
```
~15-20 minutes

App appears in:
- App Store Connect → TestFlight → Builds
- Testers receive email invitations
```

## Data Flow Diagram

```
┌─────────────────────┐
│  Web Configurator   │
│  (React Component)  │
└──────────┬──────────┘
           │
           │ POST /api/trigger-workflow
           │ { appName, bundleId, ... }
           │
           ▼
┌─────────────────────────────────────────┐
│  API Endpoint (Node.js/Express)         │
│  - Validates input                      │
│  - Reads GITHUB_TOKEN from env          │
│  - Calls GitHub API                     │
└──────────┬──────────────────────────────┘
           │
           │ GitHub API Call
           │ POST /repos/owner/repo/actions/workflows/build.yml/dispatches
           │
           ▼
┌─────────────────────────────────────────┐
│  GitHub Actions                         │
│  (workflow: Generate Fast iOS App)      │
│                                         │
│  1. Setup environment                   │
│  2. Write App Store Connect P8 key      │
│  3. Update app.json (white-label)       │
│  4. Run: eas build (iOS)                │
│  5. Run: eas submit (TestFlight)        │
└──────────┬──────────────────────────────┘
           │
           │ EXPO_TOKEN, APPLE_TEAM_ID
           │ APP_STORE_CONNECT credentials
           │
           ▼
┌─────────────────────────────────────────┐
│  EAS Build + TestFlight Submit          │
│  (Expo servers)                         │
│                                         │
│  Builds iOS binary                      │
│  Submits to App Store Connect           │
└──────────┬──────────────────────────────┘
           │
           │ ~15-20 minutes
           │
           ▼
┌─────────────────────────────────────────┐
│  TestFlight                             │
│  - Build available for testers          │
│  - Email invitations sent               │
│  - Can be downloaded in TestFlight app  │
└─────────────────────────────────────────┘
```

## Secrets Configuration

### GitHub Repository Secrets
These are set in: **GitHub → Settings → Secrets and variables → Actions**

```
EXPO_TOKEN
  ├─ Used by: EAS CLI
  └─ Scope: Full access to Expo/EAS projects

APPLE_TEAM_ID
  ├─ Used by: EAS Build
  └─ Value: 2H9MCN975Q

APP_STORE_CONNECT_KEY_ID
  ├─ Used by: App Store Connect API
  └─ Value: 2MFD4KXKR7

APP_STORE_CONNECT_ISSUER_ID
  ├─ Used by: App Store Connect API
  └─ Value: 69a6de87-46aa-47e3-e053-5b8c7c11a4d1

APP_STORE_CONNECT_P8_BASE64
  ├─ Used by: App Store Connect authentication
  └─ Value: Base64-encoded P8 private key

GITHUB_TOKEN
  ├─ Used by: API endpoint to dispatch workflows
  ├─ Scope: repo (full control)
  └─ Created at: https://github.com/settings/tokens
```

## Execution Timeline

```
T+0:00    User clicks "Push to TestFlight"
          ↓
T+0:05    API triggers GitHub Actions workflow
          ↓
T+0:30    GitHub Actions: Setup & build starts
          ↓
T+8:00    EAS Build completes
          ↓
T+9:00    EAS Submit to TestFlight completes
          ↓
T+15-20   Build appears in TestFlight
          ↓
Complete: Testers can install from TestFlight app
```

## File Structure

```
project-root/
├── web-configrator/
│   ├── web-eas.js              (React component - user interface)
│   └── index.html              (HTML host)
├── api/
│   └── trigger-workflow.js     (API endpoint - GitHub dispatcher)
├── .github/workflows/
│   └── build.yml               (GitHub Actions - build pipeline)
├── app.json                    (Expo/EAS config - updated per build)
├── package.json                (Dependencies)
│
└── Documentation:
    ├── QUICK_START.md          (5-minute setup)
    ├── GITHUB_ACTIONS_SETUP.md (Detailed configuration)
    └── ARCHITECTURE.md         (This file)
```

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 | Web UI for configurator |
| Backend | Node.js + Express | API endpoint |
| CI/CD | GitHub Actions | Build orchestration |
| Mobile Build | EAS Build | iOS build service |
| App Distribution | EAS Submit + TestFlight | iOS app distribution |
| Credentials | GitHub Secrets | Secure credential storage |

## Security Considerations

1. **GitHub Secrets**: All credentials stored securely in GitHub
2. **P8 Key**: Encoded as base64, decoded only during build
3. **GITHUB_TOKEN**: Limited to `repo` scope, can be rotated anytime
4. **No tokens in frontend**: API handles all sensitive operations
5. **CORS enabled**: API allows requests from configurator

## Performance

- **Initial API call**: ~100ms
- **GitHub Actions dispatch**: ~500ms
- **Queue time**: 0-5 minutes (depends on GitHub load)
- **Build time**: 5-8 minutes
- **Submit time**: 1-2 minutes
- **TestFlight propagation**: 5-15 minutes
- **Total time**: ~15-25 minutes from button click to TestFlight

## Scaling Considerations

If multiple builds are triggered:
- GitHub Actions queues builds automatically
- EAS handles concurrent builds in parallel
- No conflicts as each build has unique bundleId
- Can run up to 10 concurrent builds (GitHub limit)

---

**Last Updated**: 2026-04-06
