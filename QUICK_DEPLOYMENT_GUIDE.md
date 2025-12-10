# Quick Deployment Guide

**🚨 CRITICAL: Read this before deploying CSS/JS changes!**

## The Problem

Styling changes not appearing after deployment due to:
1. Minified files not updated
2. 30-day cache headers on CSS/JS
3. Manual cache purge required

## The Solution (4 Steps)

### 1️⃣ Edit & Build
```bash
# Edit your files
vim styles.css

# ALWAYS run build script
./build.sh
```

### 2️⃣ Commit Everything
```bash
# Commit BOTH source and minified files
git add styles.css styles.min.css
git commit -m "Update styles"
git push
```

### 3️⃣ Wait for Deployment
- Cloudflare Pages auto-deploys (~2 minutes)
- Check: [Cloudflare Dashboard](https://dash.cloudflare.com/)

### 4️⃣ Purge Cache (MANDATORY!)
1. Log into Cloudflare Dashboard
2. Go to **Caching > Configuration**
3. Click **Purge Everything**
4. Hard refresh browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)

## Automation

### Pre-commit Hook (Recommended)
Automatically runs build script when you commit source files:
```bash
git config core.hooksPath .githooks
```

### GitHub Actions
Automatically validates builds and reminds you to purge cache.

## Need Help?

See `DEPLOYMENT_PROCESS_GUIDE.md` for complete documentation.

---

**TL;DR:** Edit → `./build.sh` → Commit all → Push → Purge cache → Done! ✅
