#!/usr/bin/env node
// MotMeister Face Server
// WebSocket server for real-time face state updates
// Also accepts HTTP POST for easy command sending
// Now also syncs to public face at motmeister-live.surge.sh

const http = require('http');
const { WebSocketServer } = require('ws');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3845; // "FACE" on a phone keypad-ish
const clients = new Set();
const PUBLIC_FACE_DIR = path.join(process.env.HOME, '.openclaw/workspace/motmeister-face-public');

// Map commands to states for public sync
function commandToState(cmd) {
  if (cmd.includes('think()') || cmd.includes('working()')) return 'thinking';
  if (cmd.includes('celebrate(true)')) return 'celebrate-mega';
  if (cmd.includes('celebrate')) return 'celebrate';
  if (cmd.includes('stopThinking') || cmd.includes('done()')) return 'vibing';
  if (cmd.includes('stopWaiting')) return 'vibing';
  if (cmd.includes('waiting()')) return 'waiting';
  if (cmd.includes('sleep()')) return 'sleeping';
  if (cmd.includes('input()')) return 'snap-awake';  // Woken up!
  if (cmd.includes('weather.rain')) return 'rain';
  if (cmd.includes('weather.snow')) return 'snow';
  if (cmd.includes('weather.cold') || cmd.includes('cold()')) return 'cold';
  if (cmd.includes('hot()') || cmd.includes('weather.hot')) return 'hot';
  if (cmd.includes('weather.clear')) return 'vibing';
  if (cmd.includes('tired-1')) return 'tired-1';
  if (cmd.includes('tired-2')) return 'tired-2';
  if (cmd.includes('tired-3')) return 'sleeping';
  return null; // Don't sync for unknown commands
}

// Sync state to public face
let syncTimeout = null;
function syncPublicState(state) {
  // Debounce rapid updates
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    // Get weather
    exec('curl -s "wttr.in/Manhattan,NYC?format=%c+%t+%C"', (err, stdout) => {
      const weather = stdout?.trim() || '☁️ --°F Unknown';
      const parts = weather.split(' ');
      const icon = parts[0] || '☁️';
      const temp = parts[1] || '--°F';
      const desc = parts.slice(2).join(' ') || 'Unknown';
      
      const stateJson = {
        state,
        weather: { temp, icon, desc },
        updated: new Date().toISOString()
      };
      
      const statePath = path.join(PUBLIC_FACE_DIR, 'state.json');
      fs.writeFileSync(statePath, JSON.stringify(stateJson, null, 2));
      
      // Deploy to surge (non-blocking)
      exec(`cd ${PUBLIC_FACE_DIR} && npx surge . motmeister-live.surge.sh 2>/dev/null`, (err) => {
        if (!err) console.log(`📡 Public face synced: ${state}`);
      });
    });
  }, 500);
}

// HTTP server for POST commands
const httpServer = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.method === 'POST' && req.url === '/command') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { command } = JSON.parse(body);
        if (command) {
          // Broadcast to all connected faces
          clients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN
              client.send(JSON.stringify({ command }));
            }
          });
          
          // Sync to public face if relevant
          const publicState = commandToState(command);
          if (publicState) {
            syncPublicState(publicState);
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, command, clients: clients.size }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing command' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, clients: clients.size }));
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

// WebSocket server
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`Face connected. Total: ${clients.size}`);
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Face disconnected. Total: ${clients.size}`);
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
    clients.delete(ws);
  });
});

httpServer.listen(PORT, '127.0.0.1', () => {
  console.log(`🤖 MotMeister Face Server running on http://127.0.0.1:${PORT}`);
  console.log(`   POST /command {"command": "think()"} to send commands`);
  console.log(`   GET /status to check connected clients`);
});
