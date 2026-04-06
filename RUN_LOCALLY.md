# Run Web Configurator Locally

## Quick Start

### 1. Start the Server

```bash
node server.js
```

You should see:
```
╔═══════════════════════════════════════╗
║  White-Label App Configurator         ║
╚═══════════════════════════════════════╝

✅ Server running on: http://localhost:3000
```

### 2. Open in Browser

Go to: **http://localhost:3000**

### 3. Fill in the Form

- **Expo Token**: Get from `eas whoami` or https://expo.dev/settings/tokens
- **EAS Project ID**: `952733e3-51a5-40b4-8554-eaac3a5a6390`
- **Apple Team ID**: Get from `eas credentials --platform ios --list`
- **Bundle ID**: e.g., `com.test.app`
- **App Name**: e.g., `Test App`

### 4. Click "Push to TestFlight"

Watch the logs in real-time as it triggers the EAS Workflow!

---

## How It Works

```
Browser (localhost:3000)
       ↓
   web-eas.js (React UI)
       ↓
   POST /api/trigger-workflow
       ↓
   server.js (Express backend)
       ↓
   api/trigger-workflow.js
       ↓
   https://api.expo.dev (Expo servers)
       ↓
   EAS Workflow triggered!
```

The server acts as a proxy because browsers can't make direct requests to external APIs (CORS restriction).

---

## Prerequisites

### Get Expo Token

```bash
eas login
eas whoami
```

Copy the token that shows up.

Or generate at: https://expo.dev/settings/tokens

### Get Apple Team ID

```bash
eas credentials --platform ios --list
```

Look for: `Team ID: XXXXXXXXXX`

Or find at: https://developer.apple.com/account

### Ensure Credentials Are Uploaded

```bash
# Check credentials are in EAS
eas credentials --platform ios --list

# Should show:
# ✅ Distribution Certificate
# ✅ Provisioning Profile
```

If not, upload them:
```bash
eas credentials --platform ios
```

---

## Troubleshooting

### "Cannot find module 'express'"

Install dependencies:
```bash
npm install express
```

### "Port 3000 already in use"

Use a different port:
```bash
PORT=3001 node server.js
```

Then open: http://localhost:3001

### "Failed to fetch" in browser logs

1. Make sure server is running (`node server.js`)
2. Check console for actual error message
3. Verify API endpoint is correct

### "EXPO_TOKEN not valid"

- Generate new token: https://expo.dev/settings/tokens
- Log in again: `eas login`
- Check token is copied correctly (no spaces)

### Build doesn't appear in TestFlight

1. Check EAS Workflow status:
   ```bash
   eas workflow:status <RUN_ID>
   ```

2. View logs:
   ```bash
   eas workflow:logs <RUN_ID>
   ```

3. Verify credentials are uploaded:
   ```bash
   eas credentials --platform ios --list
   ```

---

## Files

| File | Purpose |
|---|---|
| `server.js` | Express server (API + static files) |
| `web-configrator/web-eas.js` | React UI component |
| `web-configrator/index.html` | HTML entry point |
| `api/trigger-workflow.js` | Backend API endpoint |

---

## Production Deployment

To deploy to production:

1. **Vercel** (recommended for serverless):
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Heroku**:
   ```bash
   heroku create
   git push heroku main
   ```

3. **Docker**:
   ```bash
   docker build -t white-label-config .
   docker run -p 3000:3000 white-label-config
   ```

---

## Next Steps

1. ✅ Start server: `node server.js`
2. ✅ Open browser: http://localhost:3000
3. ✅ Enter credentials
4. ✅ Click "Push to TestFlight"
5. ✅ Monitor build: `eas workflow:logs <RUN_ID>`
6. ✅ Check TestFlight

That's it! 🚀
