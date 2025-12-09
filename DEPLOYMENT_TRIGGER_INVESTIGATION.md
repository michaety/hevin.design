# Cloudflare Pages Deployment Trigger Investigation

**Date:** December 9, 2025  
**Issue:** Recent merge to main branch (#85) did not trigger Cloudflare Pages deployment  
**Commit:** [76b2ea0](https://github.com/michaety/hevin.design/commit/76b2ea0c9d5721d98921d74caa5b5ad0604f396b)

---

## 🔍 Investigation Summary

### Confirmed Facts

1. **Deployment Platform:** Cloudflare Pages (NOT GitHub Pages)
   - Evidence: CACHE_PURGE_INSTRUCTIONS.md references Cloudflare API
   - Evidence: DEPLOYMENT_INVESTIGATION.md mentions Cloudflare cache headers
   - Evidence: No `.github/workflows/` directory for GitHub Actions

2. **Integration Method:** Cloudflare's Built-in GitHub Integration
   - No GitHub Actions workflows for deployment
   - Direct GitHub → Cloudflare Pages connection

3. **Recent Activity:**
   - Last automatic deployment: **September 15, 2025** (commit b506d008 - "Delete CNAME")
   - Recent failed triggers: **All merges between September and December 2025** (10+ successful merges to main)
   - Problem commit: **76b2ea0** (December 9/10, 2025) - did NOT trigger deployment

4. **Workflow History Analysis:**
   - Found "pages-build-deployment" workflow (ID: 179147607)
   - This is a **GitHub Pages** workflow, not Cloudflare Pages
   - Indicates repo may have previously used GitHub Pages
   - Last run: September 15, 2025 (before switch to Cloudflare?)

---

## 🎯 Root Cause Analysis

Based on research and evidence, the deployment failure is likely caused by **ONE OR MORE** of these issues:

### Primary Suspects

#### 1. **GitHub Integration Disconnected or Misconfigured** ⚠️ HIGH PRIORITY
**Symptoms:**
- Multiple commits to main not triggering deployments
- No deployment activity since September

**Potential Causes:**
- Cloudflare Pages GitHub app lost permissions
- Repository moved to organization without re-authentication
- GitHub connection removed/revoked accidentally
- OAuth token expired or was regenerated

**How to Check:**
- Visit Cloudflare Pages Dashboard → Your Project → Settings → Builds & deployments
- Check if GitHub repository connection is active
- Verify "michaety/hevin.design" is still linked

**Resolution:**
```
1. Go to Cloudflare Dashboard → Pages → hevin.design
2. Settings → Builds & deployments
3. Check "Source" section - is GitHub repository shown?
4. If disconnected: Click "Connect to Git" and re-authorize
5. Select michaety/hevin.design repository
6. Confirm main branch is selected as production branch
```

---

#### 2. **Production Branch Not Configured as "main"** ⚠️ HIGH PRIORITY
**Symptoms:**
- Commits to main don't trigger builds
- Dashboard shows different branch as production

**Potential Causes:**
- Production branch set to "master" or another branch name
- Branch deployment controls exclude "main"

**How to Check:**
```
1. Cloudflare Dashboard → Pages → hevin.design
2. Settings → Builds & deployments → Production branch
3. Verify "main" is selected (not "master" or other)
```

**Resolution:**
```
1. Change production branch to "main"
2. Save settings
3. Manually trigger a deploy to test
```

---

#### 3. **Commit Message Skip Flags** ⚠️ MEDIUM PRIORITY
**Symptoms:**
- Specific commits don't deploy
- Other commits on same branch work fine

**Check Commit Message:**
```bash
# Examine recent commit message
git log --oneline -1 76b2ea0
```

**Result:** 
```
76b2ea0 Fix hero button hover, portfolio spacing, enquiry tier glows, and dark mode contrast issues (#85)
```

**Analysis:** ✅ No skip flags found
- No `[CI Skip]`
- No `[Skip CI]`
- No `[CF-Pages-Skip]`

---

#### 4. **GitHub Permissions Issues** ⚠️ MEDIUM PRIORITY
**Symptoms:**
- Private repository
- Cloudflare can't read push events

**Potential Causes:**
- Repository is private (confirmed: true)
- Cloudflare Pages GitHub App lacks necessary permissions
- Organization settings block third-party apps

**How to Check:**
```
1. GitHub → Settings → Applications → Installed GitHub Apps
2. Find "Cloudflare Pages"
3. Check "Repository access" includes hevin.design
4. Verify permissions include:
   - Read access to code and metadata
   - Read and write access to deployments
   - Webhooks
```

**Resolution:**
```
1. Grant Cloudflare Pages access to repository
2. Or make repository public temporarily to test
3. Ensure organization allows Cloudflare Pages app
```

---

#### 5. **Branch Build Controls Disabled** ⚠️ LOW PRIORITY
**Symptoms:**
- No builds for main branch
- Preview builds work for other branches

**How to Check:**
```
1. Cloudflare Dashboard → Pages → hevin.design
2. Settings → Builds & deployments → Branch deployments
3. Check if "Enable automatic builds" is ON
4. Verify "main" is not in exclude list
```

---

## 📋 Recommended Action Plan

### Immediate Actions (Owner: @michaety)

#### Step 1: Verify GitHub Integration (5 minutes)
```
[ ] Log into Cloudflare Dashboard
[ ] Navigate to Pages → hevin.design project
[ ] Settings → Builds & deployments
[ ] Confirm GitHub repository is connected
[ ] Note: If "Source" shows "Not connected" or no repository:
    → This is the root cause!
```

#### Step 2: Check Production Branch Configuration (2 minutes)
```
[ ] In same settings page, check "Production branch"
[ ] Verify it's set to "main" (not "master")
[ ] If wrong: Update to "main" and save
```

#### Step 3: Verify GitHub App Permissions (3 minutes)
```
[ ] Go to GitHub.com → Settings → Applications
[ ] Find "Cloudflare Pages" in Installed GitHub Apps
[ ] Click Configure
[ ] Verify hevin.design repository is selected
[ ] Ensure all required permissions are granted
```

#### Step 4: Check Branch Build Controls (2 minutes)
```
[ ] Cloudflare Dashboard → Settings → Branch deployments
[ ] Verify "Automatic deployments" is enabled
[ ] Check "main" is allowed (not blocked)
```

#### Step 5: Manual Deployment Test (5 minutes)
```
[ ] After fixing configuration issues above
[ ] Trigger manual deployment:
    - Settings → Builds & deployments
    - Click "Create deployment"
    - Select branch: main
    - Deploy
[ ] Verify deployment succeeds
[ ] Check if automatic triggers now work
```

---

## 🔧 Alternative: Deploy Hooks for Emergency

If automatic deployments can't be fixed immediately, use a **Deploy Hook** for manual/scheduled builds:

### Create Deploy Hook
```
1. Cloudflare Dashboard → Pages → hevin.design
2. Settings → Builds & deployments → Build hooks
3. Click "Add build hook"
4. Name: "Manual Production Deploy"
5. Branch: main
6. Copy webhook URL
```

### Trigger Manual Deploy
```bash
# After each merge to main:
curl -X POST https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/YOUR_HOOK_ID
```

### Automate with GitHub Actions (Optional)
Create `.github/workflows/cloudflare-deploy.yml`:
```yaml
name: Trigger Cloudflare Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cloudflare Pages Deploy
        run: |
          curl -X POST ${{ secrets.CLOUDFLARE_DEPLOY_HOOK }}
```

---

## 📊 Comparison: GitHub Pages vs Cloudflare Pages

### Evidence of Platform Transition

The repository shows signs of migrating from GitHub Pages to Cloudflare Pages:

| Feature | GitHub Pages | Cloudflare Pages | Repository Status |
|---------|--------------|------------------|-------------------|
| Workflow ID 179147607 | ✅ Yes | ❌ No | **Found** (inactive since Sept) |
| CNAME file | ✅ Uses | ⚠️ Optional | Present |
| .nojekyll file | ✅ Common | ⚠️ Optional | Not checked |
| _headers file | ❌ No | ✅ Yes | **Present** |
| Cloudflare cache docs | ❌ No | ✅ Yes | **Present** |

**Conclusion:** Repository likely migrated from GitHub Pages → Cloudflare Pages around September 2025.

---

## 🎓 Learning: Cloudflare Pages Deployment Triggers

For future reference, Cloudflare Pages automatically deploys when:

### ✅ Automatic Triggers
1. **Push to production branch** (usually "main")
2. **Merge PR to production branch**
3. **Push to any enabled preview branch**

### ❌ Does NOT Trigger
1. Commits with skip flags (`[CI Skip]`, `[CF-Pages-Skip]`)
2. Pushes to disabled branches
3. When GitHub integration is disconnected
4. When GitHub app lacks permissions
5. When branch build controls exclude the branch
6. Draft PR updates (only final merge triggers)

### 🔄 Manual Triggers
- Deploy hooks (webhooks)
- Dashboard "Create deployment" button
- GitHub Actions calling Cloudflare API

---

## 📞 Support Resources

### Cloudflare Documentation
- [GitHub Integration Docs](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Branch Deployment Controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
- [Troubleshooting Builds](https://developers.cloudflare.com/pages/configuration/git-integration/troubleshooting/)
- [Known Issues](https://developers.cloudflare.com/pages/platform/known-issues/)

### Quick Links
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [GitHub Apps Settings](https://github.com/settings/installations)
- [hevin.design Repository](https://github.com/michaety/hevin.design)

### If Issues Persist
1. Check [Cloudflare Status Page](https://www.cloudflarestatus.com/) for outages
2. Review [Cloudflare Community](https://community.cloudflare.com/c/developers/pages/) forums
3. Contact Cloudflare Support via dashboard
4. Post in #cloudflare-pages on Discord

---

## ✅ Resolution Checklist

Once fixed, verify:
```
[ ] GitHub integration is connected and active
[ ] Production branch is set to "main"
[ ] GitHub App has full permissions
[ ] Branch build controls allow "main"
[ ] Manual deploy works successfully
[ ] New commit to main triggers automatic deploy
[ ] Deployment completes successfully
[ ] Site updates are visible (after cache purge)
[ ] Automatic deployments work for future commits
```

---

## 📝 Next Steps

**For @michaety:**
1. Follow the action plan above
2. Document which step resolved the issue
3. Update this file with resolution details
4. Consider adding monitoring/alerts for future deployment failures

**For Future Maintenance:**
- Set up deployment notifications (Slack, email, Discord)
- Create deploy hook as backup trigger mechanism
- Document Cloudflare account credentials (securely)
- Add deployment status badge to README
- Consider status page for public visibility

---

**Status:** 🔍 **INVESTIGATING** - Awaiting owner verification of Cloudflare settings
**Priority:** 🔴 **HIGH** - Production deployments blocked
**Assignee:** @michaety
