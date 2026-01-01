---
layout: post
title: "Social Media Username Tracking"
date: 2025-12-16
category: osint
tags: [social-media, username, enumeration]
---

Tracking a target's digital footprint across multiple social media platforms using username OSINT techniques.

## Challenge Overview

**Challenge Name:** Ghost Hunter  
**Difficulty:** Easy  
**Points:** 100  
**Category:** OSINT

Given only a username `cyb3r_phantom`, find the target's real name, location, and a specific flag hidden in their public posts.

## Enumeration / Recon

Starting point: Username `cyb3r_phantom`

Tools used:
- Sherlock - username enumeration across platforms
- WhatsMyName - web presence lookup
- Social-Searcher - social media aggregator
- Manual investigation

### Initial Sherlock Scan

```bash
python3 sherlock cyb3r_phantom
```

Results found accounts on:
- Twitter/X: @cyb3r_phantom
- GitHub: github.com/cyb3r_phantom
- Instagram: @cyb3r_phantom (private)
- Reddit: u/cyb3r_phantom
- HackerOne: cyb3r_phantom

## Vulnerability Analysis / Findings

### Twitter/X Investigation

Profile information:
- Name: "Phantom"
- Bio: "CTF player | Bug bounty hunter | Coffee addict ☕"
- Location: Not specified in profile
- Joined: March 2024

Analyzing tweets:
- Frequently posts about CTF competitions
- References "downtown coffee shop" without location
- Posted photo with geotag accidentally enabled

### GitHub Analysis

Repositories discovered:
- ctf-writeups (public)
- tools-collection (public)  
- personal-website (public)

In commit history of personal-website repo, found:
```
commit a3f5d8c
Author: Alex Mitchell <alex.m@email.com>
Date: Tue Mar 12 2024
```

Real name identified: **Alex Mitchell**

### Reddit Investigation

Posts in subreddits:
- r/cybersecurity
- r/netsec
- r/seattle (key finding!)

Post from 3 months ago:
> "Just moved to Seattle, loving the coffee scene here!"

Location identified: **Seattle, WA**

### Cross-referencing Information

Used Google dorking to find more info:

```
"Alex Mitchell" "cyb3r_phantom" seattle
```

Found:
- LinkedIn profile (confirmed identity)
- Blog posts mentioning CTF competitions
- Conference speaker profile

## Exploitation / Solution

### Finding the Flag

Went back to Twitter/X account and performed deep dive on all tweets and replies.

In replies to a CTF competition tweet from 2 weeks ago, found encoded message:

```
Tweet: "Great challenge today! RmxhZ3t1czNybjRtM19vc2ludF9tNHN0M3J9"
```

Recognized Base64 encoding:

```bash
echo "RmxhZ3t1czNybjRtM19vc2ludF9tNHN0M3J9" | base64 -d
```

Output:
```
Flag{us3rn4m3_osint_m4st3r}
```

### Additional Intel Gathered

Created comprehensive profile:
- **Real Name:** Alex Mitchell
- **Username:** cyb3r_phantom
- **Location:** Seattle, WA
- **Occupation:** Security Researcher / Bug Bounty Hunter
- **Interests:** CTF, Coffee, Cybersecurity
- **Email:** alex.m@email.com (from GitHub commits)
- **Skills:** Web exploitation, OSINT, reverse engineering

## Flag

```
Flag{us3rn4m3_osint_m4st3r}
```

## Lessons Learned

1. **Username reuse is dangerous** - Using same username across platforms makes tracking easy
2. **Metadata in commits** - Git commits expose email addresses and real names
3. **Geotags** - Photo metadata can reveal exact locations
4. **Cross-referencing** - Information from multiple sources builds complete picture
5. **Encoding ≠ Encryption** - Base64 is encoding, not security

### OPSEC Recommendations

For maintaining privacy online:

```
1. Use different usernames for different contexts
2. Separate personal and professional identities
3. Configure git to use anonymous email:
   git config user.email "username@users.noreply.github.com"
4. Disable geotagging on photos
5. Review privacy settings on all platforms
6. Use "Have I Been Pwned" to check email exposure
7. Consider using alias emails for different services
```

### Tools Used

- **Sherlock:** https://github.com/sherlock-project/sherlock
- **WhatsMyName:** https://whatsmyname.app
- **Social-Searcher:** https://www.social-searcher.com
- **Google Dorks:** Advanced search operators
- **CyberChef:** For decoding operations
- **ExifTool:** For metadata analysis
