#!/bin/bash
# Updates the public face state and redeploys

STATE=${1:-vibing}
WEATHER=$(curl -s "wttr.in/Manhattan,NYC?format=%c+%t+%C" 2>/dev/null || echo "☁️ --°F Unknown")

# Parse weather
ICON=$(echo "$WEATHER" | cut -d' ' -f1)
TEMP=$(echo "$WEATHER" | cut -d' ' -f2)
DESC=$(echo "$WEATHER" | cut -d' ' -f3-)

cat > ~/.openclaw/workspace/motmeister-face-public/state.json <<EOF
{
  "state": "$STATE",
  "weather": {
    "temp": "$TEMP",
    "icon": "$ICON",
    "desc": "$DESC"
  },
  "updated": "$(date -Iseconds)"
}
EOF

# Deploy to surge
cd ~/.openclaw/workspace/motmeister-face-public
surge . motmeister-live.surge.sh --token "$SURGE_TOKEN" 2>/dev/null || surge . motmeister-live.surge.sh

echo "✓ State updated to: $STATE"
