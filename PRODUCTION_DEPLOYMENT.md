# Production Deployment Guide

This document explains how to deploy the optimized production version of the website.

## ✅ Current Configuration (As of Dec 2025)

**All HTML files now reference minified assets directly:**
- `index.html` → uses `styles.min.css` and `scripts.min.js`
- `privacy.html` → uses `styles.min.css`
- `terms.html` → uses `styles.min.css`

This ensures **preview and production deployments behave identically**.

## Production Assets

The repository includes minified versions of CSS and JavaScript for production use:

- `styles.min.css` - Minified CSS (~28KB, 28% smaller than source)
- `scripts.min.js` - Minified JavaScript (~8KB, 67% smaller than source)

## Quick Start: Making Changes

### 1. Edit Source Files
Make your changes to `styles.css` or `scripts.js`

### 2. Regenerate Minified Files
```bash
# Use the provided build script (recommended)
./build.sh

# Or manually:
npx clean-css-cli -o styles.min.css styles.css
npx terser scripts.js -o scripts.min.js -c -m
```

### 3. Commit All Files
```bash
git add styles.css styles.min.css scripts.js scripts.min.js
git commit -m "Update styles/scripts"
git push
```

### 4. Post-Deployment: Purge Cache
After deployment, purge Cloudflare cache:
```bash
# Via Cloudflare Dashboard
# Caching > Configuration > Purge Everything
```

## Build Script

A build script (`build.sh`) is provided to automate minification:

```bash
./build.sh
```

This will:
- Minify `styles.css` → `styles.min.css`
- Minify `scripts.js` → `scripts.min.js`
- Display size savings
- Remind you to commit and purge cache

## Manual Minification

If you prefer to minify manually:

```bash
# CSS minification
npx clean-css-cli -o styles.min.css styles.css

# JavaScript minification
npx terser scripts.js -o scripts.min.js -c -m
```

**Note:** No need to install packages globally - `npx` will download them as needed.

## Performance Optimizations

✅ **Completed:**
- CSS minification (44% size reduction)
- JavaScript minification (68% size reduction)
- Lazy loading on all images
- Responsive breakpoints for optimal delivery
- Prefers-reduced-motion support
- Throttled animations and effects

⚠️ **Remaining (Manual):**
- Convert images to WEBP format (see IMAGE_OPTIMIZATION_TASKS.md)
- Enable CDN for static assets
- Enable gzip/brotli compression on server
- Add caching headers

## Testing Production Build

1. Deploy to a staging environment
2. Run Lighthouse audit:
   ```bash
   lighthouse https://your-staging-url.com --output html --output-path ./report.html
   ```
3. Check for:
   - Performance score > 90
   - Accessibility score > 95
   - Best Practices score > 95
   - SEO score > 95

## Regenerating Minified Files

⚠️ **IMPORTANT:** Always regenerate minified files after editing source files!

```bash
# Recommended: Use build script
./build.sh

# Alternative: Manual commands
npx clean-css-cli -o styles.min.css styles.css
npx terser scripts.js -o scripts.min.js -c -m
```

## Deployment Workflow

1. Edit `styles.css` or `scripts.js`
2. Run `./build.sh` to regenerate minified files
3. Commit all changed files (source + minified)
4. Push to trigger deployment
5. Purge Cloudflare cache after deployment completes

## Troubleshooting

### Changes not appearing in production?
1. Verify minified files were regenerated (`git status` should show them modified)
2. Check files were committed and pushed
3. Purge Cloudflare cache (required due to 30-day cache headers)
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Preview works but production doesn't?
- This usually indicates minified files are out of sync with source
- Solution: Run `./build.sh` and commit the updated minified files

## Rollback

If issues occur, simply revert `index.html` to use the non-minified versions:
```html
<link rel="stylesheet" href="styles.css">
<script defer src="scripts.js"></script>
```
