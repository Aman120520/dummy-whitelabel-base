# Documentation Index

Complete guide to the White-Label iOS Build System.

## Start Here

### For First-Time Setup
1. **[README_BUILD_SYSTEM.md](README_BUILD_SYSTEM.md)** - Overview & quick start
2. **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step setup guide
3. **[QUICK_START.md](QUICK_START.md)** - 5-minute setup

### For Understanding the System
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - How it works (detailed)
2. **[SYSTEM_DIAGRAM.txt](SYSTEM_DIAGRAM.txt)** - Visual flowchart
3. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What changed

### For Configuration
1. **[CREDENTIALS_REFERENCE.md](CREDENTIALS_REFERENCE.md)** - Secrets & how to create them
2. **[GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)** - Detailed configuration
3. **[.env.example](.env.example)** - Environment variable template

---

## Documentation Files

### Quick Reference

| File | Purpose | Read Time |
|------|---------|-----------|
| [README_BUILD_SYSTEM.md](README_BUILD_SYSTEM.md) | Overview & quick start | 5 min |
| [QUICK_START.md](QUICK_START.md) | 5-minute setup guide | 5 min |
| [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) | Step-by-step checklist | 10 min |
| [CREDENTIALS_REFERENCE.md](CREDENTIALS_REFERENCE.md) | Secret values guide | 10 min |
| [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) | Detailed setup | 15 min |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design | 15 min |
| [SYSTEM_DIAGRAM.txt](SYSTEM_DIAGRAM.txt) | Visual flowchart | 5 min |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What changed | 10 min |

---

## By Use Case

### "I want to set up this system"
1. Start: [README_BUILD_SYSTEM.md](README_BUILD_SYSTEM.md)
2. Follow: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
3. Reference: [CREDENTIALS_REFERENCE.md](CREDENTIALS_REFERENCE.md)

### "I want to understand how it works"
1. Read: [SYSTEM_DIAGRAM.txt](SYSTEM_DIAGRAM.txt) (visual)
2. Read: [ARCHITECTURE.md](ARCHITECTURE.md) (detailed)
3. Review: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

### "Something went wrong"
1. Check: [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md#troubleshooting)
2. Review: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md#troubleshooting-checklist)
3. Verify: [CREDENTIALS_REFERENCE.md](CREDENTIALS_REFERENCE.md)

### "I want to customize it"
1. Understand: [ARCHITECTURE.md](ARCHITECTURE.md)
2. Review: Code changes in [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
3. Modify: Files listed in IMPLEMENTATION_SUMMARY.md

### "I need to deploy to production"
1. Review: [QUICK_START.md](QUICK_START.md#next-steps)
2. Configure: [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md#environment-variables)
3. Deploy: API to your hosting platform

---

## Code Files Changed

### Frontend
- **`web-configrator/web-eas.js`**
  - Simplified form (no token input needed)
  - API integration
  - Real-time logs

### Backend API
- **`api/trigger-workflow.js`**
  - GitHub Actions dispatcher
  - Input validation
  - Credential handling

### CI/CD
- **`.github/workflows/build.yml`**
  - Build pipeline
  - App Store Connect setup
  - EAS build & submit

---

## Quick Links

### GitHub & Credentials
- [Create GitHub Token](https://github.com/settings/tokens)
- [Add GitHub Secrets](https://github.com/your-org/your-repo/settings/secrets/actions)
- [Expo Token Settings](https://expo.dev/settings/tokens)
- [App Store Connect Keys](https://appstoreconnect.apple.com)

### Documentation
- [EAS Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [TestFlight Guide](https://developer.apple.com/testflight/)

---

## Key Concepts

### GitHub Secrets
Encrypted environment variables used in GitHub Actions. Add them at:
- GitHub → Settings → Secrets and variables → Actions

### GitHub Actions Workflow
Automated CI/CD pipeline that:
1. Receives workflow_dispatch event
2. Sets up environment
3. Builds iOS app with EAS
4. Submits to TestFlight

### EAS Build
Expo Application Services that:
1. Builds iOS app (.ipa)
2. Signs with provisioning profile
3. Stores build artifacts

### EAS Submit
Automatically submits build to:
1. App Store Connect
2. TestFlight
3. Ready for testers

---

## Timeline

### Initial Setup
```
GitHub Secrets setup:     5 minutes
Code review:              5 minutes
Test build:               20 minutes
Total:                    ~30 minutes
```

### Per Build
```
Click button:             0 minutes
GitHub Actions queue:     1-5 minutes
Build execution:          8-10 minutes
Submit to TestFlight:     2 minutes
Propagate to TF:          5-15 minutes
Total:                    ~15-25 minutes
```

---

## Troubleshooting Quick Links

| Issue | Reference |
|-------|-----------|
| GitHub Secrets setup | [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md#part-1-github-secrets-setup-5-minutes) |
| Build fails | [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md#troubleshooting) |
| Credentials expired | [CREDENTIALS_REFERENCE.md](CREDENTIALS_REFERENCE.md#credential-rotation--expiry) |
| App not in TestFlight | [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md#troubleshooting-checklist) |
| Environment setup | [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md#step-2-configure-environment-variables-for-local-api-server) |

---

## Getting Started (5 Steps)

1. **Read**: [README_BUILD_SYSTEM.md](README_BUILD_SYSTEM.md) (5 min)
2. **Setup**: Follow [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) (10 min)
3. **Test**: Run test build (20 min)
4. **Verify**: Check GitHub Actions + TestFlight
5. **Deploy**: Host API to production

**Total time**: ~45 minutes

---

## Need Help?

### Common Questions
- "How do I create a GitHub Token?" → [CREDENTIALS_REFERENCE.md](CREDENTIALS_REFERENCE.md#secret-6-github_token)
- "What is the build timeline?" → [ARCHITECTURE.md](ARCHITECTURE.md#execution-timeline)
- "How do I test locally?" → [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md#part-4-test-the-system)
- "What changed in the code?" → [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

### Debug Steps
1. Check GitHub Actions logs
2. Verify all GitHub Secrets
3. Review [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md#troubleshooting)
4. Check [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md#troubleshooting-checklist)

---

**Last Updated**: 2026-04-06
**Status**: Complete and ready to use
