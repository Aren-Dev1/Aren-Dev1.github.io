# Aren CTF Blog - Complete Setup Guide

## 🚀 Blog Structure

Your GitHub Pages CTF blog is now fully set up with:

### ✅ What's Included

- **Home Page** (`index.html`) - Split into Web & OSINT sections showing latest 3 posts each
- **About Page** (`about.html`) - Your profile, skills, bio, and contact info
- **Category Pages** - `web.html` and `osint.html` for filtered post views
- **Navigation** - Sticky nav with Home, Web CTF, OSINT CTF, About links
- **Dark Cyberpunk Theme** - Complete glitch CSS with scanlines and animations
- **10 Dummy Posts** - 5 Web CTF + 5 OSINT CTF writeups with full content
- **Layouts** - Default layout with nav, Post layout for writeups
- **Config** - Complete `_config.yml` with proper settings

---

## 📁 Directory Structure

```
Aren-Dev1.github.io/
├── _config.yml                 # Jekyll configuration
├── index.html                  # Home page (Web & OSINT sections)
├── about.html                  # About page
├── web.html                    # Web CTF category page
├── osint.html                  # OSINT CTF category page
├── _layouts/
│   ├── default.html           # Main layout with navigation
│   └── post.html              # Blog post layout
├── _posts/
│   ├── web/
│   │   ├── 2025-12-15-sql-injection-login-bypass.md
│   │   ├── 2025-12-20-reflected-xss-steal-cookies.md
│   │   ├── 2025-12-25-command-injection-rce.md
│   │   ├── 2025-12-28-file-upload-bypass-webshell.md
│   │   └── 2026-01-01-idor-access-control-bypass.md
│   └── osint/
│       ├── 2025-12-16-social-media-username-tracking.md
│       ├── 2025-12-21-geolocation-photo-analysis.md
│       ├── 2025-12-26-email-osint-data-breach.md
│       ├── 2025-12-29-domain-reconnaissance-whois.md
│       └── 2026-01-02-wigle-wifi-geolocation.md
└── assets/
    └── css/
        └── glitch.css         # Cyberpunk dark theme with glitch effects
```

---

## 🎨 Theme Features

### Cyberpunk Glitch Design
- **Neon colors**: Pink (#ff0066), Cyan (#00ffff), Green (#00ff66)
- **Scanlines**: Animated CRT-style scanlines across entire page
- **Glitch slices**: Horizontal glitch effects that periodically activate
- **Post cards**: Hover effects with border color change and glow
- **Sticky navigation**: Always visible top nav bar
- **Monospace font**: Share Tech Mono from Google Fonts
- **Responsive**: Mobile-friendly design

---

## 📝 Existing Posts

### Web CTF Posts (5)
1. **SQL Injection Login Bypass** (2025-12-15) - Easy, 100 pts
2. **Reflected XSS Cookie Stealer** (2025-12-20) - Medium, 200 pts
3. **Command Injection to RCE** (2025-12-25) - Medium, 250 pts
4. **File Upload Bypass Webshell** (2025-12-28) - Medium, 300 pts
5. **IDOR Access Control** (2026-01-01) - Easy, 150 pts

### OSINT CTF Posts (5)
1. **Social Media Username Tracking** (2025-12-16) - Easy, 100 pts
2. **Geolocation Photo Analysis** (2025-12-21) - Medium, 200 pts
3. **Email OSINT Data Breach** (2025-12-26) - Medium, 250 pts
4. **Domain Reconnaissance** (2025-12-29) - Medium, 300 pts
5. **WiFi Geolocation WiGLE** (2026-01-02) - Hard, 350 pts

---

## 🔄 Git Commands to Deploy

```bash
# Stage all changes
git add .

# Commit with proper attribution
git commit -m "Complete CTF blog setup with cyberpunk theme

- Added home page with Web/OSINT split sections
- Created About page with profile information
- Implemented dark cyberpunk glitch CSS theme
- Added 10 CTF writeup posts (5 Web + 5 OSINT)
- Set up layouts and navigation
- Configured Jekyll settings

Co-Authored-By: Warp <agent@warp.dev>"

# Push to GitHub Pages
git push origin main
```

After pushing, your site will be live at: **https://Aren-Dev1.github.io**

---

## ✍️ Creating New Posts

### Web CTF Post Template

```bash
# Create new file: _posts/web/YYYY-MM-DD-title.md
```

```markdown
---
layout: post
title: "Your Challenge Title"
date: YYYY-MM-DD
category: web
tags: [tag1, tag2, tag3]
---

Brief intro to the challenge.

## Challenge Overview

**Challenge Name:** Name  
**Difficulty:** Easy/Medium/Hard  
**Points:** XXX  
**Category:** Web Exploitation

## Enumeration / Recon

What you discovered initially...

## Vulnerability Analysis / Findings

What vulnerabilities you found...

## Exploitation / Solution

How you exploited it...

## Flag

```
Flag{your_flag_here}
```

## Lessons Learned

1. Point one
2. Point two
...
```

### OSINT Post Template

Same structure, just change `category: osint` and tags.

---

## 🎯 Future Post Ideas

### Next 10 Web CTF Posts

1. **XXE (XML External Entity) Exploitation**
   - Tags: `xxe, xml, injection`
   - Exploit XXE to read local files and SSRF

2. **JWT Token Manipulation**
   - Tags: `jwt, authentication, crypto`
   - Algorithm confusion, weak secrets, claims manipulation

3. **Server-Side Template Injection (SSTI)**
   - Tags: `ssti, template, rce`
   - Jinja2, Twig, or similar template engine exploitation

4. **SSRF (Server-Side Request Forgery)**
   - Tags: `ssrf, cloud, metadata`
   - Access AWS metadata, internal services

5. **NoSQL Injection (MongoDB)**
   - Tags: `nosql, mongodb, injection`
   - Bypass authentication with NoSQL operators

6. **Insecure Deserialization**
   - Tags: `deserialization, pickle, rce`
   - Python pickle, PHP unserialize, Java deserialization

7. **GraphQL API Exploitation**
   - Tags: `graphql, api, introspection`
   - Introspection, query depth attacks, IDOR via GraphQL

8. **WebSocket Security Issues**
   - Tags: `websocket, realtime, hijacking`
   - Message manipulation, authentication bypass

9. **CSP Bypass for XSS**
   - Tags: `csp, xss, bypass`
   - Content Security Policy bypass techniques

10. **Race Condition Exploitation**
    - Tags: `race-condition, concurrency, logic`
    - Time-of-check-time-of-use vulnerabilities

### Next 10 OSINT Posts

1. **LinkedIn Intelligence Gathering**
   - Tags: `linkedin, employees, organization`
   - Company structure, employee enumeration

2. **GitHub Repository Reconnaissance**
   - Tags: `github, secrets, leaks`
   - Finding API keys, credentials in commit history

3. **Reverse Image Search Investigation**
   - Tags: `images, reverse-search, tineye`
   - Using Google, Yandex, TinEye for image OSINT

4. **Phone Number OSINT**
   - Tags: `phone, carrier, location`
   - Carrier lookup, location, associated accounts

5. **Company Infrastructure Mapping**
   - Tags: `infrastructure, shodan, censys`
   - Shodan, Censys for exposed services

6. **Wayback Machine Historical Analysis**
   - Tags: `archive, historical, wayback`
   - Finding deleted pages, old vulnerabilities

7. **Metadata Analysis Deep Dive**
   - Tags: `metadata, exif, documents`
   - PDF, Office docs, images metadata extraction

8. **Blockchain Transaction Tracing**
   - Tags: `blockchain, crypto, tracing`
   - Bitcoin/Ethereum address investigation

9. **Sock Puppet Account Creation**
   - Tags: `sockpuppet, opsec, anonymous`
   - Creating believable fake identities for research

10. **Dark Web OSINT**
    - Tags: `darkweb, tor, markets`
    - Investigating onion sites, forums, markets (ethical/legal)

---

## 🏷️ Tag Suggestions by Category

### Web CTF Tags
- `sqli`, `xss`, `rce`, `command-injection`, `xxe`
- `ssti`, `ssrf`, `idor`, `authentication`, `authorization`
- `file-upload`, `webshell`, `bypass`, `jwt`, `api`
- `graphql`, `websocket`, `race-condition`, `logic-flaw`
- `deserialization`, `nosql`, `crypto`, `csp`, `cors`

### OSINT Tags
- `social-media`, `username`, `email`, `phone`
- `geolocation`, `exif`, `metadata`, `images`
- `domain`, `whois`, `dns`, `subdomain`, `ssl`
- `wifi`, `wireless`, `wigle`, `maps`
- `github`, `linkedin`, `breach`, `leaks`
- `shodan`, `censys`, `infrastructure`, `historical`

---

## 📅 Suggested Posting Schedule

### Weekly Schedule
- **Monday**: Research and outline new post
- **Wednesday**: Write and test exploitation/solution
- **Friday**: Publish post, promote on social media

### Monthly Goals
- **Week 1**: 1 Web CTF post
- **Week 2**: 1 OSINT post
- **Week 3**: 1 Web CTF post
- **Week 4**: 1 OSINT post

**Target**: 4 posts per month = 48 posts per year

---

## 🔧 Maintenance Commands

### Test Locally (Optional - Requires Jekyll)

```bash
# Install Jekyll
gem install jekyll bundler

# Create Gemfile if needed
cat > Gemfile << EOF
source 'https://rubygems.org'
gem 'github-pages', group: :jekyll_plugins
EOF

# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# View at: http://localhost:4000
```

### Update Existing Post

```bash
# Edit the post file
nano _posts/web/2025-12-15-sql-injection-login-bypass.md

# Commit changes
git add _posts/web/2025-12-15-sql-injection-login-bypass.md
git commit -m "Update SQL injection post with additional details"
git push origin main
```

### Check Build Status

Visit: https://github.com/Aren-Dev1/Aren-Dev1.github.io/actions

---

## 🎓 Writing Tips

### Good Writeup Structure
1. **Challenge Overview** - Name, difficulty, points, description
2. **Enumeration** - What you found initially
3. **Vulnerability Analysis** - Technical details of the flaw
4. **Exploitation** - Step-by-step solution with commands/code
5. **Flag** - The captured flag in code block
6. **Lessons Learned** - Security best practices, prevention

### Best Practices
- ✅ Include actual commands and code snippets
- ✅ Add screenshots when helpful (save in `assets/images/`)
- ✅ Explain your methodology, not just the answer
- ✅ Include both vulnerable and secure code examples
- ✅ Add tool links and references
- ✅ Write clearly for beginners and experts
- ❌ Don't just list steps without explanation
- ❌ Don't skip the "why" behind the vulnerability

---

## 📱 Social Media Promotion

After publishing a post, share on:

### Twitter/X Post Template
```
🚀 New CTF writeup: [TITLE]

Category: [Web/OSINT]
Difficulty: [Easy/Medium/Hard]
Topics: [tag1, tag2, tag3]

[Brief 1-line description]

Read it here: https://Aren-Dev1.github.io/[url]

#CTF #CyberSecurity #Hacking #InfoSec
```

### LinkedIn Post Template
```
I just published a new CTF writeup on [topic]!

In this challenge, I [brief description of what you did].

Key takeaways:
• [Learning point 1]
• [Learning point 2]  
• [Learning point 3]

Check out the full writeup on my blog: [URL]

#CyberSecurity #CTF #WebSecurity #OSINT #Hacking
```

---

## 🎨 Customization

### Change Colors

Edit `assets/css/glitch.css`:

```css
:root {
  --neon-pink: #ff0066;      /* Headings, accents */
  --neon-cyan: #00ffff;      /* Links, borders */
  --neon-green: #00ff66;     /* Code, highlights */
  --neon-yellow: #ffff00;    /* Dates, metadata */
  --neon-purple: #9933ff;    /* About section */
  --dark-bg: #0a0a0a;        /* Background */
  --card-bg: #111111;        /* Post cards */
}
```

### Modify Navigation

Edit `_layouts/default.html`:

```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/web.html">Web CTF</a></li>
    <li><a href="/osint.html">OSINT CTF</a></li>
    <li><a href="/about.html">About</a></li>
    <!-- Add more links here -->
  </ul>
</nav>
```

### Adjust Posts Per Page

Edit `_config.yml`:

```yaml
paginate: 5  # Change to desired number
```

---

## ✅ Pre-Deployment Checklist

- [x] Home page shows Web & OSINT sections
- [x] About page with your information
- [x] Navigation links work correctly
- [x] Cyberpunk glitch theme applied
- [x] 5 Web CTF dummy posts created
- [x] 5 OSINT CTF dummy posts created
- [x] All posts have proper frontmatter
- [x] _config.yml configured
- [x] Layouts created (default, post)
- [x] CSS includes glitch effects

---

## 🚀 Ready to Deploy!

Your blog is **100% ready**. Run these commands to deploy:

```bash
git add .
git commit -m "Complete CTF blog setup

Co-Authored-By: Warp <agent@warp.dev>"
git push origin main
```

**Your site will be live at: https://Aren-Dev1.github.io in 2-3 minutes!**

---

## 📞 Need Help?

- Jekyll docs: https://jekyllrb.com/docs/
- GitHub Pages: https://docs.github.com/en/pages
- Markdown guide: https://www.markdownguide.org/

Happy hacking! 🎯👾
