# Setup Checklist

Complete this checklist to get your one-click TestFlight build system working.

## Part 1: GitHub Secrets Setup (5 minutes)

**Location**: https://github.com/your-org/your-repo/settings/secrets/actions

### Step 1.1: Add EXPO_TOKEN
- [ ] Go to GitHub repository Settings
- [ ] Navigate to: Secrets and variables → Actions
- [ ] Click: "New repository secret"
- [ ] Name: `EXPO_TOKEN`
- [ ] Value: `Bxrhap33MRN5COvONG8PodpjEaUIIHqA4UZiHmxg`
- [ ] Click: "Add secret"

### Step 1.2: Add APPLE_TEAM_ID
- [ ] Click: "New repository secret"
- [ ] Name: `APPLE_TEAM_ID`
- [ ] Value: `2H9MCN975Q`
- [ ] Click: "Add secret"

### Step 1.3: Add APP_STORE_CONNECT_KEY_ID
- [ ] Click: "New repository secret"
- [ ] Name: `APP_STORE_CONNECT_KEY_ID`
- [ ] Value: `2MFD4KXKR7`
- [ ] Click: "Add secret"

### Step 1.4: Add APP_STORE_CONNECT_ISSUER_ID
- [ ] Click: "New repository secret"
- [ ] Name: `APP_STORE_CONNECT_ISSUER_ID`
- [ ] Value: `69a6de87-46aa-47e3-e053-5b8c7c11a4d1`
- [ ] Click: "Add secret"

### Step 1.5: Add APP_STORE_CONNECT_P8_BASE64
- [ ] Click: "New repository secret"
- [ ] Name: `APP_STORE_CONNECT_P8_BASE64`
- [ ] Value: Copy the full base64-encoded P8 key:
  ```
  LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR1RBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJIa3dkd0lCQVFRZ0ZHWGcrc09GWGxwcllEWGEKRTdiNzY0eWlJSVVuTlJmcWF5SnJETzZuVTRDZ0NnWUlLb1pJemowREFRZWhSQU5DQUFSZmwzZzl5NHRSVDJUdwpUbkUzS0lkTTc4eVZ1RkNGSnAzMjZIdkEzTTlsTEhhZjR3Vlc3Qy8rNGZ2Q3M0WmpCbHJWYmxmQlk1amk4RWNZCk9sbWhnQTBLCi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0=
  ```
- [ ] Click: "Add secret"

### Step 1.6: Create and Add GITHUB_TOKEN
- [ ] Go to: https://github.com/settings/tokens
- [ ] Click: "Generate new token (classic)"
- [ ] Token name: `white-label-configurator`
- [ ] Select scopes:
  - [ ] ✅ `repo` (Full control of private repositories)
- [ ] Click: "Generate token"
- [ ] **Copy the token immediately** (you won't see it again!)
- [ ] Go back to repository Settings → Secrets
- [ ] Click: "New repository secret"
- [ ] Name: `GITHUB_TOKEN`
- [ ] Value: Paste the token
- [ ] Click: "Add secret"

### Step 1.7: Verify All Secrets
- [ ] Go to: Repository Settings → Secrets and variables → Actions
- [ ] Verify all 6 secrets are listed:
  - [ ] EXPO_TOKEN
  - [ ] APPLE_TEAM_ID
  - [ ] APP_STORE_CONNECT_KEY_ID
  - [ ] APP_STORE_CONNECT_ISSUER_ID
  - [ ] APP_STORE_CONNECT_P8_BASE64
  - [ ] GITHUB_TOKEN
- [ ] ✅ All secrets added!

## Part 2: Code Updates (Already Done)

**Note**: The following files have already been updated for you:

- [ ] ✅ `web-configrator/web-eas.js` - Simplified form, GitHub Actions integration
- [ ] ✅ `api/trigger-workflow.js` - GitHub Actions dispatcher
- [ ] ✅ `.github/workflows/build.yml` - EAS build pipeline

## Part 3: Local Configuration (Optional)

Only do this if running the API server locally.

### Step 3.1: Create .env file
- [ ] In project root, create file: `.env`
- [ ] Add these lines:
  ```bash
  GITHUB_TOKEN=your_personal_access_token_here
  GITHUB_REPO_OWNER=your_github_username
  GITHUB_REPO_NAME=dummy-whitelabel-base
  NODE_ENV=development
  ```
- [ ] Save the file

### Step 3.2: Update .gitignore
- [ ] Open `.gitignore`
- [ ] Verify `.env` is in the file:
  ```
  .env
  .env.local
  .env.*.local
  ```
- [ ] If not present, add it

## Part 4: Test the System

### Step 4.1: Start Development Server
- [ ] Open terminal
- [ ] Run: `npm install` (if not done recently)
- [ ] Run: `npm start`
- [ ] Wait for server to start
- [ ] Server running at: `http://localhost:3000` (or your configured port)

### Step 4.2: Access Configurator
- [ ] Open browser
- [ ] Navigate to: `http://localhost:3000/web-configrator/`
- [ ] You should see the White-Label App Configurator form

### Step 4.3: Test Build
- [ ] Fill in the form:
  - [ ] App Name: `Test App`
  - [ ] Bundle ID: `com.test.testapp`
  - [ ] (Optional: Colors)
- [ ] Click: "Push to TestFlight (iOS)"
- [ ] Watch the build logs appear
- [ ] Status should show: "✅ Build request sent to GitHub Actions!"

### Step 4.4: Check GitHub Actions
- [ ] Go to your GitHub repository
- [ ] Click: "Actions" tab
- [ ] Look for workflow: "Generate Fast iOS App"
- [ ] Click the workflow run
- [ ] Watch the build progress:
  - [ ] Checkout code ✓
  - [ ] Setup Node.js ✓
  - [ ] Setup Expo/EAS ✓
  - [ ] Install dependencies ✓
  - [ ] Setup App Store Connect ✓
  - [ ] Update app.json ✓
  - [ ] Build iOS app (5-8 min) ⏳
  - [ ] Submit to TestFlight ✓
  - [ ] Build summary ✓

### Step 4.5: Verify in TestFlight
- [ ] Wait 15-20 minutes
- [ ] Go to: https://appstoreconnect.apple.com
- [ ] Navigate to: My Apps → Your App → TestFlight → Builds (iOS)
- [ ] Look for build with:
  - [ ] App name: "Test App"
  - [ ] Version: Should be listed
  - [ ] Status: "Ready for Testing"
- [ ] ✅ Build appears in TestFlight!

## Part 5: Production Deployment

### Step 5.1: Hosting API (Choose one)

#### Option A: Vercel (Recommended)
- [ ] Go to: https://vercel.com
- [ ] Import your repository
- [ ] In Settings → Environment Variables, add:
  - [ ] `GITHUB_TOKEN` = (your personal access token)
  - [ ] `GITHUB_REPO_OWNER` = (your username)
  - [ ] `GITHUB_REPO_NAME` = (your repo name)
- [ ] Deploy

#### Option B: Other Services (Netlify, AWS Lambda, etc.)
- [ ] Follow their documentation for environment variables
- [ ] Add the same 3 variables:
  - `GITHUB_TOKEN`
  - `GITHUB_REPO_OWNER`
  - `GITHUB_REPO_NAME`

### Step 5.2: Update Configurator URL
- [ ] In `web-configrator/web-eas.js`
- [ ] Update the API endpoint:
  ```javascript
  // Change from:
  apiUrl = `http://localhost:3000/api/trigger-workflow`;
  
  // To your production domain:
  apiUrl = `https://your-domain.com/api/trigger-workflow`;
  ```

### Step 5.3: Deploy Frontend
- [ ] Commit changes
- [ ] Push to main branch
- [ ] Deploy your frontend (Vercel, GitHub Pages, etc.)

## Part 6: Share with Team

### Step 6.1: Distribute Configurator
- [ ] Share the configurator URL with team
- [ ] Example: `https://your-domain.com/web-configrator/`

### Step 6.2: Document for Users
- [ ] Share QUICK_START.md with team
- [ ] They only need to:
  - [ ] Open configurator
  - [ ] Fill in app name & bundle ID
  - [ ] Click "Push to TestFlight"
  - [ ] Watch the logs

### Step 6.3: Access Permissions
- [ ] Testers who should receive builds via TestFlight
- [ ] Add them in App Store Connect → Users and Access

## Troubleshooting Checklist

### Build fails immediately
- [ ] Check all GitHub Secrets are added correctly
- [ ] Verify GitHub Secrets values match exactly (no extra spaces)
- [ ] Check GITHUB_TOKEN has `repo` scope

### Build fails in GitHub Actions
- [ ] Check EAS token is valid (not expired)
- [ ] Verify App Store Connect P8 key is not expired (1 year validity)
- [ ] Check Apple Team ID matches your account
- [ ] Review GitHub Actions logs for specific errors

### App doesn't appear in TestFlight
- [ ] Wait at least 15 minutes
- [ ] Check App Store Connect → TestFlight → Builds (iOS)
- [ ] Verify bundle ID matches your app in App Store Connect
- [ ] Check all testers are added in Users and Access

### API returns error
- [ ] Check API logs (if self-hosted)
- [ ] Verify GITHUB_TOKEN is not expired
- [ ] Test with: `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user`
- [ ] Check network connectivity

## Security Checklist

- [ ] No secrets committed to git
- [ ] .env file in .gitignore
- [ ] GitHub Secrets are properly configured
- [ ] GITHUB_TOKEN only has `repo` scope
- [ ] P8 key is base64-encoded
- [ ] Access control set up in App Store Connect

## Final Verification

- [ ] All 6 GitHub Secrets added ✅
- [ ] Code changes in place ✅
- [ ] Test build succeeded ✅
- [ ] App appears in TestFlight ✅
- [ ] Team can access configurator ✅
- [ ] Documentation shared with team ✅

## Support

If you encounter issues:

1. **Check logs**: 
   - GitHub Actions → Actions tab → Workflow run
   - Frontend browser console (F12)

2. **Verify credentials**:
   - EXPO_TOKEN at https://expo.dev/settings/tokens
   - GITHUB_TOKEN at https://github.com/settings/tokens
   - App Store Connect keys not expired

3. **Review documentation**:
   - QUICK_START.md
   - GITHUB_ACTIONS_SETUP.md
   - SYSTEM_DIAGRAM.txt

---

**Status**: Ready to begin setup
**Time to complete**: 10-15 minutes
**Last updated**: 2026-04-06
