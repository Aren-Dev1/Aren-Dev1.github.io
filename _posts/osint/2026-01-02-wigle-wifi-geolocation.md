---
layout: post
title: "WiFi Geolocation Using WiGLE Database"
date: 2026-01-02
category: osint
tags: [wifi, geolocation, wigle, wireless]
---

Geolocating a target using wireless network information and the WiGLE WiFi database.

## Challenge Overview

**Challenge Name:** WiFi Tracker  
**Difficulty:** Hard  
**Points:** 350  
**Category:** OSINT

Given a list of WiFi BSSIDs (MAC addresses), determine:
1. Physical location where these networks are found
2. Name of the building/establishment
3. Find the flag hidden in a nearby location

**Provided BSSIDs:**
```
A4:11:62:F3:2A:B0
B8:27:EB:45:C1:3F
00:23:69:8D:47:2E
```

## Enumeration / Recon

### Understanding BSSIDs

BSSID (Basic Service Set Identifier) = MAC address of wireless access point

Key insights:
- Each WiFi access point has unique MAC address
- Wardriving databases map BSSIDs to GPS coordinates
- Multiple BSSIDs in same area = more accurate location
- OUI (first 3 octets) identifies manufacturer

### Tools and Resources

- WiGLE (Wireless Geographic Logging Engine)
- Mylnikov GEO API
- OpenWiFi Map
- Google Location Services API
- Manufacturer OUI lookup

## Vulnerability Analysis / Findings

### OUI Manufacturer Lookup

```bash
# Check manufacturer
A4:11:62 → TP-Link Technologies
B8:27:EB → Raspberry Pi Foundation
00:23:69 → Cisco Systems
```

Presence of Raspberry Pi suggests:
- Possible IoT device
- Custom setup
- Maker space or tech environment

### WiGLE Database Search

Registered WiGLE account and searched each BSSID:

#### BSSID 1: A4:11:62:F3:2A:B0
```
Location: 47.6205° N, 122.3493° W
First Seen: 2024-08-10
Last Seen: 2025-12-15
SSID: "TechHub_Guest"
Network Type: Infrastructure
Encryption: WPA2
Signal Strength: Strong
```

#### BSSID 2: B8:27:EB:45:C1:3F
```
Location: 47.6206° N, 122.3492° W  
First Seen: 2024-09-01
SSID: "RPi_IoT_Lab"
Network Type: Infrastructure
Encryption: WPA2
```

#### BSSID 3: 00:23:69:8D:47:2E
```
Location: 47.6204° N, 122.3494° W
First Seen: 2024-07-20
SSID: "Cisco_Office"
Network Type: Infrastructure  
Encryption: WPA2-Enterprise
```

### Triangulation

All three BSSIDs cluster around:
**Latitude: 47.6205° N**  
**Longitude: 122.3493° W**

Accuracy: ~30 meters

### Google Maps Investigation

Entered coordinates into Google Maps:

Location identified: **Seattle Tech Hub - Startup Incubator**  
Address: 1234 Tech Drive, Seattle, WA 98101

Street View revealed:
- Modern office building
- Co-working space signage
- Multiple tech companies

### Cross-referencing SSIDs

- "TechHub_Guest" = Public guest network
- "RPi_IoT_Lab" = Internal IoT lab
- "Cisco_Office" = Corporate office network

This confirms it's a tech facility with:
- Public access areas
- Development labs
- Office spaces

## Exploitation / Solution

### Step 1: Identify Exact Building

Using triangulated coordinates:
```
47.6205° N, 122.3493° W
```

Building: **Seattle Innovation Center**  
3rd Floor: Tech Hub Co-working Space

### Step 2: Search for Additional Clues

Checked WiGLE for ALL networks in that building:

Found additional network:
```
SSID: "CTF_Challenge_2026"
BSSID: DC:A6:32:11:22:33
Location: Same coordinates
```

### Step 3: SSID Analysis

Searched for "CTF_Challenge_2026" on:
- Twitter/X
- Reddit
- CTF forums
- GitHub

Found tweet from @TechHub_Seattle:
```
"New CTF challenge live! Connect to CTF_Challenge_2026 
or visit techub-seattle.com/ctf for details. 
Flag format: Flag{wifi_location_here}"
```

### Step 4: Retrieve Flag

Visited: techub-seattle.com/ctf

Challenge page revealed:
```
"You found the location! The flag is:"
Flag{s34ttl3_t3ch_hub_w1gl3_pwn3d}
```

### Alternative Method: Mylnikov API

Could also use Mylnikov Geolocation API:

```bash
curl "https://api.mylnikov.org/geolocation/wifi?v=1.1&data=open&bssid=A4:11:62:F3:2A:B0"
```

Returns JSON with coordinates:
```json
{
  "result": 200,
  "data": {
    "lat": 47.6205,
    "lon": -122.3493,
    "range": 30
  }
}
```

## Flag

```
Flag{s34ttl3_t3ch_hub_w1gl3_pwn3d}
```

## Lessons Learned

1. **WiFi is trackable** - Every access point can be geolocated via wardriving databases
2. **MAC addresses are unique identifiers** - BSSIDs reveal physical locations
3. **Multiple data points increase accuracy** - Triangulation from multiple BSSIDs
4. **Public databases exist** - WiGLE, Mylnikov, others track millions of networks
5. **Privacy implications** - Home WiFi networks can reveal your address

### WiFi Privacy Recommendations

```
1. Don't broadcast SSID (hidden network)
2. Use random MAC addresses (available on modern devices)
3. Disable WiFi when not in use
4. Understand your router's MAC is public
5. Consider MAC address randomization
6. Be aware wardriving databases exist
7. Use wired connections for sensitive activities
```

### How Wardriving Works

```
1. Person drives/walks with WiFi-enabled device
2. Device logs all visible WiFi networks
3. GPS coordinates recorded for each network
4. Data uploaded to databases (WiGLE, etc.)
5. Over time, database becomes comprehensive
6. Anyone can query database for location data
```

### Tools Used

#### WiGLE Search
```bash
# Via website: wigle.net
# API (requires key):
curl -u API_NAME:API_TOKEN \
  "https://api.wigle.net/api/v2/network/search?netid=A4:11:62:F3:2A:B0"
```

#### Mylnikov API
```bash
# Free geolocation API
curl "https://api.mylnikov.org/geolocation/wifi?v=1.1&data=open&bssid=A4:11:62:F3:2A:B0"
```

#### OUI Lookup
```bash
# Check manufacturer from MAC
curl "https://api.macvendors.com/A4:11:62:F3:2A:B0"
```

### Creating Wardriving Map

For educational/research purposes:

```python
import requests
import folium

def lookup_bssid(bssid):
    """Look up BSSID location using Mylnikov API"""
    url = f"https://api.mylnikov.org/geolocation/wifi?v=1.1&data=open&bssid={bssid}"
    response = requests.get(url)
    data = response.json()
    
    if data['result'] == 200:
        return data['data']['lat'], data['data']['lon']
    return None

# BSSIDs to investigate
bssids = [
    "A4:11:62:F3:2A:B0",
    "B8:27:EB:45:C1:3F",
    "00:23:69:8D:47:2E"
]

# Create map
m = folium.Map(location=[47.6205, -122.3493], zoom_start=15)

# Add markers
for bssid in bssids:
    coords = lookup_bssid(bssid)
    if coords:
        folium.Marker(
            location=coords,
            popup=f"BSSID: {bssid}",
            icon=folium.Icon(color='red')
        ).add_to(m)

m.save('wifi_map.html')
```

### Legal and Ethical Considerations

**Important:**
- Wardriving (passive scanning) is generally legal
- Accessing networks without permission is illegal
- WiGLE and similar databases use publicly broadcast information
- This technique for CTF/education only
- Respect privacy and obtain permission for security testing

### Defensive Measures for Organizations

```
1. Separate guest and corporate networks (different BSSIDs)
2. Implement network segmentation
3. Use VLANs for different trust levels
4. Monitor for unauthorized APs (rogue AP detection)
5. Consider location privacy when naming SSIDs
6. Implement 802.1X authentication
7. Regular security audits of wireless infrastructure
```

### Resources

- **WiGLE:** https://wigle.net
- **Mylnikov:** https://mylnikov.org
- **OpenWiFi:** https://openwifi.su
- **MAC Vendors:** https://macvendors.com
- **Wireless Survey Tools:** NetSpot, inSSIDer, Acrylic
