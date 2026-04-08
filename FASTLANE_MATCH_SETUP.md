# Fastlane Match Setup Guide

Fastlane Match automatically manages your iOS certificates and provisioning profiles in a private GitHub repository.

## What is Match?

Match encrypts your Apple certificates and provisioning profiles, stores them in a private Git repo, and syncs them across all machines. GitHub Actions pulls them down automatically during builds.

**Benefits:**
- ✅ No manual certificate management
- ✅ Certificates stored securely in encrypted Git repo
- ✅ Automatic syncing across machines
- ✅ Works seamlessly with GitHub Actions
- ✅ Scales to multiple apps/certificates

---

## Step 1: Create a Private Match Repository

1. Go to GitHub and create a **new private repository** named `certificates-match`
2. Keep it empty (no README)
3. Copy the HTTPS URL: `https://github.com/YOUR_USERNAME/certificates-match.git`

---

## Step 2: Initialize Match Locally

```bash
cd ios

# Run match setup
fastlane match init
# When asked, choose: "app-store"
# Provide your Match repo URL: https://github.com/YOUR_USERNAME/certificates-match.git
```

This creates `ios/Matchfile` with your Match configuration.

---

## Step 3: Create Initial Certificates

You have two options:

### Option A: Create New Certificates (Recommended)

```bash
fastlane match create
```

Follow the prompts:
1. Apple ID: your@apple.com
2. Temporary password (use app-specific password)
3. Match will create certificates and upload to your Match repo

### Option B: Import Existing Certificates

If you already have certificates:

```bash
fastlane match import
```

Follow the prompts to import your existing .p12 certificates.

---

## Step 4: Add GitHub Secrets

Go to: https://github.com/YOUR_USERNAME/dummy-whitelabel-base/settings/secrets/actions

Add these 5 secrets:

1. **FASTLANE_USER**
   - Value: Your Apple ID email (e.g., developer@apple.com)

2. **FASTLANE_PASSWORD**
   - Value: Your App-Specific Password (from Apple ID settings)
   - **NOT** your regular Apple password

3. **FASTLANE_MATCH_REPO**
   - Value: `https://github.com/YOUR_USERNAME/certificates-match.git`

4. **MATCH_GITHUB_TOKEN**
   - Value: Your GitHub Personal Access Token with `repo` scope
   - Create at: https://github.com/settings/tokens/new

5. **APPLE_TEAM_ID**
   - Value: `2H9MCN975Q`

---

## Step 5: Create App-Specific Password

1. Go to https://appleid.apple.com/account/manage
2. Sign in with your Apple ID
3. Go to "Security" → "App-Specific Passwords"
4. Generate a new password for "Fastlane Match"
5. Use this as `FASTLANE_PASSWORD` secret (not your regular password)

---

## Step 6: Generate GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Token name: `fastlane-match`
3. Expiration: 90 days (or No expiration)
4. Scopes: Check `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token and add as `MATCH_GITHUB_TOKEN` secret

---

## Step 7: Test the Workflow

1. Go to GitHub Actions
2. Click "Build and Submit to TestFlight (Fastlane Match)"
3. Click "Run workflow"
4. Fill in:
   - App Name: `TestApp`
   - Bundle ID: `com.test.testapp`
   - Client ID: `123`
5. Watch the build logs

---

## How It Works

1. **Checkout Match Repo**: Pulls encrypted certificates from your private Git repo
2. **Match Sync**: Decrypts certificates and sets up provisioning profiles
3. **Build**: Uses the provisioning profiles to build the app
4. **Submit**: Automatically submits to TestFlight

---

## Troubleshooting

### "Invalid Match repo"
→ Check `FASTLANE_MATCH_REPO` secret is correct URL

### "Authentication failed"
→ Verify `FASTLANE_USER` and `FASTLANE_PASSWORD` are correct
→ Use App-Specific Password, NOT regular Apple password

### "GitHub token insufficient permissions"
→ Regenerate token with `repo` scope
→ Check `MATCH_GITHUB_TOKEN` is set

### "Certificate not found"
→ Run `fastlane match create` locally first
→ Make sure certificates are in Match repo

### "Provisioning profile not valid"
→ Regenerate profiles: `fastlane match nuke distribution`
→ Then run `fastlane match create` again

---

## Useful Fastlane Commands

```bash
# List your certificates
fastlane match list

# Revoke and recreate all certificates
fastlane match nuke distribution

# Force update certificates
fastlane match update

# Manually import certificates
fastlane match import
```

---

## Security Notes

✅ **Secure:**
- Certificates encrypted with HTTPS password
- Stored in private Git repo
- GitHub token has limited scope
- App-specific password used (not main password)

❌ **Never:**
- Share `.p8` files directly
- Commit unencrypted certificates
- Use regular Apple password

---

## Next Steps

1. Create a private `certificates-match` repository on GitHub
2. Add all 5 secrets to GitHub Actions
3. Run `fastlane match init` and `fastlane match create` locally
4. Test the "Build and Submit to TestFlight (Fastlane Match)" workflow

Good luck! 🚀
