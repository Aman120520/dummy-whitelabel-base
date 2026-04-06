# Credentials Reference

Keep this file secure. All values here need to be added to GitHub Secrets.

## GitHub Secrets Setup

**URL**: https://github.com/your-org/your-repo/settings/secrets/actions

### Secret 1: EXPO_TOKEN
```
Name: EXPO_TOKEN
Value: Bxrhap33MRN5COvONG8PodpjEaUIIHqA4UZiHmxg
```
- Used by: EAS Build and Submit
- Scope: Full access to Expo projects
- Obtained from: https://expo.dev/settings/tokens

### Secret 2: APPLE_TEAM_ID
```
Name: APPLE_TEAM_ID
Value: 2H9MCN975Q
```
- Used by: EAS Build (signing)
- Scope: Apple Developer Team ID
- Obtained from: Apple Developer Account

### Secret 3: APP_STORE_CONNECT_KEY_ID
```
Name: APP_STORE_CONNECT_KEY_ID
Value: 2MFD4KXKR7
```
- Used by: App Store Connect API (submitting builds)
- Scope: Specific API key ID
- Obtained from: App Store Connect > Users and Access > Keys

### Secret 4: APP_STORE_CONNECT_ISSUER_ID
```
Name: APP_STORE_CONNECT_ISSUER_ID
Value: 69a6de87-46aa-47e3-e053-5b8c7c11a4d1
```
- Used by: App Store Connect API (authentication)
- Scope: Your App Store Connect team/org ID
- Obtained from: App Store Connect > Users and Access > Keys

### Secret 5: APP_STORE_CONNECT_P8_BASE64
```
Name: APP_STORE_CONNECT_P8_BASE64
Value: LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR1RBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJIa3dkd0lCQVFRZ0ZHWGcrc09GWGxwcllEWGEKRTdiNzY0eWlJSVVuTlJmcWF5SnJETzZuVTRDZ0NnWUlLb1pJemowREFRZWhSQU5DQUFSZmwzZzl5NHRSVDJUdwpUbkUzS0lkTTc4eVZ1RkNGSnAzMjZIdkEzTTlsTEhhZjR3Vlc3Qy8rNGZ2Q3M0WmpCbHJWYmxmQlk1amk4RWNZCk9sbWhnQTBLCi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0=
```
- Used by: App Store Connect authentication
- Format: Base64-encoded .p8 private key file
- Obtained from: App Store Connect > Users and Access > Keys > Download

**How to encode P8 to base64:**
```bash
# On macOS/Linux:
base64 -i AuthKey_KEYID.p8

# On Windows (PowerShell):
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("AuthKey_KEYID.p8"))

# Copy the output and paste into the secret
```

### Secret 6: GITHUB_TOKEN
```
Name: GITHUB_TOKEN
Value: ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
- Used by: API endpoint to dispatch GitHub Actions workflows
- Scope: `repo` (full control of private repositories)
- Obtained from: https://github.com/settings/tokens/new

**Steps to create GITHUB_TOKEN:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "white-label-configurator"
4. Select scope: ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token immediately (you can't see it again!)
7. Add to GitHub Secrets as `GITHUB_TOKEN`

**Note**: This is a Personal Access Token. Keep it secret!

## Verification Checklist

After adding all secrets to GitHub:

- [ ] Go to Settings → Secrets and variables → Actions
- [ ] Verify all 6 secrets are listed:
  - [ ] EXPO_TOKEN
  - [ ] APPLE_TEAM_ID
  - [ ] APP_STORE_CONNECT_KEY_ID
  - [ ] APP_STORE_CONNECT_ISSUER_ID
  - [ ] APP_STORE_CONNECT_P8_BASE64
  - [ ] GITHUB_TOKEN

## Local Development (.env)

For running the API locally, create `.env`:

```bash
# GitHub Credentials
GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=dummy-whitelabel-base

# Environment
NODE_ENV=development
```

**Note**: Never commit `.env` to git. Add to `.gitignore`:
```bash
.env
.env.local
.env.*.local
```

## Credential Rotation / Expiry

### Tokens That Expire
- **APP_STORE_CONNECT_P8_BASE64**: Valid for 1 year, then needs rotation
  - When expired: "Unauthorized - Invalid token"
  - Solution: Generate new P8 key in App Store Connect, re-encode, update secret

### Tokens That Don't Expire (but should be rotated)
- **EXPO_TOKEN**: No auto-expiry, rotate annually for security
  - Create new token at https://expo.dev/settings/tokens
  - Delete old token

- **GITHUB_TOKEN**: No auto-expiry, rotate as needed
  - Create new at https://github.com/settings/tokens
  - Delete old token

## Security Best Practices

✅ **DO:**
- [ ] Store all credentials in GitHub Secrets
- [ ] Rotate credentials annually
- [ ] Use minimal scopes (GitHub: `repo` only)
- [ ] Keep P8 key file secure locally
- [ ] Regenerate tokens if compromised

❌ **DON'T:**
- [ ] Commit secrets to git
- [ ] Share credentials via email/chat
- [ ] Use same tokens across projects
- [ ] Leave credentials in code
- [ ] Log sensitive values

## If Token Is Compromised

1. **EXPO_TOKEN**: Revoke at https://expo.dev/settings/tokens
2. **GITHUB_TOKEN**: Revoke at https://github.com/settings/tokens
3. **APP_STORE_CONNECT_P8**: Revoke in App Store Connect > Users and Access
4. Generate new credentials immediately
5. Update GitHub Secrets
6. Rotate on all systems/CI/CD

## Testing Credentials

To verify credentials are working:

```bash
# Test EXPO_TOKEN
expo whoami --non-interactive
# Should show your account

# Test GITHUB_TOKEN
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
# Should return user info

# Test App Store Connect (in GitHub Actions)
# Build will fail with clear error if P8 key is invalid
```

---

**Last Updated**: 2026-04-06
**Status**: Ready for setup
