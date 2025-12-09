# CRITICAL: Cache Purge Instructions

## ⚠️ MUST DO After Deployment

This fix addresses a **critical caching issue** where outdated CSS was being served despite source file updates.

### Root Cause
The minified CSS file (`styles.min.css`) contained **old, outdated hero styles** that didn't match the source `styles.css`. This caused hero centering and gradient issues to persist even after fixes were merged.

### What Was Fixed
1. ✅ Updated `styles.css` with correct hero centering (flex layout, 80vh, proper padding)
2. ✅ Updated gradient orb intensity (opacity 0.9, vibrant colors, smaller blur)
3. ✅ **Regenerated `styles.min.css` from source** - this is the key fix
4. ✅ Regenerated `scripts.min.js` from source for consistency

### Required Post-Deployment Actions

#### 1. Purge Cloudflare Cache
**CRITICAL:** CSS files have 30-day cache headers. You MUST purge the cache after deployment:

```bash
# Option A: Purge specific files (recommended)
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://hevin.design/styles.css","https://hevin.design/styles.min.css"]}'

# Option B: Purge everything (if needed)
# Via Cloudflare Dashboard: Caching > Configuration > Purge Everything
```

#### 2. Hard Refresh Browser
After cache purge, test on multiple browsers:
- Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Safari: `Cmd+Option+R` (Mac)

#### 3. Verify Deployment
Open DevTools and check:

```css
/* Should see in Network tab -> styles.css */
.hero {
    position: relative;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 1.5rem;
    /* ... */
}

.gradient-orb {
    width: 480px;
    height: 480px;
    border-radius: 999px;
    background:
        radial-gradient(circle at 20% 20%, rgba(140, 80, 255, 0.9), transparent 60%),
        radial-gradient(circle at 80% 20%, rgba(0, 200, 255, 0.8), transparent 60%),
        radial-gradient(circle at 50% 80%, rgba(255, 120, 200, 0.7), transparent 65%);
    filter: blur(45px);
    opacity: 0.9;
}
```

### Prevention: Build Process
Going forward, whenever `styles.css` is modified:

```bash
# Always regenerate minified files
cleancss -o styles.min.css styles.css
terser scripts.js -o scripts.min.js --compress --mangle
```

Consider adding a pre-commit hook or CI check to ensure minified files stay in sync.

### Acceptance Checklist
- [ ] Cloudflare cache purged for CSS files
- [ ] Browser hard refresh performed
- [ ] DevTools confirms `.hero` is flex-centered with 80vh
- [ ] DevTools confirms `.gradient-orb` has opacity 0.9 and vibrant colors
- [ ] Hero text is perfectly centered on desktop
- [ ] Hero text is perfectly centered on tablet
- [ ] Hero text is perfectly centered on mobile
- [ ] Gradient is clearly visible and atmospheric
- [ ] No layout shifts or misalignment

### Support
If issues persist after following these steps, check:
1. Are you viewing the correct environment (production vs staging)?
2. Is a CDN or proxy serving an older cached version?
3. Are there any override rules in `.htaccess` or `_headers`?
4. Is the browser using a service worker with its own cache?
