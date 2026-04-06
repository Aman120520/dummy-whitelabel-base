# Quick Test Guide

## Test 1: Verify Server is Working

```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok"}
```

---

## Test 2: Test API with cURL

```bash
curl -X POST http://localhost:3000/api/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "expoToken": "YOUR_EXPO_TOKEN_HERE",
    "projectId": "952733e3-51a5-40b4-8554-eaac3a5a6390",
    "appName": "Test App",
    "bundleId": "com.test.app",
    "appleTeamId": "YOUR_APPLE_TEAM_ID_HERE"
  }'
```

Replace:
- `YOUR_EXPO_TOKEN_HERE` - Get from: `eas whoami` or https://expo.dev/settings/tokens
- `YOUR_APPLE_TEAM_ID_HERE` - Get from: `eas credentials --platform ios --list`

---

## Test 3: Check Browser Console

1. Open: http://localhost:3000
2. Press **F12** (Windows) or **Cmd+Option+I** (Mac)
3. Go to **Console** tab
4. Fill form and click button
5. Look for error details in console

---

## Common Errors

### "401 Unauthorized"
**Problem**: Invalid EXPO_TOKEN  
**Solution**: 
```bash
eas login
eas whoami
# Copy the token and use it
```

### "404 Not Found"
**Problem**: Project ID or workflow file doesn't exist  
**Solution**:
```bash
# Verify project ID in app.json
cat app.json | grep -A 2 '"eas"'

# Verify workflow file exists
ls eas-workflows/build-testflight.yml
```

### "403 Forbidden"
**Problem**: EXPO_TOKEN doesn't have permission  
**Solution**:
```bash
# Generate new token with full access
eas token --help
eas token
```

### "Credentials not set up"
**Problem**: Apple credentials not uploaded to EAS  
**Solution**:
```bash
eas credentials --platform ios
```

---

## Step-by-Step Debug

### Step 1: Get Valid Credentials

```bash
# Login to Expo
eas login

# Get your token
eas whoami
# Copy the token shown

# Get Apple Team ID
eas credentials --platform ios --list
# Look for "Team ID: XXXXXXXXXX"
```

### Step 2: Test API Directly

```bash
# Replace values with your real credentials
EXPO_TOKEN="expo_xxxxx..." \
APPLE_TEAM_ID="XXXXXXXXXX" \
curl -X POST http://localhost:3000/api/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "expoToken": "expo_xxxxx...",
    "projectId": "952733e3-51a5-40b4-8554-eaac3a5a6390",
    "appName": "Test App",
    "bundleId": "com.test.app",
    "appleTeamId": "XXXXXXXXXX"
  }'
```

If this works, you should see:
```json
{
  "success": true,
  "runId": "abc123def456",
  "message": "Workflow triggered successfully"
}
```

### Step 3: Use Web UI

Once cURL test works, try the web UI at http://localhost:3000

---

## Checklist

- [ ] `node server.js` is running
- [ ] http://localhost:3000 loads in browser
- [ ] `eas whoami` shows valid token
- [ ] `eas credentials --platform ios --list` shows credentials
- [ ] cURL test succeeds with real credentials
- [ ] Web form works with same credentials

---

## Need More Help?

Check server terminal for logs:
```
[Server] POST /api/trigger-workflow
[Server] Request body: { ... }
[API] EAS API Error 401: ...
```

These logs show exactly what's failing.
