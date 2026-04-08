# White-Label Client Setup Guide

## The Problem

When you build with the same EAS Project ID, TestFlight sees all builds as versions of the same app. To get **separate apps in TestFlight for each client**, each client needs their **own EAS account and project**.

## How It Works

### Current Setup (Shared)
```
Client A Build → EAS Project: 952733e3... (wesencedev account)
Client B Build → EAS Project: 952733e3... (same project!)
Result: Both appear as versions of "dummy-whitelabel-base" in TestFlight
```

### Correct Setup (Per-Client)
```
Client A Build → EAS Project: abc123... (Client A's account)
Client B Build → EAS Project: xyz789... (Client B's account)
Result: Completely separate apps in each client's TestFlight
```

---

## Step-by-Step Setup for Each Client

### For Client A (Example: Laundry Pro)

#### 1. Create Expo Account (Client A does this)
- Go to https://expo.dev
- Sign up with their own email
- Create a new Expo account specifically for this client

#### 2. Create EAS Project (Client A does this)
```bash
# Client A logs in
expo login

# Initialize EAS project
eas init

# This creates a new EAS project and gives you a PROJECT_ID
# Example output: "EAS Project ID: abc123...abc123"
```

#### 3. Share Project ID with You
Client A gives you their new EAS Project ID: `abc123...abc123`

#### 4. Add Client's Apple Team ID (Optional but Recommended)
If Client A has their own Apple Developer account:
- Get their Apple Team ID (2H9MCN975Q format)
- Otherwise, use your team ID

#### 5. Build in Web Configurator
```
App Name: Laundry Pro
iOS Bundle ID: com.laundryapp.pro
Android Package: com.laundryapp.pro
EAS Project ID: abc123...abc123  ← Client A's project!
GitHub PAT: your-token
```

#### 6. Build
- Click "Build to TestFlight" or "Build APK"
- App builds under **Client A's EAS project**
- Submits to **Client A's TestFlight account**
- Client A sees new app in their TestFlight!

---

### For Client B (Repeat the same process)

#### 1. Client B creates their Expo account
#### 2. Client B runs `eas init` to get their Project ID
#### 3. Client B shares their Project ID with you
#### 4. In web configurator, use Client B's Project ID
#### 5. Build → Client B gets separate TestFlight app!

---

## Important: Apple App Store Submission

For TestFlight submission to work, the client's EAS Project needs credentials for **their** Apple account:

### Option A: Client Has Their Own Apple Account (Recommended)
1. Client adds their Apple Team to their EAS Project
2. Client runs `eas credentials` to validate
3. When you build, it submits to their TestFlight

### Option B: Using Your Apple Account (For Testing)
1. You provide your Apple Team ID
2. Apps submit to your TestFlight under your team
3. Then you add Client's users as TestFlight testers
4. Later, Client can transfer app to their own Apple account

---

## Troubleshooting

### Q: I changed the EAS Project ID but TestFlight still shows old app
**A:** Make sure you're:
1. Using a **different** EAS Project ID (from a different Expo account)
2. That the new Project ID is actually different from the old one
3. Run a new build after changing the ID

### Q: How do I know if I have the right Project ID?
**A:** The Project ID should:
- Be 36 characters long (UUID format)
- Look like: `abc12345-def6-7890-ghij-klmnopqrstuv`
- Be different for each client

### Q: Can I use the same EAS project for multiple clients?
**A:** No - all builds to the same project appear as the same app. Each client needs their own.

### Q: Client doesn't have Apple Developer Account
**A:** 
1. They can use yours (you manage their TestFlight)
2. Or set up at https://developer.apple.com
3. Then add their team to their EAS Project

---

## Web Configurator Fields Explained

| Field | What It Does |
|-------|-------------|
| **App Name** | Display name in TestFlight/Play Store |
| **iOS Bundle ID** | Unique identifier for iOS app (reverse-DNS) |
| **Android Package** | Unique identifier for Android app |
| **EAS Project ID** | Which Expo account to build with |
| **GitHub PAT** | Authorization to trigger workflows |

---

## Example: Complete Flow

```
1. Client A Setup:
   - Creates Expo account: client-a@email.com
   - Runs: eas init
   - Gets: 952733e3-aaaa-bbbb-cccc-ddddddddddd1
   - Shares with you

2. In Web Configurator:
   - App Name: Laundry Pro
   - iOS Bundle: com.laundry.pro
   - Android Package: com.laundry.pro
   - EAS Project ID: 952733e3-aaaa-bbbb-cccc-ddddddddddd1
   - Click Build to TestFlight

3. Result:
   - Build uses Client A's EAS project
   - Submits to Client A's TestFlight account
   - Client A sees "Laundry Pro" app in their TestFlight
   - Completely separate from dummy-whitelabel-base
```

---

## Summary

**The Key Point:** To get separate TestFlight apps, each client needs their own EAS project. The web configurator's EAS Project ID field lets you point to different projects, but **those projects must actually be different** (owned by different Expo accounts).

This is the true white-label solution - each client is completely independent! 🎉
