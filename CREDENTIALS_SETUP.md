# Fix: Credentials Not Set Up for GitHub Actions

## The Problem

GitHub Actions build fails with:
```
Distribution Certificate is not validated for non-interactive builds.
Failed to set up credentials.
Credentials are not set up. Run this command again in interactive mode.
```

This happens because your Apple credentials need to be **set up and validated** for the specific EAS project in GitHub Actions environment.

## The Solution

Run **ONE** of these commands locally to set up credentials properly:

### Option 1: Configure Credentials Interactively (Recommended)

```bash
# This will prompt you to authenticate and validate credentials
eas credentials --non-interactive
```

or 

```bash
# This will let you manage credentials
eas credentials
```

### Option 2: Run a Test Build Locally First

Run the build once locally in interactive mode:

```bash
eas build --platform ios --profile production --interactive
```

This will:
1. Prompt you to authenticate with Apple
2. Validate and store your distribution certificate
3. Save credentials on EAS servers
4. GitHub Actions can then use these stored credentials

## Why This Happens

- EAS stores credentials on their servers
- Your local builds worked because you authenticated interactively
- GitHub Actions can't prompt for input, so it needs pre-validated credentials
- The credentials need to be **validated** (not just stored)

## After Running the Fix

Once you've run the command above:
1. Commit any changes to `app.json` or `eas.json`
2. Push to GitHub
3. Run the GitHub Actions workflow again
4. It should now work!

## Debugging Info

If it still fails after running the setup command, the detailed logs in GitHub Actions will show:
- ✅ EXPO_TOKEN authentication working
- ✅ eas.json configuration valid
- ✅ Apple credentials status
- ❌ Specific credential validation error (if any)

Check the "Check Credentials Status" step in GitHub Actions for details.
