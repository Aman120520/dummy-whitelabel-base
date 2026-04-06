# Build Triggering - Troubleshooting Guide

## Quick Test (Command Line)

### Step 1: Get Your GitHub Token

Go to: https://github.com/settings/tokens

Create a new token with:
- Scopes: `repo` (full control of private repositories)
- Copy the token carefully

### Step 2: Test with Script

```bash
GITHUB_TOKEN="ghp_xxxxx..." node trigger-build-simple.js "My App" "com.my.app" "4565"
```

Expected output:
```
🚀 Triggering GitHub Actions workflow...
   Repository: Aman120520/dummy-whitelabel-base
   Workflow: build.yml
   Inputs: { appName: 'My App', bundleId: 'com.my.app', clientId: '4565' }

✅ Workflow triggered successfully!

📊 Check status at:
   https://github.com/Aman120520/dummy-whitelabel-base/actions

🎯 Build will start in ~30 seconds
```

---

## If Test Script Works

Then the web UI should also work. Try:
1. Restart server: `node server.js`
2. Open: http://localhost:3000
3. Fill form with same values
4. Click "Push to TestFlight"

---

## If Test Script Fails

### Error: "❌ Error 401"

**Problem**: Invalid or expired GitHub token

**Solution**:
```bash
# Generate new token at: https://github.com/settings/tokens
# Make sure scopes include: repo

# Test again with new token
GITHUB_TOKEN="ghp_xxxxx..." node trigger-build-simple.js
```

### Error: "❌ Error 404"

**Problem**: Repository or workflow not found

**Checklist**:
- [ ] Repository exists: https://github.com/Aman120520/dummy-whitelabel-base
- [ ] Workflow file exists: `.github/workflows/build.yml`
- [ ] Branch `main` exists and is current

**Solution**:
```bash
# Verify locally
git log --oneline -1
git branch

# Make sure on main branch
git checkout main
git pull origin main
```

### Error: "❌ Error 403"

**Problem**: Token doesn't have permission

**Solution**:
```bash
# Generate new token with full `repo` scope
# https://github.com/settings/tokens
```

### Error: "❌ Error 422"

**Problem**: Invalid input or workflow reference

**Check**:
1. Workflow file path must be `.github/workflows/build.yml` ✓
2. Inputs must match workflow definition:
   ```yaml
   inputs:
     appName:          # required
     bundleId:         # required
     clientId:         # required
   ```

---

## Web UI Debugging

### Step 1: Open Browser Console
- F12 (Windows) or Cmd+Option+I (Mac)
- Go to "Console" tab

### Step 2: Fill Form and Submit
- GitHub PAT
- Owner: Aman120520
- Repo: dummy-whitelabel-base
- Client ID: 4565
- Bundle ID: com.test.app
- App Name: Test App

### Step 3: Check Logs
In browser console, you should see:
```
API Response Error: {error: "...", details: "..."}
```

Or in server terminal, look for:
```
[makeRequest] POST https://api.github.com/repos/Aman120520/dummy-whitelabel-base/actions/workflows/build.yml/dispatches
[makeRequest] Response 204
```

---

## Verify Workflow File Exists

```bash
cat .github/workflows/build.yml | head -20
```

Should show:
```yaml
name: Generate Fast iOS App

on:
  workflow_dispatch:
    inputs:
      appName:
        description: 'App Name'
        required: true
```

---

## Complete Test Checklist

- [ ] GitHub token created at https://github.com/settings/tokens
- [ ] Token has `repo` scope
- [ ] Token is fresh (not expired)
- [ ] Repository: Aman120520/dummy-whitelabel-base exists
- [ ] Workflow file: `.github/workflows/build.yml` exists
- [ ] Main branch exists and is current
- [ ] Node server running: `node server.js`
- [ ] Browser can access: http://localhost:3000
- [ ] Test script works: `GITHUB_TOKEN=... node trigger-build-simple.js`
- [ ] Web form submits without error

---

## Success Indicator

After triggering (from script or web UI), check:

```bash
# Watch live
watch -n 5 'gh run list -w build.yml'

# Or go to GitHub:
# https://github.com/Aman120520/dummy-whitelabel-base/actions
```

You should see a new workflow run starting!

---

## Still Stuck?

Check server logs:
```bash
# Terminal where server is running shows:
[Server] POST /api/trigger-workflow
[Server] Request body: {...}
[makeRequest] POST https://api.github.com/...
[makeRequest] Response XXX
[API] ...
```

Share the exact error response and we can debug further.
