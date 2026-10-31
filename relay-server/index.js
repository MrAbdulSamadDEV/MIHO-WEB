/**
 * MIHO Global Remote Connection — Production Signaling & Relay Service
 *
 * Facilitates global, cross-network communication between the mobile web client
 * and the MIHO Windows Desktop Agent across NATs, firewalls, and cellular data.
 */

import http from 'http';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// In-Memory routing tables
// deviceId -> Agent WebSocket
const agents = new Map();
// `${deviceId}:${clientId}` -> Mobile Client WebSocket
const clients = new Map();

// Pairing references: pairingToken -> { deviceId, expiresAt }
const pairingRegistry = new Map();

// Periodic cleanup of expired pairing tokens to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of pairingRegistry.entries()) {
    if (now > data.expiresAt) {
      pairingRegistry.delete(token);
    }
  }
}, 30000);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    activeAgents: agents.size,
    activeClients: clients.size,
    timestamp: new Date().toISOString(),
  });
});

// Register pairing token from Windows agent
app.post('/api/relay/pairing/register', (req, res) => {
  const { pairingToken, deviceId, expiresAt } = req.body || {};
  if (!pairingToken || !deviceId) {
    return res.status(400).json({ error: 'Missing pairingToken or deviceId' });
  }

  // Security Gate: Ensure the Windows PC is actively connected and registered as an agent
  // or that a valid relay pre-shared secret header is provided
  const agentWs = agents.get(deviceId);
  const isAgentConnected = agentWs && agentWs.readyState === WebSocket.OPEN;
  const sharedSecret = process.env.RELAY_AUTH_SECRET;
  const isHeaderAuthenticated = sharedSecret && req.headers['x-relay-auth'] === sharedSecret;

  if (!isAgentConnected && !isHeaderAuthenticated) {
    return res.status(401).json({
      error: 'Unauthorized: Target Windows PC must be actively registered via WebSocket before registering pairing tokens.',
    });
  }

  // Capacity guard against memory exhaustion
  if (pairingRegistry.size >= 500) {
    return res.status(429).json({ error: 'Pairing registry capacity reached. Try again shortly.' });
  }

  pairingRegistry.set(pairingToken, { deviceId, expiresAt: expiresAt || Date.now() + 5 * 60 * 1000 });
  res.json({ ok: true });
});

// Mobile client queries pairing token to find target Windows PC
app.get('/api/relay/pairing/lookup/:pairingToken', (req, res) => {
  const data = pairingRegistry.get(req.params.pairingToken);
  if (!data || Date.now() > data.expiresAt) {
    return res.status(404).json({ error: 'Pairing token expired or not found' });
  }
  res.json({ ok: true, deviceId: data.deviceId });
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  let role = null; // 'agent' | 'client'
  let deviceId = null;
  let clientId = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      // Handshake
      if (msg.type === 'register_agent') {
        deviceId = msg.deviceId;
        role = 'agent';
        agents.set(deviceId, ws);
        ws.send(JSON.stringify({ type: 'registered', role: 'agent', deviceId }));
        console.log(`[Relay] Agent registered: ${deviceId}`);
        return;
      }

      if (msg.type === 'register_client') {
        deviceId = msg.deviceId;
        clientId = msg.clientId;
        role = 'client';
        const clientKey = `${deviceId}:${clientId}`;
        clients.set(clientKey, ws);

        const agentWs = agents.get(deviceId);
        ws.send(JSON.stringify({
          type: 'registered',
          role: 'client',
          deviceId,
          agentOnline: agentWs && agentWs.readyState === WebSocket.OPEN,
        }));
        console.log(`[Relay] Client registered: ${clientKey}`);
        return;
      }

      // Forward messages between mobile client and Windows agent
      if (role === 'client' && deviceId) {
        const agentWs = agents.get(deviceId);
        if (agentWs && agentWs.readyState === WebSocket.OPEN) {
          agentWs.send(JSON.stringify({ ...msg, fromClient: clientId }));
        } else {
          ws.send(JSON.stringify({ type: 'agent_offline', error: 'Windows PC is offline.' }));
        }
        return;
      }

      if (role === 'agent' && msg.toClient && deviceId) {
        const targetClientKey = `${deviceId}:${msg.toClient}`;
        const clientWs = clients.get(targetClientKey);
        if (clientWs && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify(msg));
        }
        return;
      }

      // Broadcast from agent to all connected clients for that PC
      if (role === 'agent' && deviceId) {
        for (const [key, clientWs] of clients.entries()) {
          if (key.startsWith(`${deviceId}:`) && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify(msg));
          }
        }
      }
    } catch (e) {
      console.error('[Relay] Error handling message:', e);
    }
  });

  ws.on('close', () => {
    if (role === 'agent' && deviceId) {
      agents.delete(deviceId);
      // Notify clients
      for (const [key, clientWs] of clients.entries()) {
        if (key.startsWith(`${deviceId}:`) && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ type: 'agent_offline' }));
        }
      }
      console.log(`[Relay] Agent disconnected: ${deviceId}`);
    } else if (role === 'client' && deviceId && clientId) {
      const clientKey = `${deviceId}:${clientId}`;
      clients.delete(clientKey);
      const agentWs = agents.get(deviceId);
      if (agentWs && agentWs.readyState === WebSocket.OPEN) {
        agentWs.send(JSON.stringify({ type: 'client_disconnected', clientId }));
      }
      console.log(`[Relay] Client disconnected: ${clientKey}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[MIHO Relay] Global signaling & relay server listening on port ${PORT}`);
});
