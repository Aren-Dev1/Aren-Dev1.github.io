---
layout: post
title: "Email OSINT and Data Breach Investigation"
date: 2025-12-26
category: osint
tags: [email, breach, leaks, investigation]
---

Investigating an email address to uncover associated accounts, data breaches, and finding hidden information in leaked databases.

## Challenge Overview

**Challenge Name:** Email Detective  
**Difficulty:** Medium  
**Points:** 250  
**Category:** OSINT

Given an email address `john.smith.1985@email.com`, find:
1. All associated online accounts
2. Data breaches containing this email
3. Password used (from breaches)
4. Hidden flag in leaked data

## Enumeration / Recon

Target: `john.smith.1985@email.com`

### Initial Information Gathering

Tools arsenal:
- Have I Been Pwned (HIBP)
- DeHashed
- Hunter.io
- EmailRep.io
- Holehe
- GHunt (for Gmail)

### Email Validation

First, verify if email is active:

```bash
# Using emailrep.io API
curl emailrep.io/john.smith.1985@email.com
```

Result: Email is active and has been seen in public records.

## Vulnerability Analysis / Findings

### Have I Been Pwned Check

```
https://haveibeenpwned.com/account/john.smith.1985@email.com
```

Results showed email in multiple breaches:
- LinkedIn (2012) - 117M accounts
- Adobe (2013) - 153M accounts
- Collection #1 (2019) - 773M accounts
- Dubsmash (2019) - 162M accounts

### Account Enumeration with Holehe

```bash
holehe john.smith.1985@email.com
```

Discovered accounts on:
- Twitter/X ✓
- Instagram ✓
- GitHub ✓
- Spotify ✓
- Adobe ✓
- LinkedIn ✓
- Discord ✓

### DeHashed Search

Searched leaked databases for passwords:

```
Email: john.smith.1985@email.com
Passwords found:
- Password123! (Adobe breach)
- johnsmith1985 (LinkedIn breach)
- J0hnSm!th85 (Collection #1)
```

### Analyzing Password Patterns

Common elements across passwords:
- Uses name: john/smith
- Birth year: 1985
- Simple substitutions: o→0, i→!, S→$
- Incremental variations

### Google Dorking for Email

```
"john.smith.1985@email.com"
"john.smith.1985" @email.com
site:pastebin.com "john.smith.1985@email.com"
```

Found:
- Pastebin post with email and personal info
- Forum registration with email visible
- GitHub commit with email in author field

## Exploitation / Solution

### Step 1: Access Leaked Database

Downloaded Collection #1 breach data (publicly available from data breach indexing sites for research purposes).

### Step 2: Search Within Breach Data

```bash
grep -r "john.smith.1985@email.com" Collection1/
```

Found entry:
```
john.smith.1985@email.com:J0hnSm!th85:additional_data_field_here
```

### Step 3: Analyze Additional Data

The leak contained extra metadata field not shown on HIBP:

```
Email: john.smith.1985@email.com
Password: J0hnSm!th85
Username: jsmith85
Security Question: First pet's name
Answer: Flag{3m41l_l34k_1nv3st1g4t0r}
```

Flag was hidden in security question answer field!

### Step 4: Credential Validation (Ethical Note)

**Important:** Did NOT attempt to use credentials to access accounts. Challenge only required finding the flag in leaked data.

### Additional Intelligence Gathered

Created full profile:
- **Name:** John Smith
- **Birth Year:** 1985
- **Email:** john.smith.1985@email.com
- **Username variants:** jsmith85, johnsmith1985
- **Password patterns:** Name + year + special chars
- **Compromised accounts:** 7 major platforms
- **Security posture:** Poor (password reuse, predictable patterns)

## Flag

```
Flag{3m41l_l34k_1nv3st1g4t0r}
```

## Lessons Learned

1. **Data breaches are permanent** - Once leaked, data remains accessible forever
2. **Password reuse is critical flaw** - Same password across platforms amplifies breach impact
3. **Predictable patterns** - Name + year combinations are easily cracked
4. **Email enumeration** - Single email reveals entire digital footprint
5. **Metadata matters** - Additional fields in breaches contain valuable intel

### Security Recommendations

```
1. Use unique passwords for every account
2. Enable 2FA/MFA everywhere possible
3. Use password manager (Bitwarden, 1Password, KeePass)
4. Check haveibeenpwned.com regularly
5. Use alias emails for different services
6. Avoid personal info in passwords
7. Minimum 16 characters, random generation
8. Security questions: Use fake answers stored in password manager
```

### Password Security

```python
# Bad password patterns (DO NOT USE)
name + year: "johnsmith1985"
dictionary + number: "password123"
keyboard pattern: "qwerty123"
simple substitution: "P@ssw0rd"

# Good password example (generated)
random_password = "kR9$mN2#pL7*qW4@vX8!"

# Best practice: Use password manager to generate and store
# Example with password generator:
import secrets
import string

def generate_password(length=20):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for i in range(length))

# Result: "xK9!mQ2$nP7@rW5#vL8*zT3&"
```

### Tools Used

- **Have I Been Pwned:** https://haveibeenpwned.com
- **DeHashed:** https://dehashed.com (paid)
- **Holehe:** https://github.com/megadose/holehe
- **EmailRep.io:** https://emailrep.io
- **Hunter.io:** Email finding and verification
- **GHunt:** Gmail OSINT tool
- **h8mail:** Email OSINT and breach hunting tool

### Legal and Ethical Considerations

**Important Notice:**
- This writeup is for educational CTF purposes only
- Accessing accounts with leaked credentials is illegal
- Using this knowledge for unauthorized access violates CFAA
- Always obtain permission before testing systems
- Report vulnerabilities responsibly through proper channels

### Running h8mail for Email OSINT

```bash
# Basic email search
h8mail -t john.smith.1985@email.com

# With API keys for deeper search
h8mail -t john.smith.1985@email.com --dehashed-key YOUR_KEY

# Multiple targets
h8mail -t email1@example.com,email2@example.com

# Output to file
h8mail -t john.smith.1985@email.com -o results.txt
```
