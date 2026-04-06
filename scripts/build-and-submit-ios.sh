#!/bin/bash
set -e

echo "🚀 Starting iOS Build & TestFlight Upload Pipeline"

# Environment variables
BUNDLE_ID="${BUNDLE_ID:-com.example.app}"
APP_NAME="${APP_NAME:-MyApp}"
TEAM_ID="${APPLE_TEAM_ID}"
KEY_ID="${APP_STORE_CONNECT_KEY_ID}"
ISSUER_ID="${APP_STORE_CONNECT_ISSUER_ID}"
P8_CONTENT="${APP_STORE_CONNECT_P8_BASE64}"

# Validate env vars
if [[ -z "$BUNDLE_ID" || -z "$APP_NAME" || -z "$TEAM_ID" || -z "$KEY_ID" || -z "$ISSUER_ID" || -z "$P8_CONTENT" ]]; then
  echo "❌ Missing required environment variables"
  echo "  BUNDLE_ID: ${BUNDLE_ID:-(not set)}"
  echo "  APP_NAME: ${APP_NAME:-(not set)}"
  echo "  TEAM_ID: ${TEAM_ID:-(not set)}"
  echo "  KEY_ID: ${KEY_ID:-(not set)}"
  echo "  ISSUER_ID: ${ISSUER_ID:-(not set)}"
  echo "  P8_CONTENT: ${P8_CONTENT:-(not set)}"
  exit 1
fi

# Paths
BUILD_DIR="$(pwd)/ios"
IPA_PATH="$(pwd)/build/app.ipa"
EXPORT_OPTIONS_PLIST="$(pwd)/build/ExportOptions.plist"

echo "📝 Step 1: Generating native iOS project..."
npx expo prebuild --platform ios --clean --non-interactive

echo "🔨 Step 2: Building .ipa with xcodebuild..."
mkdir -p build

# Create ExportOptions.plist for signing
mkdir -p "$BUILD_DIR"
cat > "$EXPORT_OPTIONS_PLIST" << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>teamID</key>
  <string>TEAM_ID_PLACEHOLDER</string>
  <key>method</key>
  <string>app-store</string>
  <key>stripSwiftSymbols</key>
  <true/>
  <key>thinning</key>
  <string>&lt;none&gt;</string>
</dict>
</plist>
PLIST

# Replace placeholder
sed -i '' "s/TEAM_ID_PLACEHOLDER/$TEAM_ID/g" "$EXPORT_OPTIONS_PLIST"

# Build and archive
xcodebuild \
  -workspace "$BUILD_DIR/Pods/Pods.xcodeproj/../.." \
  -scheme "dummy-whitelabel-base" \
  -configuration Release \
  -derivedDataPath "$BUILD_DIR/build" \
  -destination generic/platform=iOS \
  -archivePath "$BUILD_DIR/build/app.xcarchive" \
  archive

# Export to .ipa
xcodebuild -exportArchive \
  -archivePath "$BUILD_DIR/build/app.xcarchive" \
  -exportOptionsPlist "$EXPORT_OPTIONS_PLIST" \
  -exportPath "$BUILD_DIR/build/" \
  -allowProvisioningUpdates

if [[ ! -f "$IPA_PATH" ]]; then
  echo "❌ Failed to generate .ipa"
  exit 1
fi

echo "✅ .ipa created at: $IPA_PATH"
echo "📦 .ipa size: $(du -h "$IPA_PATH" | cut -f1)"

echo "📱 Step 3: Uploading to TestFlight..."
node "$(dirname "$0")/upload-to-testflight.js" "$IPA_PATH" "$BUNDLE_ID"

echo "🎉 Build and upload complete!"
