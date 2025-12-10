# Production Validation Checklist

**Quick reference for validating production deployments**

---

## 🚀 Pre-Deployment Validation

Run before pushing to production:

```bash
# 1. Run build script
./build.sh

# 2. Run local validation (45 tests)
./local-validation.sh

# 3. Verify working tree is clean
git status

# 4. Commit and push
git add .
git commit -m "Your commit message"
git push origin main
```

**Expected Result:** All tests should pass (45/45)

---

## 🔍 Post-Deployment Validation

Run after Cloudflare Pages deployment completes:

### Step 1: Purge Cache (CRITICAL! ⚠️)
- **Why:** CSS/JS files have 30-day cache headers
- **How:** Cloudflare Dashboard > Caching > Purge Everything
- **Wait:** 1-2 minutes for propagation

### Step 2: Remote Validation
```bash
./validate-deployment.sh https://hevin.design
```

**Expected Result:** All tests should pass (30+/30+)

### Step 3: Manual Browser Testing

#### Desktop Testing
- [ ] Open https://hevin.design in Chrome
- [ ] Open in Firefox
- [ ] Open in Safari (if available)
- [ ] Open in Edge

#### What to Test:
- [ ] Homepage loads without errors
- [ ] Navigation menu works
- [ ] Portfolio carousel scrolls smoothly
- [ ] Pricing cards display correctly
- [ ] Enquiry form is functional
- [ ] Mobile menu toggle works (resize browser)
- [ ] Dark mode switches correctly
- [ ] All images load
- [ ] No console errors (F12 > Console)

#### Mobile Testing
- [ ] Open on iPhone (Safari)
- [ ] Open on Android (Chrome)
- [ ] Test touch interactions on carousel
- [ ] Test mobile menu
- [ ] Check responsive layout

### Step 4: Performance Check
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Run audit on:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

**Target Scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: >95

---

## ✅ Quick Test Commands

### Test Homepage
```bash
curl -I https://hevin.design/
# Expected: HTTP/2 200
```

### Test CSS
```bash
curl -I https://hevin.design/styles.min.css
# Expected: HTTP/2 200, Content-Type: text/css
```

### Test JavaScript
```bash
curl -I https://hevin.design/scripts.min.js
# Expected: HTTP/2 200, Content-Type: application/javascript
```

### Check Cache Headers
```bash
curl -I https://hevin.design/styles.min.css | grep -i cache
curl -I https://hevin.design/scripts.min.js | grep -i cache
# Expected: Cache-Control headers present
```

---

## 🐛 Common Issues & Solutions

### Issue: Changes Don't Appear
**Solution:** Purge Cloudflare cache (30-day headers on CSS/JS)

### Issue: JavaScript Errors
**Solution:** 
1. Check if scripts.min.js is current: `./build.sh`
2. Commit and redeploy
3. Purge cache

### Issue: CSS Styling Broken
**Solution:**
1. Check if styles.min.css is current: `./build.sh`
2. Commit and redeploy
3. Purge cache

### Issue: Mobile Layout Broken
**Solution:** Check responsive breakpoints and viewport meta tag

---

## 📊 Success Criteria

### Critical (Must Pass) ✅
- All HTML pages load (200 OK)
- Minified CSS and JS load correctly
- Navigation works on all devices
- No JavaScript console errors
- Forms are functional
- Responsive layout works

### Important (Should Pass) ⚠️
- Lighthouse Performance >80
- Lighthouse Accessibility >90
- All interactive features work
- Dark mode functions correctly
- Touch interactions work on mobile

---

## 📝 Test Log Template

```
Date: ___________
Tester: ___________
Branch: ___________
Commit: ___________

Pre-Deployment:
[ ] Local validation passed (45/45)
[ ] Build script executed successfully
[ ] Working tree clean

Post-Deployment:
[ ] Cache purged
[ ] Remote validation passed (30+/30+)
[ ] Manual testing completed
[ ] Performance audit passed

Issues Found:
___________

Status: [ ] ✅ APPROVED [ ] ❌ ISSUES [ ] ⏳ IN PROGRESS
```

---

## 🔗 Related Documentation

- **TEST_DEPLOYMENT_VALIDATION.md** - Comprehensive testing guide
- **DEPLOYMENT_TEST_REPORT.md** - Latest test report
- **CACHE_PURGE_INSTRUCTIONS.md** - Cache management details
- **PRODUCTION_DEPLOYMENT.md** - Deployment workflow

---

**Last Updated:** December 10, 2025
