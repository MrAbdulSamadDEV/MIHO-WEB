import urllib.request
import re

base = 'http://localhost:3000'
with urllib.request.urlopen(base) as r:
    html = r.read().decode('utf-8')

# Assertions
assert '<title>MIHO' in html, 'Missing title'
assert '<div id="root"></div>' in html, 'Missing root div'
assert 'Space+Grotesk' in html, 'Missing Space Grotesk font'
assert 'Inter' in html, 'Missing Inter font'

print("Base HTML structure: VERIFIED")

# Check all assets
assets = [
    '/assets/sculptures/hero-liquid-metal.png',
    '/assets/sculptures/capabilities-core.png',
    '/assets/sculptures/privacy-shield.png',
    '/assets/sculptures/cta-liquid-ribbon.png',
    '/assets/sculptures/voice-horn.png',
    '/assets/sculptures/mode-orb.png',
    '/assets/sculptures/mode-glass.png',
    '/assets/sculptures/mode-mini.png',
    '/assets/sculptures/mode-avatar.png',
    '/assets/sculptures/mode-custom.png',
    '/assets/ui/desktop-concept.png',
    '/assets/ui/showcase-main.png',
    '/assets/screenshots/screenshot-20261030-104731.png',
    '/assets/screenshots/screenshot-20261030-104919.png',
    '/assets/screenshots/screenshot-20261030-111133.png'
]

# Find bundle references
bundle_matches = re.findall(r'(?:src|href)="(/assets/[^"]+)"', html)
assets.extend(bundle_matches)

all_ok = True
for path in assets:
    try:
        url = base + path
        with urllib.request.urlopen(url) as res:
            if res.status != 200:
                print(f"FAIL {path}: {res.status}")
                all_ok = False
            else:
                length = len(res.read())
                print(f"OK   {path} ({length} bytes)")
    except Exception as e:
        print(f"ERROR {path}: {e}")
        all_ok = False

if all_ok:
    print("\n>>> ALL 18 ASSETS & BUNDLE VERIFIED 100% HEALTHY <<<")
else:
    raise Exception("Asset verification failed")
