# MIHO Global Remote Relay & Signaling Service

This directory contains the production-grade signaling and relay server for bridging mobile browsers with the MIHO Windows desktop application across cellular networks, firewalls, and symmetric NATs.

---

## 1. Architecture & Network Topology

```
   ┌─────────────────────────────────────────────────────────────┐
   │                    MOBILE PHONE BROWSER                     │
   │               (miho.samad.vexr.dev/#remote)                 │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTPS / WSS
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │           GLOBAL SIGNALING & RELAY SERVER                   │
   │              (relay.samad.vexr.dev:8080)                    │
   │  - Temporary QR token registry                              │
   │  - WebRTC SDP offer/answer & ICE signaling                  │
   │  - Authenticated duplex WebSocket relay fallback             │
   └──────────────────────────────▲──────────────────────────────┘
                                  │ WSS Outbound
                                  │ (No open inbound ports on PC)
   ┌──────────────────────────────┴──────────────────────────────┐
   │                 MIHO WINDOWS DESKTOP AGENT                  │
   │                     (D:\AI on Windows 11)                   │
   │  - Screen capture & streaming                               │
   │  - Mouse & keyboard SendInput execution                     │
   │  - Gemini Live voice command processing                     │
   │  - Local %APPDATA%\MIHO credential sandbox                  │
   └─────────────────────────────────────────────────────────────┘
```

---

## 2. Infrastructure Requirements & Estimated Operational Costs

Before any cloud infrastructure is deployed or purchased, review these specifications:

| Component | Purpose | Recommended Solution | Estimated Monthly Cost |
|---|---|---|---|
| **Signaling & Relay Service** | Manages pairing handshakes, device routing, and WebSocket relay fallback | 1 vCPU, 512MB RAM Node.js container (Railway, Render, Fly.io, or Hetzner VPS) | **$0.00 – $5.00 / month** (Free tier on Fly.io/Render; ~$5 on Railway) |
| **STUN/TURN Server** | Traverses restrictive carrier NATs and firewalls for WebRTC direct P2P video streaming | Standard Coturn server on a cheap VPS or Metered TURN (Twilio / Xirsys / Cloudflare Calls) | **$0.00 – $10.00 / month** (Google public STUN is free; TURN bandwidth ~$0.05/GB) |
| **Session Cache / DB** | Ephemeral pairing tokens & rate-limiting records | In-memory with fallback to Redis (Upstash Free Tier) | **$0.00 / month** |
| **Recordings Storage** | Storage for authorized screen recordings | **Local to Windows PC only** (`%USERPROFILE%\Pictures\MihoScreenshots\Recordings`) | **$0.00** (Zero cloud storage cost; zero cloud privacy exposure) |
| **Domain & TLS** | End-to-end encryption for public relay endpoint | Let's Encrypt automated TLS via Cloudflare / Caddy | **$0.00** |

**Total Estimated Operational Cost: $0.00 to $10.00 / month.**

---

## 3. Environment Variables

Create a `.env` file for the relay server:

```env
PORT=8080
NODE_ENV=production
ALLOWED_ORIGINS=https://miho.samad.vexr.dev,http://localhost:3000
PAIRING_TOKEN_TTL_MS=300000
RATE_LIMIT_PER_MINUTE=60
```

---

## 4. How to Run Locally for Testing

```bash
cd D:\landing-page\relay-server
npm install
npm start
```

Server listens on `http://localhost:8080` with WebSocket endpoint `ws://localhost:8080`.
