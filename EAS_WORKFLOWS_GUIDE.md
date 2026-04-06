# EAS Workflows - Native Build Automation

EAS Workflows is a native Expo/EAS feature for automating builds. It's **better than GitHub Actions** for React Native apps because:

✅ **Native to Expo** - Built into EAS, no third-party platform  
✅ **Simpler** - No secrets management, credentials already in EAS  
✅ **Faster** - Runs directly on EAS servers, no GitHub sync overhead  
✅ **Better Logs** - EAS provides better build logs and debugging  

---

## Setup

### 1. Validate Your Workflow File

```bash
eas workflow:validate eas-workflows/build-testflight.yml
```

### 2. Run a Manual Build (Test)

```bash
APP_NAME="Test App" \
BUNDLE_ID="com.test.app" \
APPLE_TEAM_ID="XXXXXXXXXX" \
eas workflow:run --workflow eas-workflows/build-testflight.yml
```

This will:
1. Upload your project to EAS
2. Configure white-label settings
3. Build the iOS app
4. Submit to TestFlight
5. Show you the logs in real-time

### 3. Check Workflow Status

```bash
# List recent runs
eas workflow:runs

# View specific run
eas workflow:view <RUN_ID>

# View logs
eas workflow:logs <RUN_ID>
```

---

## Using With Web Configurator

Update your `web-configrator/web.js` to trigger EAS Workflows instead of GitHub Actions:

```javascript
const handleTriggerPipeline = async () => {
  // ... validation ...

  try {
    addLog("Triggering EAS workflow...");
    
    const response = await fetch(
      `https://api.expo.dev/v2/projects/${projectId}/workflows/build-testflight.yml/runs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EXPO_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          env: {
            APP_NAME: appTheme.appName,
            BUNDLE_ID: pipeline.bundleId,
            APPLE_TEAM_ID: secrets.APPLE_TEAM_ID,
          }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      addLog("✅ EAS Workflow triggered!");
      addLog(`Run ID: ${data.id}`);
      addLog(`Check status: eas workflow:view ${data.id}`);
    } else {
      addLog(`❌ Error: ${response.status}`);
    }
  } catch (error) {
    addLog(`❌ Failed: ${error.message}`);
  }
};
```

---

## Comparison: EAS Workflows vs GitHub Actions

| Feature | EAS Workflows | GitHub Actions |
|---------|---|---|
| Setup Complexity | ⭐ Simple | ⭐⭐⭐ Complex |
| Credentials | Built-in (already in EAS) | Manual secrets |
| Speed | Fast (direct to EAS) | Slower (GitHub → EAS) |
| Logs | Real-time, detailed | Delayed, more verbose |
| Integration | Native to Expo | Third-party platform |
| Fallback Option | - | ✅ Yes (we still have it) |

---

## Files

### EAS Workflow Files
- `eas-workflows/build-testflight.yml` - Main workflow

### Documentation
- `eas-workflows/` - Directory for all workflow configs

### Still Available
- `.github/workflows/build.yml` - GitHub Actions (fallback)

---

## Troubleshooting

### "Workflow file not found"
```bash
eas workflow:validate eas-workflows/build-testflight.yml
```

### "EXPO_TOKEN not valid"
Generate a new token:
```bash
eas login
eas whoami
```

### "Credentials not found"
Ensure credentials are uploaded to EAS:
```bash
eas credentials --platform ios --list
```

### Check build logs
```bash
eas workflow:logs <RUN_ID>
```

---

## Next Steps

1. **Test locally:**
   ```bash
   eas workflow:validate eas-workflows/build-testflight.yml
   eas workflow:run --workflow eas-workflows/build-testflight.yml
   ```

2. **Integrate with web configurator** (update web.js)

3. **Monitor runs:**
   ```bash
   eas workflow:runs
   eas workflow:view <RUN_ID>
   ```

---

## References

- [EAS Workflows Docs](https://docs.expo.dev/eas/workflows/)
- [EAS CLI Workflows](https://docs.expo.dev/eas/cli/)
- Your project: `eas-workflows/build-testflight.yml`
