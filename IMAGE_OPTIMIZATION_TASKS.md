# Image Optimization Tasks

## Overview
The following tasks require manual intervention or external tools to complete the image optimization requirements from the issue.

## Tasks Remaining

### 1. Create Actual Website Thumbnails
**Current State:** Portfolio section uses placeholder images from Unsplash
**Required Actions:**
- Visit each live site:
  - https://jamieandmichaelwedding.com
  - https://associatedprinting.pages.dev
  - https://prodbypiras.h3vin.workers.dev
- Capture screenshots (1200x800px recommended)
- Convert to WEBP format using tools like:
  - ImageMagick: `convert screenshot.png -quality 85 screenshot.webp`
  - Squoosh.app (online tool)
  - cwebp command: `cwebp -q 85 screenshot.png -o screenshot.webp`
- Save to `/images/` directory (create if needed)
- Update `index.html` with new image paths:
  ```html
  <img src="images/wedding-site.webp" alt="..." loading="lazy">
  ```

### 2. Optimize Existing Images to WEBP
**Current State:** Cloud graphics and logo are PNG from external hosts
**Required Actions:**
- Download current images from i.ibb.co
- Convert to WEBP format
- Host locally or on CDN
- Update references in HTML

### 3. Update Hero Background Image
**Current State:** Uses placeholder from via.placeholder.com
**Required Actions:**
- Find/create a professional hero background image
- Convert to WEBP format
- Update CSS in `styles.css` line 74:
  ```css
  background: linear-gradient(...), url('images/hero-bg.webp') no-repeat center/cover;
  ```

### 4. Run Lighthouse Audit
**After image optimization:**
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:8080 --output html --output-path ./lighthouse-report.html

# Review performance, accessibility, best practices, and SEO scores
```

**Expected Improvements:**
- Performance: Images properly optimized and lazy-loaded
- Best Practices: Modern image formats (WEBP)
- SEO: Proper alt text (already implemented)

## Notes
- All images already have `loading="lazy"` attribute
- Alt text is descriptive and specific
- Consider using a CDN for better performance
- WEBP provides 25-35% smaller file sizes vs PNG/JPEG with similar quality
