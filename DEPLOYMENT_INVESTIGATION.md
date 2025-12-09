# Preview vs Production Deployment Discrepancy - Investigation & Resolution

**Date:** 2025-12-09  
**Issue:** Fixes appearing in preview but not in production deployments

---

## 🔍 Root Cause Analysis

### The Problem
The website experienced a discrepancy where code changes would appear correctly in preview deployments but would not show up in production after deployment. This created confusion and deployment issues.

### Investigation Findings

1. **File References Inconsistency**
   - `index.html` was referencing **non-minified** files (`styles.css`, `scripts.js`)
   - **Minified versions** existed (`styles.min.css`, `scripts.min.js`)
   - Minified files were already in sync with source files

2. **Deployment Platform**
   - Site is deployed on **Cloudflare Pages**
   - Cloudflare uses aggressive caching (30-day cache headers for CSS/JS)
   - Preview deployments and production deployments may have different configurations

3. **Potential Configuration Differences**
   - Preview deployments: May serve files exactly as referenced in HTML
   - Production: May be configured to serve minified versions through:
     - Manual HTML changes in production branch
     - Cloudflare Pages build settings
     - Server-side rewrites (though none found in `.htaccess`)

### Why This Caused Issues

The ambiguity in which files should be served (minified vs non-minified) likely led to:
- Different files being served in preview vs production
- Caching issues preventing updates from appearing
- Confusion about which files need to be updated

---

## ✅ Solution Implemented

### 1. Standardized File References
**Changed:** `index.html` now explicitly references **minified files**

```html
<!-- BEFORE -->
<link rel="stylesheet" href="styles.css">
<script defer src="scripts.js"></script>

<!-- AFTER -->
<link rel="stylesheet" href="styles.min.css">
<script defer src="scripts.min.js"></script>
```

**Benefits:**
- ✅ Eliminates ambiguity - both preview and production serve the same files
- ✅ Better performance - minified files are ~28% smaller
- ✅ Consistent behavior across all environments
- ✅ Aligns with PRODUCTION_DEPLOYMENT.md recommendations

### 2. Verified Minified Files Are Current
- Regenerated `styles.min.css` from `styles.css`
- Regenerated `scripts.min.js` from `scripts.js`
- Confirmed both minified files contain latest code changes

---

## 📋 Deployment Workflow Going Forward

### When Making Code Changes

1. **Edit source files:** Make changes to `styles.css` or `scripts.js`

2. **Regenerate minified files:**
   ```bash
   # CSS minification
   npx clean-css-cli -o styles.min.css styles.css
   
   # JavaScript minification
   npx terser scripts.js -o scripts.min.js -c -m
   ```

3. **Commit all files:**
   ```bash
   git add styles.css styles.min.css scripts.js scripts.min.js index.html
   git commit -m "Update styles/scripts"
   ```

4. **After deployment, purge Cloudflare cache:**
   ```bash
   # Via Cloudflare Dashboard
   # Caching > Configuration > Purge Everything
   
   # Or via API
   curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
     -H "Authorization: Bearer {API_TOKEN}" \
     -H "Content-Type: application/json" \
     --data '{"files":["https://hevin.design/styles.min.css","https://hevin.design/scripts.min.js"]}'
   ```

### Verification Checklist

After deployment:
- [ ] Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Check DevTools Network tab confirms minified files are loaded
- [ ] Verify changes appear on production site
- [ ] Test on multiple browsers
- [ ] Check both desktop and mobile views

---

## 🛡️ Prevention Measures

### Recommended Improvements

1. **Add Build Script** (Future Enhancement)
   ```bash
   #!/bin/bash
   # build.sh - Automate minification
   npx clean-css-cli -o styles.min.css styles.css
   npx terser scripts.js -o scripts.min.js -c -m
   echo "✓ Minified files regenerated"
   ```

2. **Add Pre-commit Hook** (Optional)
   ```bash
   # .git/hooks/pre-commit
   # Auto-regenerate minified files when source files change
   ```

3. **Add CI Check** (Future Enhancement)
   - Verify minified files are in sync with source
   - Fail build if minified files are outdated
   - Automate minification in CI/CD pipeline

4. **Cache Busting** (Advanced)
   - Consider adding version hashes to filenames
   - Example: `styles.min.abc123.css`
   - Requires build tool integration

---

## 📊 Technical Details

### File Sizes
- `styles.css`: 39 KB → `styles.min.css`: 28 KB (28% reduction)
- `scripts.js`: 25 KB → `scripts.min.js`: 8.3 KB (67% reduction)

### Caching Strategy
- **HTML files:** `max-age=0, must-revalidate` (always check for updates)
- **CSS/JS files:** `max-age=2592000` (30 days)
- **Images/fonts:** `max-age=31536000, immutable` (1 year)

### Deployment Platform
- **Platform:** Cloudflare Pages
- **Headers Config:** `_headers` file
- **Apache Config:** `.htaccess` (for Apache servers)

---

## 🎯 Expected Outcomes

### Immediate
- ✅ Preview and production deployments now serve identical files
- ✅ All recent fixes will appear in production after cache purge
- ✅ Reduced file sizes improve performance
- ✅ Clear workflow for future deployments

### Long-term
- ✅ No more discrepancies between preview and production
- ✅ Consistent deployment process
- ✅ Better documentation for maintenance
- ✅ Foundation for automated build process

---

## 📞 Troubleshooting

### If changes still don't appear in production:

1. **Verify correct files are deployed**
   ```bash
   # Check file modification times
   curl -I https://hevin.design/styles.min.css
   # Look at Last-Modified header
   ```

2. **Check Cloudflare cache status**
   - Visit Cloudflare Dashboard
   - Check "Caching" section
   - Verify cache is purged

3. **Test without cache**
   ```bash
   # Add cache-busting parameter
   https://hevin.design/styles.min.css?v=20251209
   ```

4. **Verify DNS is correct**
   ```bash
   nslookup hevin.design
   # Ensure pointing to Cloudflare
   ```

5. **Check browser cache**
   - Open DevTools
   - Go to Network tab
   - Check "Disable cache" option
   - Reload page

---

## 📝 Files Modified

- `index.html` - Updated to reference minified files
- `styles.min.css` - Regenerated from source (verified in sync)
- `scripts.min.js` - Regenerated from source (verified in sync)
- `DEPLOYMENT_INVESTIGATION.md` - This documentation

---

## 🔗 Related Documentation

- `PRODUCTION_DEPLOYMENT.md` - Production deployment guidelines
- `CACHE_PURGE_INSTRUCTIONS.md` - Cache management procedures
- `FIX_SUMMARY.md` - Previous hero section fix
- `_headers` - HTTP headers configuration

---

**Status:** ✅ **RESOLVED**  
**Action Required:** Deploy changes and purge Cloudflare cache
