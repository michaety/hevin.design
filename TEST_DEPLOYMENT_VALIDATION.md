# Test Deployment Validation Guide

**Purpose:** Validate the test deployment for hevin.design and ensure all major stack components are functioning correctly.

**Date Created:** December 9, 2025  
**Repository:** michaety/hevin.design  
**Stack:** HTML (37.1%), CSS (39.7%), JavaScript (22.1%), Shell (1.1%)

---

## 🎯 Deployment Overview

This document provides a comprehensive validation checklist for testing all major components of the hevin.design website deployment.

### Technology Stack
- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Build Tools:** Shell scripts (build.sh for minification)
- **Deployment Platform:** Cloudflare Pages (automatic from GitHub)
- **CDN & Security:** Cloudflare (global edge network)
- **Assets:** Minified CSS/JS, SVG logos, favicon suite

### Key Features to Test
1. **Static HTML Pages** - Multi-page site with navigation
2. **Responsive CSS** - Desktop, tablet, mobile layouts with dark mode
3. **Interactive JavaScript** - Carousels, forms, animations, modal interactions
4. **Asset Delivery** - Images, fonts, icons optimized for performance

---

## 📋 Pre-Deployment Checklist

### Build Verification
- [ ] Run `./build.sh` to ensure minified files are current
- [ ] Verify no build errors or warnings
- [ ] Confirm file sizes match expectations:
  - `styles.min.css`: ~30KB
  - `scripts.min.js`: ~8-9KB
- [ ] Check git status shows no uncommitted changes

### File Integrity
- [ ] All HTML files reference minified assets (styles.min.css, scripts.min.js)
- [ ] Source files (styles.css, scripts.js) are in sync with minified versions
- [ ] All image assets are present and optimized
- [ ] Favicon suite is complete (ico, svg, png variants)

### Documentation Review
- [ ] PRODUCTION_DEPLOYMENT.md is current
- [ ] POST_MERGE_CHECKLIST.md is accessible
- [ ] CACHE_PURGE_INSTRUCTIONS.md is available
- [ ] All deployment docs reflect current process

---

## 🚀 Deployment Process

### 1. Trigger Deployment
```bash
# Deployment happens automatically on push to main branch
git push origin main

# Or merge PR which triggers Cloudflare Pages deployment
```

### 2. Monitor Deployment
- [ ] Check Cloudflare Pages dashboard for deployment status
- [ ] Wait for build completion (typically 1-2 minutes)
- [ ] Note the deployment URL and timestamp
- [ ] Verify no build errors in Cloudflare logs

### 3. Post-Deployment Cache Purge
**CRITICAL:** Must purge cache due to 30-day cache headers on CSS/JS

```bash
# Option 1: Cloudflare Dashboard
# Navigate to: Caching > Configuration > Purge Everything

# Option 2: API (requires zone ID and API token)
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

- [ ] Cache purged successfully
- [ ] Wait 1-2 minutes for purge propagation

---

## ✅ Component Validation Tests

### HTML Structure Tests

#### 1. Page Loading
- [ ] **index.html** - Main homepage loads successfully
- [ ] **privacy.html** - Privacy policy page accessible
- [ ] **terms.html** - Terms of service page accessible
- [ ] All pages return HTTP 200 status
- [ ] No 404 errors for any page resources

#### 2. Meta Tags & SEO
- [ ] Page title displays correctly in browser tab
- [ ] Meta description is present and accurate
- [ ] Open Graph tags for social sharing
- [ ] Canonical URL is set correctly
- [ ] Favicon appears in browser tab
- [ ] robots.txt is accessible

#### 3. Navigation
- [ ] Logo loads and links to homepage
- [ ] All navigation menu items are visible
- [ ] Menu links navigate to correct sections
- [ ] Mobile menu toggle button appears on small screens
- [ ] Sticky navigation works on scroll

#### 4. Content Sections (index.html)
- [ ] **Hero Section** - Title, subtitle, CTA buttons visible
- [ ] **Services Section** - All 4+ service cards display
- [ ] **Portfolio Section** - Project cards with images load
- [ ] **Pricing Section** - All pricing tiers display correctly
- [ ] **About Section** - Content and skills icons visible
- [ ] **Enquiry Form** - Form fields and submit button present
- [ ] **Footer** - Links to privacy/terms, copyright notice

### CSS Styling Tests

#### 1. Asset Loading
- [ ] `styles.min.css` loads successfully (verify in DevTools Network tab)
- [ ] No `styles.css` loaded (should only use minified version)
- [ ] File size approximately 30KB
- [ ] No CSS load errors in console
- [ ] External fonts load (Google Fonts - Inter)

#### 2. Layout & Responsive Design
**Desktop (>1024px):**
- [ ] Navigation bar spans full width
- [ ] Hero section with gradient background
- [ ] Services grid shows 4 columns
- [ ] Portfolio carousel displays correctly
- [ ] Pricing cards in grid layout
- [ ] Footer multi-column layout

**Tablet (768px-1023px):**
- [ ] Navigation adapts to tablet width
- [ ] Services grid shows 2 columns
- [ ] Portfolio adjusts to tablet view
- [ ] Pricing cards stack appropriately

**Mobile (<768px):**
- [ ] Hamburger menu icon appears
- [ ] Mobile navigation menu accessible
- [ ] Services stack vertically
- [ ] Portfolio cards stack/scroll
- [ ] Pricing cards show mobile accordion
- [ ] All text is readable (no overflow)
- [ ] Touch targets are adequate size (min 44x44px)

#### 3. Dark Mode Support
- [ ] System dark mode preference detected
- [ ] Dark mode CSS variables apply correctly
- [ ] Background colors invert appropriately
- [ ] Text remains readable in dark mode
- [ ] Pricing estimator card styling correct in dark mode
- [ ] Button colors maintain visibility
- [ ] Hero gradient adapts for dark mode

#### 4. Visual Elements
- [ ] Hero gradient orb animation present
- [ ] Service card hover effects work
- [ ] Pricing card hover glows display (tier-specific colors)
- [ ] Portfolio card shadows and hover states
- [ ] Button hover animations functional
- [ ] Smooth transitions on interactive elements
- [ ] No layout shifts or broken styles

### JavaScript Functionality Tests

#### 1. Asset Loading
- [ ] `scripts.min.js` loads successfully
- [ ] No `scripts.js` loaded (should only use minified version)
- [ ] File size approximately 8-9KB
- [ ] No JavaScript errors in console
- [ ] Script loads with `defer` attribute (check Network timing)

#### 2. Navigation Functionality
- [ ] **Mobile Menu Toggle** - Opens/closes on click
- [ ] **Smooth Scrolling** - Anchor links scroll smoothly to sections
- [ ] **Active Section Highlight** - Nav items highlight on scroll
- [ ] **Sticky Header** - Navigation sticks to top on scroll
- [ ] Menu closes when clicking outside (mobile)

#### 3. Portfolio Carousel
- [ ] Carousel displays all project cards
- [ ] **Horizontal Scrolling** - Smooth scroll behavior
- [ ] **Drag/Swipe** - Works on touch devices
- [ ] **Navigation Arrows** - Prev/Next buttons functional (desktop)
- [ ] **Scroll Snap** - Cards snap to position
- [ ] **Keyboard Navigation** - Arrow keys work
- [ ] **Wheel Sensitivity** - Mouse wheel scrolls carousel
- [ ] Projects display in correct order (as per index.html)
- [ ] Project badges display correctly

#### 4. Pricing Interactions
- [ ] **Mobile Accordion** - Pricing details expand/collapse
- [ ] **Arrow Icons** - SVG arrows animate on interaction
- [ ] **Hover Effects** - Desktop hover glows work
- [ ] **Mobile Glow Animations** - In-view animations trigger on scroll
- [ ] **Intersection Observer** - Detects cards in viewport
- [ ] Package selection highlights correctly

#### 5. Enquiry Form
- [ ] Form fields accept input
- [ ] **Package Selection** - Radio buttons/options selectable
- [ ] **Price Estimator** - Displays correctly with styling
- [ ] **Form Validation** - Required fields enforced
- [ ] **Submit Button** - Functional and accessible
- [ ] Hover effects on package options work
- [ ] Form styling correct in dark mode

#### 6. Animations & Effects
- [ ] **Hero Canvas Animation** - Background particle/gradient effect
- [ ] **Intersection Observer** - Elements animate on scroll into view
- [ ] **Reduced Motion** - Respects `prefers-reduced-motion` setting
- [ ] **Smooth Scrolling** - Custom easing function (easeOutCubic)
- [ ] No animation jank or performance issues
- [ ] Animations pause when tab is inactive

#### 7. Console & Error Checking
- [ ] No JavaScript errors in console
- [ ] No console warnings about deprecated APIs
- [ ] No failed network requests
- [ ] No CORS errors
- [ ] No CSP violations

### Asset & Performance Tests

#### 1. Image Loading
- [ ] Logo (logo-transparent.svg) displays correctly
- [ ] Favicon suite loads (ico, svg, png)
- [ ] All portfolio project images load
- [ ] Service and tech stack icons display
- [ ] Images have proper alt text
- [ ] Lazy loading works for below-fold images

#### 2. Font Loading
- [ ] Google Fonts (Inter) load successfully
- [ ] Font weights render correctly (400, 500, 600, 700, 800)
- [ ] No FOUT (Flash of Unstyled Text)
- [ ] Fallback fonts display if Google Fonts fail

#### 3. Performance Metrics
**Open DevTools > Lighthouse > Run Audit**

Target Scores:
- [ ] **Performance:** >90
- [ ] **Accessibility:** >95
- [ ] **Best Practices:** >95
- [ ] **SEO:** >95

Key Metrics:
- [ ] **First Contentful Paint (FCP):** <1.8s
- [ ] **Largest Contentful Paint (LCP):** <2.5s
- [ ] **Total Blocking Time (TBT):** <200ms
- [ ] **Cumulative Layout Shift (CLS):** <0.1
- [ ] **Speed Index:** <3.4s

#### 4. Network Efficiency
- [ ] Total page size <500KB (initial load)
- [ ] CSS file loads from CDN/edge
- [ ] JavaScript file loads from CDN/edge
- [ ] Compression enabled (gzip/brotli)
- [ ] Cache headers set correctly (check _headers file)
- [ ] No unnecessary resource loads

#### 5. Security Headers
**Check in DevTools > Network > Response Headers**

- [ ] Content-Security-Policy header present
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY or SAMEORIGIN
- [ ] Referrer-Policy set
- [ ] Permissions-Policy configured
- [ ] HTTPS enforced (check _headers)

---

## 🧪 Browser Compatibility Tests

### Desktop Browsers
- [ ] **Chrome/Chromium** (Latest) - Full functionality
- [ ] **Firefox** (Latest) - Full functionality
- [ ] **Safari** (Latest) - Full functionality
- [ ] **Edge** (Latest) - Full functionality

### Mobile Browsers
- [ ] **Chrome Mobile** (Android) - Touch interactions work
- [ ] **Safari iOS** - Touch interactions work
- [ ] **Firefox Mobile** - Touch interactions work

### Testing Method
For each browser:
1. Open in private/incognito mode
2. Test all functionality sections
3. Check console for errors
4. Verify responsive layouts
5. Test touch/click interactions

---

## 📱 Device Testing

### Viewport Sizes
- [ ] **Desktop Large** (1920x1080) - Full desktop experience
- [ ] **Desktop Standard** (1366x768) - Standard desktop
- [ ] **Laptop** (1280x720) - Smaller desktop
- [ ] **Tablet Landscape** (1024x768) - iPad landscape
- [ ] **Tablet Portrait** (768x1024) - iPad portrait
- [ ] **Mobile Large** (414x896) - iPhone XR/11
- [ ] **Mobile Standard** (375x667) - iPhone SE
- [ ] **Mobile Small** (320x568) - iPhone 5

### Device-Specific Tests
**Mobile Devices:**
- [ ] Touch targets are adequate size
- [ ] Swipe gestures work on carousel
- [ ] Mobile menu opens/closes smoothly
- [ ] Form inputs zoom correctly
- [ ] No horizontal scrolling
- [ ] Viewport meta tag prevents zoom issues

**Tablet Devices:**
- [ ] Hover states work on touch (if applicable)
- [ ] Layout adapts to orientation changes
- [ ] Navigation accessible in both orientations

---

## 🔒 Security Validation

### Content Security
- [ ] No mixed content warnings (all HTTPS)
- [ ] CSP headers block unauthorized scripts
- [ ] Form submissions are secure
- [ ] No inline scripts (or properly allowed by CSP)
- [ ] External resources from trusted domains only

### Form Security
- [ ] Form has CSRF protection (if backend exists)
- [ ] Input validation on client side
- [ ] No XSS vulnerabilities in form handling
- [ ] Email validation works correctly

### Privacy & Compliance
- [ ] Privacy policy page accessible
- [ ] Terms of service page accessible
- [ ] Cookie notice if applicable
- [ ] GDPR compliance if applicable

---

## ♿ Accessibility Tests

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Skip to content link (if present)
- [ ] No keyboard traps

### Screen Reader Support
- [ ] Semantic HTML used correctly
- [ ] ARIA labels on complex widgets
- [ ] Alt text on all images
- [ ] Form labels associated with inputs
- [ ] Heading hierarchy is logical (h1-h6)

### Visual Accessibility
- [ ] Color contrast meets WCAG AA standards
- [ ] Text is resizable (200% zoom)
- [ ] No information by color alone
- [ ] Focus indicators have sufficient contrast

### ARIA & Semantic HTML
- [ ] Landmarks used correctly (nav, main, footer)
- [ ] Buttons vs links used appropriately
- [ ] aria-label on icon-only buttons
- [ ] aria-expanded on collapsible elements

---

## 📊 Validation Tools & Commands

### Manual Testing Commands

```bash
# Check HTTP status codes
curl -I https://hevin.design/
curl -I https://hevin.design/privacy.html
curl -I https://hevin.design/terms.html

# Check robots.txt
curl https://hevin.design/robots.txt

# Check sitemap
curl https://hevin.design/sitemap.xml

# Test minified assets
curl -I https://hevin.design/styles.min.css
curl -I https://hevin.design/scripts.min.js

# Check cache headers
curl -I https://hevin.design/styles.min.css | grep -i cache
curl -I https://hevin.design/scripts.min.js | grep -i cache
```

### Browser DevTools Checklist

**Network Tab:**
- [ ] Disable cache and reload
- [ ] Verify minified files load (styles.min.css, scripts.min.js)
- [ ] Check for any 404 errors
- [ ] Verify response sizes match expectations
- [ ] Check resource timing

**Console Tab:**
- [ ] No JavaScript errors
- [ ] No console warnings
- [ ] No failed resource loads

**Application Tab:**
- [ ] Check manifest.json loads
- [ ] Verify favicon presence
- [ ] Check no unwanted service workers

**Performance Tab:**
- [ ] Record page load
- [ ] Check for long tasks (>50ms)
- [ ] Identify layout shifts
- [ ] Verify no forced reflows

**Lighthouse Audit:**
- [ ] Run performance audit
- [ ] Run accessibility audit
- [ ] Run best practices audit
- [ ] Run SEO audit
- [ ] Review recommendations

---

## 🎯 Success Criteria

### Critical (Must Pass)
- ✅ All HTML pages load without errors
- ✅ Minified CSS and JS assets load correctly
- ✅ Navigation functions on all devices
- ✅ No JavaScript console errors
- ✅ Forms are functional
- ✅ Responsive layout works across viewports
- ✅ No security warnings or mixed content

### Important (Should Pass)
- ✅ Lighthouse Performance score >80
- ✅ Lighthouse Accessibility score >90
- ✅ All interactive features work (carousel, forms, menus)
- ✅ Dark mode functions correctly
- ✅ Touch interactions work on mobile
- ✅ Browser compatibility across major browsers

### Nice to Have (Recommended)
- ✅ Lighthouse Performance score >90
- ✅ Perfect Lighthouse Accessibility score (100)
- ✅ Zero console warnings
- ✅ Optimal Core Web Vitals
- ✅ Perfect SEO score

---

## 🐛 Issue Tracking

### Critical Issues
| Issue | Status | Notes |
|-------|--------|-------|
| _None currently_ | - | - |

### Non-Critical Issues
| Issue | Status | Notes |
|-------|--------|-------|
| _None currently_ | - | - |

### Resolved Issues
| Issue | Resolution | Date |
|-------|------------|------|
| _Previous issues_ | _Resolutions_ | _Dates_ |

---

## 📝 Test Execution Log

### Test Run Information
- **Date:** _______________
- **Tester:** _______________
- **Branch:** _______________
- **Deployment URL:** _______________
- **Git Commit:** _______________

### Test Results Summary
- **Total Tests:** _____
- **Passed:** _____
- **Failed:** _____
- **Skipped:** _____
- **Pass Rate:** _____%

### Critical Path Tests
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Portfolio carousel functions
- [ ] Pricing displays correctly
- [ ] Enquiry form accessible
- [ ] Mobile responsive

### Sign-Off
- **Validated By:** _______________
- **Date:** _______________
- **Status:** [ ] APPROVED [ ] REJECTED [ ] NEEDS REVISION

---

## 🔄 Continuous Testing

### For Every Deployment
1. Run `./build.sh` before committing
2. Test on staging/preview URL first
3. Validate critical path functionality
4. Check DevTools console for errors
5. Test on mobile device
6. Purge Cloudflare cache after production deploy

### Regular Testing Schedule
- **Before Each Merge:** Run full validation checklist
- **Weekly:** Lighthouse performance audit
- **Monthly:** Full browser compatibility check
- **Quarterly:** Accessibility audit with tools

---

## 📚 Related Documentation

- **PRODUCTION_DEPLOYMENT.md** - Production deployment workflow
- **POST_MERGE_CHECKLIST.md** - Post-deployment verification steps
- **CACHE_PURGE_INSTRUCTIONS.md** - Cloudflare cache management
- **DEPLOYMENT_INVESTIGATION.md** - Deployment troubleshooting
- **SECURITY_HEADERS_GUIDE.md** - Security configuration details

---

## 🆘 Troubleshooting

### Common Issues

**Problem:** Changes don't appear after deployment
- **Solution:** Purge Cloudflare cache (30-day cache on CSS/JS)
- **Verify:** Check Last-Modified headers on assets

**Problem:** JavaScript errors in console
- **Solution:** Check if scripts.min.js is current with scripts.js
- **Action:** Run `./build.sh` and redeploy

**Problem:** Mobile layout broken
- **Solution:** Check viewport meta tag, test responsive breakpoints
- **Action:** Validate CSS media queries load correctly

**Problem:** Slow performance scores
- **Solution:** Check network waterfall, verify compression enabled
- **Action:** Review Lighthouse recommendations

**Problem:** Dark mode not working
- **Solution:** Check prefers-color-scheme media query support
- **Action:** Test in browser with forced dark mode

---

## ✅ Final Validation Checklist

Before signing off on deployment:

- [ ] All critical tests passed
- [ ] No console errors on any page
- [ ] Lighthouse scores meet targets
- [ ] Tested on multiple browsers
- [ ] Tested on multiple devices
- [ ] Security headers validated
- [ ] Performance metrics acceptable
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] Cache purged post-deployment

**Deployment Status:** [ ] ✅ VALIDATED [ ] ❌ ISSUES FOUND [ ] ⏳ IN PROGRESS

---

*Last Updated: December 9, 2025*  
*Version: 1.0*
