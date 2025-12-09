# Post-Merge Checklist

This checklist must be completed after merging the PR to ensure the fix is fully deployed to production.

---

## ✅ Pre-Deployment Verification

- [x] All HTML files reference minified assets (styles.min.css, scripts.min.js)
- [x] Minified files are in sync with source files
- [x] Build script (build.sh) is executable and tested
- [x] Documentation is complete and accurate
- [x] Code review completed and feedback addressed
- [x] Security checks passed (CodeQL)

---

## 📋 Post-Merge Actions

### 1. Merge the Pull Request
- [ ] Review the PR one final time
- [ ] Merge the PR into the main branch
- [ ] Verify merge was successful

### 2. Wait for Deployment
- [ ] Check Cloudflare Pages dashboard for deployment status
- [ ] Wait for deployment to complete (typically 1-2 minutes)
- [ ] Note the deployment URL

### 3. **CRITICAL: Purge Cloudflare Cache**

**This step is mandatory!** CSS and JavaScript have 30-day cache headers.

**Option A: Via Cloudflare Dashboard (Recommended)**
```
1. Log into Cloudflare Dashboard
2. Select your site (hevin.design)
3. Go to Caching > Configuration
4. Click "Purge Everything"
5. Confirm the purge
```

**Option B: Via Cloudflare API**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

**Option C: Purge Specific Files**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"files":[
    "https://hevin.design/styles.min.css",
    "https://hevin.design/scripts.min.js",
    "https://hevin.design/index.html",
    "https://hevin.design/privacy.html",
    "https://hevin.design/terms.html"
  ]}'
```

- [ ] Cache purged successfully
- [ ] Wait 1-2 minutes for purge to propagate

### 4. Verify Production Deployment

**Test on Multiple Browsers:**

**Chrome/Edge:**
- [ ] Open https://hevin.design in Incognito/Private mode
- [ ] Or hard refresh: `Ctrl+Shift+R` (Win) or `Cmd+Shift+R` (Mac)
- [ ] Verify page loads correctly

**Firefox:**
- [ ] Open https://hevin.design in Private Window
- [ ] Or hard refresh: `Ctrl+F5` (Win) or `Cmd+Shift+R` (Mac)
- [ ] Verify page loads correctly

**Safari:**
- [ ] Open https://hevin.design in Private Window
- [ ] Or hard refresh: `Cmd+Option+R` (Mac)
- [ ] Verify page loads correctly

### 5. Technical Verification

**Open DevTools (F12) on production site:**

- [ ] Go to Network tab
- [ ] Check "Disable cache" option
- [ ] Reload the page
- [ ] Verify the following files are loaded:
  - [ ] `styles.min.css` (should be ~28KB)
  - [ ] `scripts.min.js` (should be ~8KB)
  - [ ] No `styles.css` or `scripts.js` requests
- [ ] Check Console tab for errors (should be none)

### 6. Visual Verification

- [ ] Hero section displays correctly
- [ ] Navigation works
- [ ] All sections load properly
- [ ] Pricing cards display correctly
- [ ] Portfolio carousel functions
- [ ] Mobile responsive layout works
- [ ] No layout breaks or missing styles
- [ ] All animations work (if not in reduced-motion mode)

### 7. Test Preview Environment

To verify preview and production are now consistent:

- [ ] Create a test branch with a small change
- [ ] Open a PR to generate preview deployment
- [ ] Verify preview uses the same minified files
- [ ] Confirm preview and production look identical

---

## 🎯 Success Criteria

The deployment is successful when:

- ✅ Production site loads without errors
- ✅ All styles and functionality work correctly
- ✅ DevTools confirms minified files are loaded
- ✅ Recent fixes (from previous PRs) are visible
- ✅ No console errors
- ✅ Page loads quickly (performance maintained)
- ✅ Mobile and desktop views work

---

## 🔧 Troubleshooting

### If changes don't appear on production:

1. **Verify cache was purged**
   - Check Cloudflare Dashboard for purge confirmation
   - Try purging again if needed

2. **Clear browser cache**
   - Close all browser tabs
   - Clear browser cache completely
   - Restart browser
   - Try again

3. **Check deployment status**
   - Verify deployment completed successfully
   - Check for any error messages in Cloudflare Pages

4. **Verify correct files were deployed**
   ```bash
   # Check file modification time
   curl -I https://hevin.design/styles.min.css
   # Look at Last-Modified header
   ```

5. **Test without cache**
   - Add query parameter: `https://hevin.design/?v=test123`
   - This bypasses some caching layers

6. **Check for service worker**
   - Open DevTools > Application tab
   - Check for registered service workers
   - Unregister any service workers
   - Reload page

### If issues persist:

1. Check DNS is pointing to Cloudflare correctly
2. Verify no additional CDN or proxy in front of Cloudflare
3. Review `.htaccess` for any redirects or rewrites
4. Check Cloudflare Page Rules for conflicts
5. Contact Cloudflare support if caching issues persist

---

## 📝 Future Deployments

**Remember for all future CSS/JS changes:**

1. Edit source files (`styles.css` or `scripts.js`)
2. Run `./build.sh` to regenerate minified files
3. Commit ALL files (source + minified)
4. Push to trigger deployment
5. Purge Cloudflare cache after deployment
6. Verify changes on production

**Don't forget:** The build script must be run for every CSS or JavaScript change!

---

## 📞 Support

If you encounter any issues during deployment:

1. Review DEPLOYMENT_INVESTIGATION.md for detailed troubleshooting
2. Check PRODUCTION_DEPLOYMENT.md for workflow documentation
3. Review RESOLUTION_SUMMARY.md for complete fix details
4. Check Cloudflare Pages deployment logs
5. Verify all steps in this checklist were completed

---

**Completion Date:** _______________  
**Verified By:** _______________  
**All Checks Passed:** [ ] Yes [ ] No

---

## 🎉 Success!

Once all items are checked off, the preview vs production discrepancy issue is fully resolved!

Future deployments will be consistent between preview and production environments.
