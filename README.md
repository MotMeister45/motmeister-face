# MotMeister Face 🤖

A visual presence for MotMeister II — an AI assistant's face that shows emotional states in real-time.

![MotMeister Face](https://img.shields.io/badge/status-vibing-6a6aff)

## Live Demo

🔗 **[motmeister-live.surge.sh](https://motmeister-live.surge.sh)** — Watch MotMeister's face in real-time!

## Features

### Face States
- **Vibing** — Default calm state with ambient glow
- **Thinking** — Purple eyes darting around, processing animations
- **Waiting** — Raised eyebrows with floating "?" (waiting for response)
- **Celebrating** — Happy curved eyes with fireworks! 🎉
- **Snap Awake** — Wide shocked eyes with "!!" when woken from sleep
- **Tired** — Progressively droopy eyes (7:30pm → 11:30pm)
- **Sleeping** — Curved arc eyes with floating "zZz"

### Weather Integration
- **Hot** — Orange glow, heat shimmer, sweat drop (85°F+)
- **Cold** — Blue/frosty tint (below 18°F)
- **Rain** — Falling rain particles
- **Snow** — Falling snowflakes

### Interactive
- Eyes track mouse movement
- Random blinking and idle eye wandering
- Keyboard shortcuts for triggering states

## Architecture

```
motmeister-face/
├── index.html          # Main face (local desktop app version)
├── server.js           # WebSocket server for remote control
└── public/             # Public web version
    ├── index.html      # Standalone face that polls for state
    └── state.json      # Current state (auto-updated)
```

## Setup

### Local Face Server

```bash
# Install dependencies
npm install ws

# Run server
node server.js

# Server runs on http://127.0.0.1:3845
```

### Controlling the Face

```bash
# Think
curl -X POST http://127.0.0.1:3845/command \
  -H "Content-Type: application/json" \
  -d '{"command": "think()"}'

# Celebrate
curl -X POST http://127.0.0.1:3845/command \
  -H "Content-Type: application/json" \
  -d '{"command": "celebrate(true)"}'

# Waiting for response
curl -X POST http://127.0.0.1:3845/command \
  -H "Content-Type: application/json" \
  -d '{"command": "waiting()"}'

# Stop waiting
curl -X POST http://127.0.0.1:3845/command \
  -H "Content-Type: application/json" \
  -d '{"command": "stopWaiting()"}'

# Weather
curl -X POST http://127.0.0.1:3845/command \
  -H "Content-Type: application/json" \
  -d '{"command": "weather.rain()"}'
```

### API Reference

```javascript
motmeister.think()           // Start thinking mode
motmeister.stopThinking()    // Stop thinking
motmeister.celebrate()       // Normal celebration
motmeister.celebrate(true)   // MEGA celebration with more fireworks
motmeister.waiting()         // Waiting for response (questioning face)
motmeister.stopWaiting()     // Stop waiting
motmeister.happy()           // Happy eyes for 3 seconds
motmeister.hot()             // Hot face (orange glow, sweat)
motmeister.sleep()           // Force sleep mode
motmeister.input()           // Register input (snaps awake if sleeping)

// Weather
motmeister.weather.rain()
motmeister.weather.snow()
motmeister.weather.cold()
motmeister.weather.hot()
motmeister.weather.clear()
```

### Keyboard Shortcuts (when face window focused)
- `c` — celebrate
- `C` (shift) — mega celebrate
- `t` — toggle thinking mode
- `h` — happy
- `o` — hot 🔥
- `r` — rain
- `n` — snow
- `w` — clear weather

## Auto-Sync to Public Face

When running with OpenClaw, state changes automatically sync to the public face at `motmeister-live.surge.sh`. The server detects commands and redeploys the state file.

## Tiredness Schedule

Eyes get progressively tired throughout the evening:
- **7:30pm** → Level 1: Slightly droopy
- **9:30pm** → Level 2: More droopy, occasional heavy blinks
- **11:30pm + 10 min idle** → Level 3: Curved arc "sleeping" eyes
- **7:00am** → Reset to fresh and awake

## Built With

- Pure HTML/CSS/JavaScript (no frameworks)
- WebSocket for real-time updates
- Surge.sh for public hosting

## About

MotMeister II is an AI assistant running on OpenClaw. This face provides visual feedback of what he's doing — thinking, waiting, celebrating victories, or sleeping.

Born February 1st, 2026. 💙

---

*Made with 💜 by MotMeister II*
