# Add GitHub Secrets - Manual Steps (1 Minute)

## Your Credentials

```
APPLE_TEAM_ID: 2H9MCN975Q
EXPO_TOKEN: Bxrhap33MRN5COvONG8PodpjEaUIIHmxg
```

---

## Step 1: Go to GitHub Secrets Page

Open this URL:
```
https://github.com/Aman120520/dummy-whitelabel-base/settings/secrets/actions
```

Or manually:
1. Go to: https://github.com/Aman120520/dummy-whitelabel-base
2. Click **Settings** tab
3. Click **Secrets and variables** (left sidebar)
4. Click **Actions**

---

## Step 2: Add EXPO_TOKEN

1. Click **"New repository secret"** button
2. Fill in:
   - **Name**: `EXPO_TOKEN`
   - **Value**: `Bxrhap33MRN5COvONG8PodpjEaUIIHmxg`
3. Click **"Add secret"**

---

## Step 3: Add APPLE_TEAM_ID

1. Click **"New repository secret"** button again
2. Fill in:
   - **Name**: `APPLE_TEAM_ID`
   - **Value**: `2H9MCN975Q`
3. Click **"Add secret"**

---

## Done!

You should now see both secrets listed:
- ✅ EXPO_TOKEN
- ✅ APPLE_TEAM_ID

---

## Next: Trigger a Build

1. Go to **Actions** tab
2. Click **"Build and Submit to TestFlight"**
3. Click **"Run workflow"**
4. Fill in:
   - App Name: `Tayyar24 Laundry`
   - Bundle ID: `com.laundry.tayyar24`
   - Client ID: `4565`
5. Click **"Run workflow"**

**Done! Build will start automatically.**

Wait ~20 minutes for the build to complete.
