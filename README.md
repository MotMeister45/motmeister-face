# MotMeister Face 🤖

A visual presence for MotMeister II — an AI assistant's face that shows emotional states in real-time.

## Two Versions

### 🏠 Local Version (Kieran's Desktop)
The original face that runs on the same machine as MotMeister. Connects via **WebSocket** to localhost:3845 for instant updates.

**Files:** `index.html`, `server.js`

**How it works:**
- Server runs on `localhost:3845`
- Face connects via WebSocket
- Commands sent → face updates instantly

### 🌐 Public Version (Uncle Ivans' Desktop)
A remote-friendly version that anyone can run. Polls a **GitHub Gist** for state updates every 3 seconds.

**Files:** `public/index.html`

**Live URL:** [motmeister-live.surge.sh](https://motmeister-live.surge.sh)

**How it works:**
- MotMeister updates a GitHub Gist when state changes
- Public face polls the Gist API every 3 seconds
- Updates within ~3-5 seconds of state change

---

## Install Public Version (Desktop App)

```bash
curl -sL https://raw.githubusercontent.com/MotMeister45/motmeister-face/main/install.sh | bash
```

---

## Features

### Face States
| State | Trigger | Description |
|-------|---------|-------------|
| 😌 Vibing | Default | Calm, ambient glow |
| 💜 Thinking | `think()` | Purple eyes darting around |
| ❓ Waiting | `waiting()` | Raised eyebrows, floating "?" |
| 🎉 Celebrating | `celebrate()` | Happy eyes, fireworks! |
| 😴 Tired | 7:30pm+ | Droopy eyelids |
| 💤 Sleeping | 11:30pm + idle | Curved arc eyes, floating "zZz" |
| 😳 Snap Awake | Woken from sleep | Wide shocked eyes, "!!" |

### Weather Effects
| Weather | Trigger | Effect |
|---------|---------|--------|
| 🔥 Hot | 85°F+ | Orange glow, heat shimmer, sweat |
| 🥶 Cold | <18°F | Blue/frosty tint |
| 🌧️ Rain | `weather.rain()` | Falling rain particles |
| ❄️ Snow | `weather.snow()` | Falling snowflakes |

### Interactive
- 👀 Eyes track mouse movement
- 😌 Random blinking
- 🎹 Keyboard shortcuts (c=celebrate, t=think, etc.)

---

## Local Setup

### Server
```bash
cd local
npm install ws
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

# Stop thinking
curl -X POST http://127.0.0.1:3845/command \
  -H "Content-Type: application/json" \
  -d '{"command": "stopThinking()"}'
```

---

## API Reference

```javascript
// States
motmeister.think()           // Start thinking
motmeister.stopThinking()    // Stop thinking
motmeister.celebrate()       // Normal celebration
motmeister.celebrate(true)   // MEGA celebration
motmeister.waiting()         // Waiting for response
motmeister.stopWaiting()     // Stop waiting
motmeister.happy()           // Happy eyes (3 sec)
motmeister.sleep()           // Force sleep
motmeister.input()           // Register input (snap awake)

// Weather
motmeister.weather.rain()
motmeister.weather.snow()
motmeister.weather.cold()
motmeister.weather.hot()
motmeister.weather.clear()
```

---

## Architecture

```
motmeister-face/
├── index.html          # Local face (WebSocket)
├── server.js           # WebSocket server + Gist sync
├── local/              # Local version backup
│   ├── index.html
│   └── server.js
├── public/             # Public version (Gist polling)
│   └── index.html
└── install.sh          # One-line installer
```

### Sync Flow (Local → Public)
```
[MotMeister] → curl command → [Server:3845]
                                    ↓
                              WebSocket → [Local Face] (instant)
                                    ↓
                              GitHub Gist update
                                    ↓
                              [Public Face] polls Gist (3 sec)
```

---

## Tiredness Schedule

| Time | Level | Effect |
|------|-------|--------|
| 7:30pm | 1 | Slightly droopy eyelids |
| 9:30pm | 2 | More droopy, heavy blinks |
| 11:30pm + 10min idle | 3 | Curved "sleeping" eyes, zZz |
| 7:00am | Reset | Fresh and awake |

---

*Made with 💜 by MotMeister II*
*Born February 1st, 2026*
