# Deployment Process Guide

This guide explains how to ensure styling and JavaScript changes are properly deployed and applied on the live site.

## 📋 Quick Reference

**Problem:** Styling changes not appearing after deployment  
**Root Cause:** Minified files not updated + aggressive caching (30 days)  
**Solution:** Follow the complete deployment workflow below

---

## 🔄 Complete Deployment Workflow

### 1. Making Changes

When editing CSS or JavaScript:

```bash
# Edit source files
vim styles.css      # or scripts.js

# IMPORTANT: Regenerate minified files
./build.sh

# The build script will:
# ✅ Minify styles.css → styles.min.css
# ✅ Minify scripts.js → scripts.min.js
# ✅ Show size savings
# ✅ Validate output files
```

### 2. Committing Changes

```bash
# Stage ALL modified files (source + minified)
git add styles.css styles.min.css scripts.js scripts.min.js

# Commit with descriptive message
git commit -m "Update hero section styling"

# Push to trigger deployment
git push origin main
```

**💡 Pro Tip:** Install the pre-commit hook to automate minification:
```bash
git config core.hooksPath .githooks
```

### 3. CI/CD Validation

GitHub Actions will automatically:
- ✅ Check if minified files are in sync with source files
- ✅ Run local validation tests (45+ checks)
- ✅ Wait for Cloudflare Pages deployment
- ✅ Run remote validation tests (30+ checks)
- ⚠️ Remind you to purge cache

**View the workflow:** `.github/workflows/build-and-validate.yml`

### 4. Cloudflare Pages Deployment

Cloudflare Pages automatically deploys when you push to `main`:

1. **Automatic trigger** on push to main branch
2. **Build time:** ~1-2 minutes
3. **Status:** Check [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → hevin.design

**Note:** Deployment happens automatically via GitHub integration (no manual steps needed)

### 5. Cache Purge (CRITICAL!)

**🚨 THIS STEP IS MANDATORY for CSS/JS changes to appear!**

CSS and JavaScript have **30-day cache headers**. You MUST purge the cache after deployment.

#### Option A: Cloudflare Dashboard (Recommended)
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your site (hevin.design)
3. Navigate to **Caching > Configuration**
4. Click **Purge Everything**
5. Confirm the purge

#### Option B: Cloudflare API
```bash
# Purge everything (easiest)
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Or purge specific files
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "files": [
      "https://hevin.design/styles.min.css",
      "https://hevin.design/scripts.min.js",
      "https://hevin.design/index.html"
    ]
  }'
```

### 6. Verification

After cache purge, verify changes are live:

#### Browser Verification
1. **Hard refresh** (clears browser cache):
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
   - Safari: `Cmd+Option+R` (Mac)

2. **Check DevTools** (F12):
   - Go to **Network** tab
   - Enable "Disable cache"
   - Reload page
   - Verify `styles.min.css` and `scripts.min.js` are loaded
   - Check file sizes match build output

#### Automated Verification
```bash
# Run deployment validation remotely
./validate-deployment.sh https://hevin.design

# This runs 30+ tests including:
# ✅ All pages load (200 OK)
# ✅ CSS/JS files are accessible
# ✅ Proper cache headers set
# ✅ Security headers present
# ✅ No console errors
```

---

## ⚙️ Automation Features

### GitHub Actions Workflow

**File:** `.github/workflows/build-and-validate.yml`

**Triggers:**
- Push to `main` branch
- Pull requests to `main`
- Changes to CSS, JS, or HTML files

**What it does:**
1. Detects if source files changed
2. Verifies minified files were updated
3. Fails build if minified files are missing/outdated
4. Runs local validation (45 tests)
5. Waits for Cloudflare deployment
6. Runs remote validation (30+ tests)
7. Provides deployment summary with cache purge reminder

**View results:** GitHub → Actions tab

### Pre-commit Hook

**File:** `.githooks/pre-commit`

**Installation:**
```bash
git config core.hooksPath .githooks
```

**What it does:**
1. Detects when source files are committed
2. Checks if minified files are also included
3. Automatically runs `./build.sh` if needed
4. Adds minified files to commit
5. Prevents accidental commits without minified files

---

## 🛠️ Troubleshooting

### Problem: Changes not appearing after deployment

**Checklist:**
1. ✅ Did you regenerate minified files? (`./build.sh`)
2. ✅ Did you commit both source AND minified files?
3. ✅ Did Cloudflare Pages deployment complete? (check dashboard)
4. ✅ Did you purge Cloudflare cache?
5. ✅ Did you hard refresh your browser?

**Still not working?**
```bash
# Check file modification times
curl -I https://hevin.design/styles.min.css | grep Last-Modified

# View file with cache-busting parameter
open https://hevin.design/styles.min.css?v=$(date +%s)

# Verify file content remotely
curl -s https://hevin.design/styles.min.css | head -n 20
```

### Problem: Build script fails

**Common causes:**
- Node.js not installed → `node --version`
- NPM not available → `npm --version`
- Source files are empty or corrupted
- Disk space full

**Solution:**
```bash
# Install dependencies if needed
npm install -g clean-css-cli terser

# Or use npx (no global install)
npx clean-css-cli -o styles.min.css styles.css
npx terser scripts.js -o scripts.min.js -c -m
```

### Problem: Validation tests failing

**Check:**
```bash
# Run local validation to see specific failures
./local-validation.sh

# Run remote validation
./validate-deployment.sh https://hevin.design

# Check specific URLs
curl -I https://hevin.design/styles.min.css
curl -I https://hevin.design/scripts.min.js
```

### Problem: Cloudflare deployment not triggering

**Possible causes:**
1. GitHub integration disconnected
2. Production branch not set to "main"
3. Commit message has skip flag (`[CI Skip]`, `[CF-Pages-Skip]`)
4. GitHub app lacks permissions

**Check:**
- Cloudflare Dashboard → Pages → hevin.design → Settings
- Verify "Source" shows GitHub connection
- Verify "Production branch" is set to "main"
- Check deployment history for failures

**See also:** `DEPLOYMENT_TRIGGER_INVESTIGATION.md`

---

## 📊 File Size Reference

After minification, expect these approximate sizes:

| File | Source Size | Minified Size | Reduction |
|------|-------------|---------------|-----------|
| styles.css | ~41 KB | ~30 KB | 28% |
| scripts.js | ~28 KB | ~8.8 KB | 67% |

If sizes differ significantly, minified files may be outdated.

---

## 🔒 Security Notes

### Cache Headers

Current configuration (`_headers` file):

```
/*.css
  Cache-Control: public, max-age=2592000
  
/*.js
  Cache-Control: public, max-age=2592000
  
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

**Key points:**
- CSS/JS cached for 30 days (2592000 seconds)
- HTML always revalidated (no caching)
- This is why cache purge is mandatory for CSS/JS changes

### Future Enhancement: Cache Busting

Consider implementing versioned filenames:
```html
<!-- Current -->
<link rel="stylesheet" href="styles.min.css">

<!-- With cache busting -->
<link rel="stylesheet" href="styles.min.abc123.css">
```

This eliminates the need for manual cache purging.

---

## 📚 Related Documentation

- `CACHE_PURGE_INSTRUCTIONS.md` - Detailed cache management guide
- `DEPLOYMENT_INVESTIGATION.md` - Preview vs production discrepancy resolution
- `PRODUCTION_DEPLOYMENT.md` - Production deployment guidelines
- `POST_MERGE_CHECKLIST.md` - Post-merge verification steps
- `DEPLOYMENT_TRIGGER_INVESTIGATION.md` - Troubleshooting deployment triggers
- `TEST_DEPLOYMENT_VALIDATION.md` - Guide to validation scripts
- `local-validation.sh` - Local validation script (45 tests)
- `validate-deployment.sh` - Remote validation script (30+ tests)
- `build.sh` - Build script for minification

---

## ✅ Deployment Checklist

Use this checklist for every CSS/JS deployment:

```
Pre-Deployment:
[ ] Source files edited and tested locally
[ ] Build script run: ./build.sh
[ ] All files committed (source + minified)
[ ] Local validation passed: ./local-validation.sh
[ ] Pull request created and reviewed
[ ] CI/CD checks passed

Deployment:
[ ] Merged to main branch
[ ] Cloudflare Pages deployment triggered
[ ] Deployment completed successfully (check dashboard)
[ ] GitHub Actions validation passed

Post-Deployment:
[ ] Cloudflare cache purged (Caching > Purge Everything)
[ ] Browser hard refresh performed
[ ] Changes verified in DevTools (Network tab)
[ ] Remote validation passed: ./validate-deployment.sh
[ ] Tested on multiple browsers
[ ] Mobile responsive view checked

Documentation:
[ ] CHANGELOG updated (if applicable)
[ ] Deployment notes recorded
[ ] Known issues documented
```

---

## 🎯 Prevention Measures

To prevent future deployment issues:

1. **✅ Always use the build script** - Don't manually minify
2. **✅ Install pre-commit hook** - Automates minification
3. **✅ Monitor CI/CD** - Check GitHub Actions results
4. **✅ Document changes** - Note what was changed and why
5. **✅ Test thoroughly** - Use validation scripts
6. **✅ Purge cache** - Never skip this step
7. **✅ Verify deployment** - Always check the live site

---

## 📞 Support

If issues persist after following this guide:

1. Review specific error messages in:
   - GitHub Actions logs
   - Cloudflare Pages deployment logs
   - Browser DevTools console
   - Validation script output

2. Check related documentation (listed above)

3. Verify infrastructure:
   - Cloudflare Pages is online
   - GitHub repository is accessible
   - DNS is pointing to Cloudflare
   - No service outages

4. Contact:
   - Cloudflare Support (for deployment issues)
   - Check Cloudflare Community forums
   - Review GitHub Actions documentation

---

**Last Updated:** December 2025  
**Maintainer:** Hevin Design  
**Status:** Active
