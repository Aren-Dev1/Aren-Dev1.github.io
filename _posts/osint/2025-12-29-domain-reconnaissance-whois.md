---
layout: post
title: "Domain Reconnaissance and WHOIS Analysis"
date: 2025-12-29
category: osint
tags: [domain, whois, dns, subdomain]
---

Comprehensive domain investigation using WHOIS, DNS records, subdomain enumeration, and historical data analysis.

## Challenge Overview

**Challenge Name:** Domain Hunter  
**Difficulty:** Medium  
**Points:** 300  
**Category:** OSINT

Given domain `target-corp.com`, find:
1. Domain owner information
2. Hidden subdomains
3. Historical DNS records
4. Flag hidden in TXT record

## Enumeration / Recon

Target domain: `target-corp.com`

### Initial Reconnaissance

Tools prepared:
- whois
- dig / nslookup
- Sublist3r
- Amass
- Shodan
- SecurityTrails
- Wayback Machine

## Vulnerability Analysis / Findings

### WHOIS Lookup

```bash
whois target-corp.com
```

Results:
```
Domain Name: target-corp.com
Registry Domain ID: 12345678_DOMAIN_COM
Registrar: NameCheap Inc.
Creation Date: 2020-03-15T10:23:45Z
Expiry Date: 2026-03-15T10:23:45Z
Updated Date: 2025-01-10T14:32:11Z

Registrant:
  Name: [REDACTED - GDPR]
  Organization: Target Corporation
  Email: admin@target-corp.com
  
Name Servers:
  ns1.cloudflare.com
  ns2.cloudflare.com
```

Key findings:
- Organization: Target Corporation
- Admin email: admin@target-corp.com
- Uses Cloudflare for DNS
- Domain age: ~5 years

### DNS Record Enumeration

```bash
dig target-corp.com ANY
```

Standard records found:
```
A record: 104.21.45.123
MX record: mail.target-corp.com
TXT record: "v=spf1 include:_spf.google.com ~all"
NS records: ns1.cloudflare.com, ns2.cloudflare.com
```

### Subdomain Enumeration

#### Using Sublist3r

```bash
python3 sublist3r.py -d target-corp.com
```

Found subdomains:
- www.target-corp.com
- mail.target-corp.com
- dev.target-corp.com
- api.target-corp.com
- staging.target-corp.com

#### Using Amass

```bash
amass enum -d target-corp.com
```

Additional findings:
- admin.target-corp.com
- vpn.target-corp.com
- old.target-corp.com
- test.target-corp.com
- flag.target-corp.com ← Interesting!

### Investigating flag.target-corp.com

```bash
dig flag.target-corp.com TXT
```

Result:
```
flag.target-corp.com. 300 IN TXT "This is not the flag you're looking for"
```

Tried various record types:
```bash
dig flag.target-corp.com A
dig flag.target-corp.com CNAME
dig flag.target-corp.com TXT +short
```

### Certificate Transparency Logs

Searched crt.sh for SSL certificates:
```
https://crt.sh/?q=%.target-corp.com
```

Found additional subdomain:
- secret-admin.target-corp.com

### Historical DNS Records (SecurityTrails)

Checked historical DNS data:

Old TXT records from 3 months ago:
```
flag.target-corp.com TXT "Flag{dns_r3c0n_m4st3r_2025}"
```

The flag was in an old TXT record that has since been changed!

## Exploitation / Solution

### Method 1: Historical Data via SecurityTrails

Using SecurityTrails API or web interface:
1. Search for `target-corp.com`
2. View historical DNS records
3. Check TXT records history for `flag.target-corp.com`
4. Found flag in record from September 2025

### Method 2: Wayback Machine for DNS

Some DNS snapshots available through:
```
https://web.archive.org/web/*/http://flag.target-corp.com
```

Checking archived page source revealed TXT record values.

### Method 3: Shodan

Searched Shodan for historical banner data:
```
hostname:flag.target-corp.com
```

Found historical snapshot with DNS TXT record containing flag.

### Complete Intelligence Report

**Domain:** target-corp.com  
**Owner:** Target Corporation  
**Admin Contact:** admin@target-corp.com  
**Infrastructure:** Cloudflare CDN/DNS  
**Active Subdomains:** 10+  
**Historical Subdomains:** 15+  
**Email Provider:** Google Workspace  
**Security:** Basic SPF configured, no DMARC

**Interesting Findings:**
- Development/staging environments exposed
- Old subdomains still resolving
- Admin panel accessible at secret-admin subdomain
- Historical data reveals security practices

## Flag

```
Flag{dns_r3c0n_m4st3r_2025}
```

## Lessons Learned

1. **Historical data matters** - Old DNS records can reveal sensitive information
2. **Subdomain discovery** - Hidden subdomains often contain valuable intel
3. **Certificate transparency** - SSL cert logs reveal all subdomains
4. **Multiple tools needed** - No single tool finds everything
5. **WHOIS privacy important** - Registrant data can expose personal information

### Domain Security Best Practices

```
1. Enable WHOIS privacy protection
2. Implement DMARC, SPF, and DKIM for email
3. Remove or secure old/unused subdomains
4. Monitor certificate transparency logs
5. Use unique email addresses for domain registration
6. Regularly audit DNS records
7. Implement CAA records to control certificate issuance
8. Use DNSSEC for DNS integrity
```

### Secure DNS Configuration

```bind
; Remove sensitive TXT records
; flag.target-corp.com. IN TXT "Flag{...}"  ; DON'T DO THIS

; Implement security records
target-corp.com. IN CAA 0 issue "letsencrypt.org"
target-corp.com. IN CAA 0 issuewild "letsencrypt.org"
target-corp.com. IN TXT "v=spf1 include:_spf.google.com -all"
_dmarc.target-corp.com. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@target-corp.com"
```

### Tools and Commands Used

#### WHOIS Lookup
```bash
whois target-corp.com
whois -h whois.verisign-grs.com target-corp.com
```

#### DNS Enumeration
```bash
# Basic DNS lookup
dig target-corp.com
nslookup target-corp.com

# All records
dig target-corp.com ANY +noall +answer

# Specific record type
dig target-corp.com TXT
dig target-corp.com MX

# Reverse DNS
dig -x 104.21.45.123

# DNS zone transfer attempt (usually blocked)
dig @ns1.cloudflare.com target-corp.com AXFR
```

#### Subdomain Enumeration
```bash
# Sublist3r
sublist3r -d target-corp.com -o output.txt

# Amass (comprehensive)
amass enum -d target-corp.com -o amass_output.txt

# DNSRecon
dnsrecon -d target-corp.com -t std

# Fierce
fierce --domain target-corp.com

# Subfinder
subfinder -d target-corp.com
```

#### Certificate Transparency
```bash
# crt.sh via command line
curl -s "https://crt.sh/?q=%.target-corp.com&output=json" | jq -r '.[].name_value' | sort -u

# Online: https://crt.sh
# Alternative: https://censys.io
```

### Automated Reconnaissance Script

```bash
#!/bin/bash

DOMAIN=$1
OUTPUT_DIR="recon_${DOMAIN}"
mkdir -p $OUTPUT_DIR

echo "[+] Starting reconnaissance for $DOMAIN"

# WHOIS
echo "[+] WHOIS lookup..."
whois $DOMAIN > $OUTPUT_DIR/whois.txt

# DNS Records
echo "[+] DNS enumeration..."
dig $DOMAIN ANY +noall +answer > $OUTPUT_DIR/dns_records.txt

# Subdomains
echo "[+] Subdomain enumeration..."
sublist3r -d $DOMAIN -o $OUTPUT_DIR/subdomains.txt

# Certificate transparency
echo "[+] Certificate transparency..."
curl -s "https://crt.sh/?q=%.$DOMAIN&output=json" | jq -r '.[].name_value' | sort -u > $OUTPUT_DIR/crt_subdomains.txt

# Shodan
echo "[+] Checking Shodan..."
shodan search hostname:$DOMAIN > $OUTPUT_DIR/shodan.txt 2>/dev/null

echo "[+] Reconnaissance complete! Results in $OUTPUT_DIR/"
```

### Online Resources

- **WHOIS:** whois.domaintools.com, who.is
- **DNS:** dnsdumpster.com, mxtoolbox.com
- **Subdomains:** crt.sh, censys.io
- **Historical:** securitytrails.com, web.archive.org
- **Infrastructure:** shodan.io, builtwith.com
