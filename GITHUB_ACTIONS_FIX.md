# GitHub Actions EAS Build Fix - Issues Found & Solutions

## Issues Discovered

### 1. **White-Label Script Was Deleting `ascAppId` ❌**
**Problem**: The `configure-white-label.js` script was:
- Deleting the `ascAppId` (required for TestFlight submission)
- Replacing it with `appName` and `sku` fields
- This broke the TestFlight submission step

**Solution**: Updated script to **only** update `appleTeamId`, preserving the existing submit configuration including `ascAppId`.

### 2. **Invalid EAS Build Flag ❌**
**Problem**: Workflow was using `eas build --platform ios --profile production --wait --verbose`
- `--verbose` flag doesn't exist in EAS CLI

**Solution**: Removed the `--verbose` flag

### 3. **Interactive Command in CI ❌**
**Problem**: Workflow tried to run `eas credentials` which requires interactive input
- Fails with: "Input is required, but stdin is not readable"

**Solution**: Removed this command (not needed in CI - credentials are stored on EAS servers)

## What's Fixed Now

✅ **configure-white-label.js**:
- Now preserves `ascAppId` in eas.json
- Only updates `appleTeamId` for the white-label build
- Doesn't delete critical submit configuration

✅ **build-and-submit.yml**:
- Removed invalid `--verbose` flag
- Removed interactive `eas credentials` command
- Simplified to focus on build and submit steps
- Kept `Verify EXPO Token` to ensure authentication works

✅ **eas.json**:
- Contains correct `ascAppId: "6761165135"`
- Has `appleTeamId: "2H9MCN975Q"`
- Uses `credentialsSource: "remote"` for EAS credential storage

## Expected Workflow Now

1. ✅ Checkout code
2. ✅ Setup Node.js & EAS CLI
3. ✅ Install dependencies
4. ✅ Configure white-label app (updates app.json and appleTeamId only)
5. ✅ Verify EXPO_TOKEN works
6. ✅ Validate eas.json configuration
7. ✅ Build iOS app with EAS
8. ✅ Submit to TestFlight
9. ✅ Show success message

## How to Test

Run the workflow again:
1. Go to GitHub → Actions
2. Select "Build and Submit to TestFlight"
3. Click "Run workflow"
4. Fill in inputs:
   - App Name: `Test App`
   - Bundle ID: `com.test.app`
   - Client/Organization ID: `test-client`

The build should now proceed without credential errors.

## Files Modified

1. `scripts/configure-white-label.js` - Fixed to preserve ascAppId
2. `.github/workflows/build-and-submit.yml` - Removed verbose flags and interactive commands
3. `eas.json` - Already has correct configuration

## Key Takeaway

The main issue was that the white-label configuration script was **overwriting critical TestFlight submission configuration** (`ascAppId`). By preserving the existing submit config and only updating the `appleTeamId`, the workflow can now:
- Configure the white-label app correctly
- Maintain TestFlight submission capability
- Use EAS-stored credentials (no local keys needed)
