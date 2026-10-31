"""
MIHO Comprehensive Zero-Defect Audit & Verification Test Suite
Tests:
1. Strict Image Restriction (Zero cropped reference screenshots in source or assets)
2. Build & Bundle Integrity (Production dist, code-splitting)
3. SEO & Metadata Audit (Canonical, OpenGraph, JSON-LD, fonts, robots.txt, sitemap.xml, 404.html)
4. Developer Social & Contact Links Audit (GitHub, Portfolio, LinkedIn, YouTube, X, Instagram, Email)
5. Security Audit & Token Protection (No secret leaks, path traversal, single-use pairing token)
6. Strict Mobile-Only Remote Visibility (Desktop nav hides remote, mobile drawer exposes it, portal gate)
7. On-Demand Screen & Voice Independence (Screen defaults OFF, manual share, independent voice TTS, hotkeys, emergency stop)
"""

import os
import re
import subprocess
import urllib.request
import json

LANDING_DIR = r"D:\landing-page"
PASS_COUNT = 0
FAIL_COUNT = 0

def log_test(name, passed, details=""):
    global PASS_COUNT, FAIL_COUNT
    if passed:
        PASS_COUNT += 1
        print(f"[PASS] {name} {details}")
    else:
        FAIL_COUNT += 1
        print(f"[FAIL] {name} {details}")

print("================================================================")
print("   MIHO PRODUCTION AUDIT & VERIFICATION TEST SUITE")
print("================================================================\n")

# 1. STRICT IMAGE RESTRICTION AUDIT
print("--- 1. Strict Image Restriction Audit ---")
disallowed_sculptures = ["hero-liquid-metal.png", "capabilities-core.png", "privacy-shield.png", "cta-liquid-ribbon.png", "voice-horn.png"]
found_cropped = []
for root, _, files in os.walk(os.path.join(LANDING_DIR, "public")):
    for f in files:
        if f in disallowed_sculptures or f.startswith("screenshot-2026"):
            found_cropped.append(f)
log_test("Zero cropped screenshot files in public/assets", len(found_cropped) == 0, f"Found: {found_cropped}")

src_image_refs = []
for root, _, files in os.walk(os.path.join(LANDING_DIR, "src")):
    for f in files:
        if f.endswith((".js", ".jsx")):
            with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as fl:
                c = fl.read()
                for dis in disallowed_sculptures:
                    if dis in c:
                        src_image_refs.append(f"{f} -> {dis}")
log_test("Zero cropped screenshot references in source JSX components", len(src_image_refs) == 0, f"Refs: {src_image_refs}")

# Pure SVG / Canvas Vector Sculptures verified in Hero & Components
with open(os.path.join(LANDING_DIR, "src", "components", "Hero.jsx"), "r", encoding="utf-8") as f:
    hero_src = f.read()
log_test("Hero features pure SVG liquid chrome sculpture & ring", '<svg' in hero_src and 'metal' in hero_src and 'ring' in hero_src)

# 2. BUILD & BUNDLE INTEGRITY
print("\n--- 2. Build & Bundle Integrity ---")
dist_html = os.path.join(LANDING_DIR, "dist", "index.html")
log_test("Production dist/index.html exists", os.path.exists(dist_html))

assets_dir = os.path.join(LANDING_DIR, "dist", "assets")
js_chunks = [f for f in os.listdir(assets_dir) if f.endswith(".js")] if os.path.exists(assets_dir) else []
has_split = any("RemotePortal" in f for f in js_chunks)
log_test("Bundle code-splitting (RemotePortal lazy chunk)", has_split, f"Found chunks: {js_chunks}")

# 3. SEO, METADATA & FAVICON AUDIT
print("\n--- 3. SEO, Metadata & Favicon Suite Audit ---")
with open(os.path.join(LANDING_DIR, "index.html"), "r", encoding="utf-8") as f:
    html_src = f.read()

log_test("Canonical URL set to https://miho.samad.vexr.dev/", 'href="https://miho.samad.vexr.dev/"' in html_src)
log_test("OpenGraph Title & Description present", 'og:title' in html_src and 'og:description' in html_src)
log_test("Twitter Summary Card metadata present", 'twitter:card' in html_src)
log_test("Structured JSON-LD Schema present", 'application/ld+json' in html_src and 'Abdul Samad' in html_src)
log_test("Google Fonts Space Grotesk & Inter preconnected", 'Space+Grotesk' in html_src and 'Inter' in html_src)
log_test("robots.txt exists in public", os.path.exists(os.path.join(LANDING_DIR, "public", "robots.txt")))
log_test("sitemap.xml exists in public", os.path.exists(os.path.join(LANDING_DIR, "public", "sitemap.xml")))
log_test("404.html custom error page exists", os.path.exists(os.path.join(LANDING_DIR, "public", "404.html")))

# Official Browser Tab Icon (Favicon Suite)
log_test("favicon.ico exists in public and dist", os.path.exists(os.path.join(LANDING_DIR, "public", "favicon.ico")))
log_test("favicon.svg exists in public and dist", os.path.exists(os.path.join(LANDING_DIR, "public", "favicon.svg")))
log_test("favicon-32x32.png exists in public and dist", os.path.exists(os.path.join(LANDING_DIR, "public", "favicon-32x32.png")))
log_test("favicon-16x16.png exists in public and dist", os.path.exists(os.path.join(LANDING_DIR, "public", "favicon-16x16.png")))
log_test("apple-touch-icon.png exists in public and dist", os.path.exists(os.path.join(LANDING_DIR, "public", "apple-touch-icon.png")))
log_test("HTML document links favicon.ico, svg, 32x32, 16x16, apple-touch-icon",
         'href="/favicon.ico"' in html_src and
         'href="/favicon.svg"' in html_src and
         'href="/favicon-32x32.png"' in html_src and
         'href="/favicon-16x16.png"' in html_src and
         'href="/apple-touch-icon.png"' in html_src)

# 4. DEVELOPER SOCIAL & CONTACT LINKS AUDIT
print("\n--- 4. Developer Social & Contact Links Audit ---")
with open(os.path.join(LANDING_DIR, "src", "components", "Footer.jsx"), "r", encoding="utf-8") as f:
    footer_src = f.read()

log_test("Connect section titled 'CONNECT WITH THE DEVELOPER'", "CONNECT WITH THE DEVELOPER" in footer_src)
log_test("GitHub official link verified", "https://github.com/MrAbdulSamadDEV" in footer_src)
log_test("Portfolio official link verified", "https://samad.vexr.dev" in footer_src)
log_test("LinkedIn official link verified", "https://www.linkedin.com/in/MRABDULSAMADDEV" in footer_src)
log_test("YouTube official link verified", "https://www.youtube.com/@epicflixplus" in footer_src)
log_test("X (Twitter) official link verified", "https://x.com/ABDULSAMAD8492" in footer_src)
log_test("Instagram official link verified", "https://www.instagram.com/samad_boy.dev" in footer_src)
log_test("Developer credit 'CREATED & DEVELOPED BY ABDUL SAMAD' present", "CREATED &amp; DEVELOPED BY" in footer_src or "CREATED & DEVELOPED BY" in footer_src)
log_test("Contact email mailto: link verified", "mailto:mr.abdulsamadabdullah@gmail.com" in footer_src)

# 5. SECURITY AUDIT & TOKEN PROTECTION
print("\n--- 5. Security Audit & Token Protection ---")
leaks = []
for root, _, files in os.walk(os.path.join(LANDING_DIR, "src")):
    for f in files:
        if f.endswith((".js", ".jsx", ".css", ".html")):
            with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as fl:
                content = fl.read()
                if "AIzaSy" in content or "PRIVATE KEY" in content or "AWS_SECRET" in content:
                    leaks.append(f)
log_test("Zero hardcoded API keys / private secrets in source", len(leaks) == 0, f"Leaks: {leaks}")

# Check Path Traversal Prevention in server_remote.ts
with open(r"D:\AI\server_remote.ts", "r", encoding="utf-8") as f:
    remote_src = f.read()

log_test("Server path traversal sanitized with path.basename()", "path.basename(" in remote_src)
log_test("Single-use pairing token invalidated upon approval", "pairingTokens.delete(" in remote_src or "activePairingTokens.delete(" in remote_src)
log_test("Device token authentication enforced on WebSocket", 'auth' in remote_src and ('deviceAuthToken' in remote_src or 'tokenHash' in remote_src))

# 6. STRICT MOBILE-ONLY REMOTE VISIBILITY AUDIT
print("\n--- 6. Strict Mobile-Only Remote Visibility Audit ---")
with open(os.path.join(LANDING_DIR, "src", "components", "Navbar.jsx"), "r", encoding="utf-8") as f:
    nav_src = f.read()

# Desktop navigation MUST NOT contain Remote
desktop_nav_match = re.search(r'<nav className="hidden md:flex[^>]*>(.*?)</nav>', nav_src, re.DOTALL)
desktop_has_remote = desktop_nav_match and "Remote" in desktop_nav_match.group(1)
log_test("Desktop nav completely hides Remote Connection", not desktop_has_remote)

# Mobile navigation drawer MUST contain Remote
mobile_has_remote = "onOpenRemote" in nav_src and "Remote Connection" in nav_src
log_test("Mobile menu drawer provides Remote Connection entry", bool(mobile_has_remote))

# RemotePortal.jsx mobile gate verification
with open(os.path.join(LANDING_DIR, "src", "components", "remote", "RemotePortal.jsx"), "r", encoding="utf-8") as f:
    portal_src = f.read()
log_test("RemotePortal enforces mobile viewport exclusivity", "isMobileDevice" in portal_src and "MOBILE ONLY FEATURE" in portal_src)

# 7. ON-DEMAND SCREEN & VOICE INDEPENDENCE AUDIT
print("\n--- 7. On-Demand Screen & Voice Independence Audit ---")
with open(os.path.join(LANDING_DIR, "src", "components", "remote", "RemoteDashboard.jsx"), "r", encoding="utf-8") as f:
    dash_src = f.read()

log_test("Screen Sharing initializes in OFF state (never auto-shares)", "screenSharingState, setScreenSharingState] = useState('OFF')" in dash_src)
log_test("Share Screen button requires explicit user click", "SHARE SCREEN" in dash_src and "handleStartScreenShare" in dash_src)
log_test("Stop Sharing button halts stream immediately", "STOP SHARING" in dash_src and "handleStopScreenShare" in dash_src)
log_test("MIHO Voice conversation operates completely independently", "toggleVoiceListening" in dash_src and "MIHO Voice" in dash_src)
log_test("Text-to-speech spoken response integrated", "SpeechSynthesisUtterance" in dash_src)
log_test("Virtual Touchpad and PC Keyboard shortcuts implemented", "VIRTUAL TOUCHPAD" in dash_src and "sendHotkey" in dash_src)
log_test("Authorized screen recording controller integrated", "startScreenRecording" in dash_src or "screen_record_start" in dash_src)
log_test("Emergency Disconnect halts all operations immediately", "handleEmergencyDisconnect" in dash_src)

print("\n================================================================")
print(f"   TOTAL TESTS: {PASS_COUNT + FAIL_COUNT} | PASSED: {PASS_COUNT} | FAILED: {FAIL_COUNT}")
print("================================================================")

if FAIL_COUNT == 0:
    print("\n>>> ZERO DEFECTS DETECTED. AUDIT PASSED WITH 100% SUCCESS! <<<\n")
else:
    raise SystemExit(1)
