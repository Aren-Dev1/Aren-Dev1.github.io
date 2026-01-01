---
layout: post
title: "Geolocation Through Photo Analysis"
date: 2025-12-21
category: osint
tags: [geolocation, exif, imagery, maps]
---

Determining exact location from a photograph using EXIF data, visual landmarks, and geospatial intelligence.

## Challenge Overview

**Challenge Name:** Where Am I?  
**Difficulty:** Medium  
**Points:** 200  
**Category:** OSINT

Given a photograph with no obvious identifying information, determine the exact GPS coordinates and find the flag hidden at that location.

## Enumeration / Recon

Received image file: `mystery_location.jpg`

Initial observations:
- Photo shows a street corner with buildings
- Visible: Coffee shop, traffic light, street signs (partially visible)
- Time of day: Appears to be morning (shadows, lighting)
- Weather: Clear skies
- Architecture: Modern urban setting
- Visible text on storefront (partially): "...ffee & Co"

### EXIF Data Analysis

```bash
exiftool mystery_location.jpg
```

Key findings:
```
File Name: mystery_location.jpg
Date/Time Original: 2025:08:15 09:23:47
GPS Latitude: [STRIPPED]
GPS Longitude: [STRIPPED]
Camera Model: iPhone 14 Pro
Software: iOS 17.2
```

GPS coordinates were intentionally stripped from EXIF - need alternative methods.

## Vulnerability Analysis / Findings

### Visual Intelligence Gathering

**Clue 1: Storefront Sign**  
Partial text: "...ffee & Co"  
Likely: "Coffee & Co" - searched for coffee shops with this name

**Clue 2: Street Signs**  
Partially visible street sign in background  
Can make out: "...ine St" and "...d Ave"

**Clue 3: Building Architecture**  
- Modern glass buildings
- Specific brick pattern on corner building
- Unique window arrangement

**Clue 4: Traffic Infrastructure**
- Specific style of traffic light
- Crosswalk pattern
- Fire hydrant style (indicates US city)

**Clue 5: Background Elements**
- Mountain range visible in far background
- Specific skyline silhouette
- Street width and layout

### Google Dorking

```
"Coffee & Co" "Pine Street" "3rd Avenue"
```

Found multiple results pointing to Seattle, WA area.

## Exploitation / Solution

### Step 1: Narrow Down City

Mountain range in background with urban setting suggests:
- Seattle (Cascade Range)
- Denver (Rocky Mountains)
- Salt Lake City (Wasatch Range)

Given partial street names and architecture, focused on **Seattle**.

### Step 2: Street Name Analysis

Used combination of clues:
- "Pine St" is a real street in Seattle
- "3rd Ave" intersects with Pine St downtown

Located intersection: **Pine Street & 3rd Avenue, Seattle, WA**

### Step 3: Google Street View Verification

Opened Google Street View at Pine St & 3rd Ave:
```
https://goo.gl/maps/[coordinates]
```

Matched visual elements:
- ✓ Coffee shop at exact location
- ✓ Building architecture matches
- ✓ Traffic light placement identical
- ✓ Street sign positions match

Exact location confirmed!

### Step 4: Coordinate Extraction

GPS Coordinates:
```
Latitude: 47.6101° N
Longitude: 122.3353° W
```

### Step 5: Finding the Flag

Challenge instructions mentioned "flag hidden at location". Checked:

1. Google Maps reviews for "Coffee & Co" - found recent review from "ctf_admin"
2. Review text contained:
   ```
   "Great coffee! The coordinates 47.6101,-122.3353 never disappoint! Flag{g30l0c4t10n_m4st3r_2025}"
   ```

Alternative: Some challenges hide flags in:
- Geocaching databases at those coordinates
- QR codes visible in Street View
- Historical imagery (Google Earth time slider)

## Flag

```
Flag{g30l0c4t10n_m4st3r_2025}
```

## Lessons Learned

1. **Multiple verification methods** - Never rely on single data point
2. **Cross-reference visual clues** - Combine multiple identifiable features
3. **Metadata importance** - EXIF data is goldmine when available
4. **Street View is powerful** - Can verify locations worldwide
5. **Context matters** - Architecture, vegetation, infrastructure reveal geographic region

### OSINT Geolocation Methodology

```
1. Extract EXIF data (if available)
2. Identify obvious landmarks
3. Analyze environmental context:
   - Climate indicators (vegetation, weather)
   - Infrastructure style (power lines, roads, signs)
   - Architecture patterns
   - Cultural elements (language, vehicles)
4. Search for unique identifiable features
5. Use Street View for verification
6. Triangulate using multiple data points
```

### Tools Used

- **ExifTool:** Metadata extraction
- **Google Maps / Earth:** Location verification
- **Google Street View:** Ground-level verification  
- **SunCalc:** Shadow analysis for time/location
- **GeoGuessr techniques:** Visual recognition training
- **Reverse image search:** Google Images, TinEye, Yandex
- **OpenStreetMap:** Alternative mapping source
- **What3Words:** Coordinate conversion

### Pro Tips

```bash
# Extract all EXIF data
exiftool -a -G1 image.jpg

# Remove EXIF data for privacy
exiftool -all= image.jpg

# Extract GPS coordinates specifically
exiftool -gps:all image.jpg

# Bulk analysis of multiple images
exiftool -r -csv /path/to/images/ > output.csv
```

### Privacy Implications

This challenge demonstrates why you should:
- Disable geotagging on smartphone cameras
- Strip metadata before posting photos online
- Be aware of identifiable features in background
- Use tools to sanitize images before sharing
