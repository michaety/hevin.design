# Production Deployment Guide

This document explains how to deploy the optimized production version of the website.

## Production Assets

The repository includes minified versions of CSS and JavaScript for production use:

- `styles.min.css` - Minified CSS (18KB, 44% smaller than original)
- `scripts.min.js` - Minified JavaScript (3.8KB, 68% smaller than original)

## Deployment Options

### Option 1: Update index.html for Production

To use the minified versions, update the following lines in `index.html`:

**Before:**
```html
<link rel="stylesheet" href="styles.css">
<script defer src="scripts.js"></script>
```

**After:**
```html
<link rel="stylesheet" href="styles.min.css">
<script defer src="scripts.min.js"></script>
```

### Option 2: Use Build Script

Create a simple build script that copies `index.html` and replaces references:

```bash
#!/bin/bash
# build.sh
mkdir -p dist
cp index.html dist/index.html
cp privacy.html dist/privacy.html
cp styles.min.css dist/styles.css
cp scripts.min.js dist/scripts.js
echo "Production build created in dist/"
```

### Option 3: Server-Side Configuration

Configure your web server to automatically serve `.min.css` and `.min.js` files when `.css` and `.js` are requested:

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.+)\.(css|js)$ $1.min.$2 [L]
```

**Nginx:**
```nginx
location ~* \.(css|js)$ {
    try_files $uri.min $uri =404;
}
```

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

If you make changes to `styles.css` or `scripts.js`, regenerate minified versions:

```bash
# Install tools (one-time)
npm install -g terser csso-cli

# Minify CSS
csso styles.css -o styles.min.css

# Minify JavaScript
terser scripts.js -c -m -o scripts.min.js
```

## Rollback

If issues occur, simply revert `index.html` to use the non-minified versions:
```html
<link rel="stylesheet" href="styles.css">
<script defer src="scripts.js"></script>
```
