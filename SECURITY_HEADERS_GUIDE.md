# Security Headers Implementation Guide

## Overview
This document describes the comprehensive security headers implemented to achieve PageSpeed Insights Best Practices score of 100/100.

## Headers Implemented

### 1. Content Security Policy (CSP)
**Purpose**: Prevents XSS attacks by controlling which resources can be loaded.

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://formspree.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http:; connect-src 'self' https://formspree.io https://www.googletagmanager.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://formspree.io
```

**What it does**:
- Restricts script sources to same origin, Google Tag Manager, and Formspree
- Allows inline scripts (for initial page load optimization)
- Restricts styles to same origin and Google Fonts
- Allows images from any HTTPS source (for external portfolio images)
- Prevents the site from being embedded in iframes (`frame-ancestors 'none'`)
- Restricts form submissions to same origin and Formspree

### 2. HTTP Strict Transport Security (HSTS)
**Purpose**: Forces browsers to always use HTTPS connections.

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**What it does**:
- Forces HTTPS for 2 years (63072000 seconds)
- Applies to all subdomains
- Eligible for browser preload list

### 3. X-Frame-Options
**Purpose**: Prevents clickjacking attacks.

```
X-Frame-Options: DENY
```

**What it does**:
- Completely prevents the site from being embedded in any iframe
- Stronger than `SAMEORIGIN` which would allow same-origin iframes

### 4. Cross-Origin-Opener-Policy (COOP)
**Purpose**: Isolates the browsing context from cross-origin windows.

```
Cross-Origin-Opener-Policy: same-origin
```

**What it does**:
- Prevents other origins from obtaining references to the window
- Enhances security against Spectre-like attacks

### 5. Cross-Origin-Embedder-Policy (COEP)
**Purpose**: Prevents loading of cross-origin resources without explicit permission.

```
Cross-Origin-Embedder-Policy: require-corp
```

**What it does**:
- Requires cross-origin resources to opt-in via CORS or CORP headers
- Enables powerful features like SharedArrayBuffer

### 6. Cross-Origin-Resource-Policy (CORP)
**Purpose**: Protects resources from being loaded by other origins.

```
Cross-Origin-Resource-Policy: same-origin
```

**What it does**:
- Only allows same-origin requests to load resources
- Prevents resource timing attacks

### 7. X-Content-Type-Options
**Purpose**: Prevents MIME type sniffing.

```
X-Content-Type-Options: nosniff
```

**What it does**:
- Forces browsers to respect the declared Content-Type
- Prevents execution of misidentified files

### 8. X-XSS-Protection
**Purpose**: Legacy XSS protection (for older browsers).

```
X-XSS-Protection: 1; mode=block
```

**What it does**:
- Enables XSS filter in older browsers
- Blocks page if XSS attack detected

### 9. Referrer-Policy
**Purpose**: Controls how much referrer information is shared.

```
Referrer-Policy: strict-origin-when-cross-origin
```

**What it does**:
- Sends full URL for same-origin requests
- Sends only origin for cross-origin requests
- Sends nothing when downgrading from HTTPS to HTTP

### 10. Permissions-Policy
**Purpose**: Controls which browser features can be used.

```
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**What it does**:
- Disables geolocation, microphone, and camera access
- Reduces attack surface and privacy concerns

### 11. X-Permitted-Cross-Domain-Policies
**Purpose**: Restricts Adobe Flash and PDF cross-domain requests.

```
X-Permitted-Cross-Domain-Policies: none
```

**What it does**:
- Prevents Flash/PDF from loading cross-domain content
- Legacy security measure (Flash is deprecated but still useful)

## Implementation

These headers are implemented in two files for different hosting platforms:

### For Apache Servers (.htaccess)
The `.htaccess` file includes all headers within the `<IfModule mod_headers.c>` block.

### For Modern Hosting Platforms (_headers)
The `_headers` file is used by:
- Cloudflare Pages
- Netlify
- Vercel
- Other JAMstack hosting providers

### HTML Meta Tag (Backup)
A CSP meta tag is included in the HTML `<head>` as a fallback:
```html
<meta http-equiv="Content-Security-Policy" content="...">
```

**Note**: The `frame-ancestors` directive is NOT included in the meta tag because it only works in HTTP headers, not meta tags.

## Testing Security Headers

### Online Tools
1. [Security Headers](https://securityheaders.com) - Comprehensive header checker
2. [Mozilla Observatory](https://observatory.mozilla.org) - Security and best practices checker
3. [PageSpeed Insights](https://pagespeed.web.dev) - Google's official tool

### Manual Testing
```bash
# Test headers with curl
curl -I https://hevin.design

# Look for the security headers in the response
```

## Expected Results

With these headers properly configured:
- **PageSpeed Insights Best Practices**: 100/100
- **Security Headers Grade**: A or A+
- **Mozilla Observatory**: A or A+
- Protection against: XSS, Clickjacking, MIME sniffing, Protocol downgrade attacks

## Production Considerations

1. **HTTPS Required**: Many security headers (HSTS, COOP, COEP) only work over HTTPS
2. **Testing**: Test thoroughly in staging before deploying to production
3. **CSP Violations**: Monitor console for CSP violations and adjust policy as needed
4. **HSTS Preload**: Only submit to HSTS preload list after thorough testing
5. **External Resources**: Ensure all external resources (fonts, images) are HTTPS

## Troubleshooting

### Common Issues

1. **"frame-ancestors ignored in meta element"**
   - Solution: Remove `frame-ancestors` from meta CSP tag, keep in HTTP headers only

2. **External resources blocked**
   - Solution: Add their domains to appropriate CSP directives

3. **CORS errors with external APIs**
   - Solution: Ensure external APIs return proper CORS headers

4. **Mixed content warnings**
   - Solution: Ensure all resources use HTTPS

## Maintenance

Review and update security headers:
- **Quarterly**: Check for new security best practices
- **Before major updates**: Verify new features don't conflict with CSP
- **After security audits**: Implement recommendations

## References

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [HSTS Preload List](https://hstspreload.org/)

---

**Last Updated**: November 7, 2025
**Version**: 1.0
