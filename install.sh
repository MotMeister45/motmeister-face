#!/bin/bash
# MotMeister Face Installer
# Run: curl -sL https://raw.githubusercontent.com/MotMeister45/motmeister-face/main/install.sh | bash

echo ""
echo "🤖 Installing MotMeister Face..."
echo ""

cd /tmp

# Download
echo "📥 Downloading..."
curl -L -o MotMeister-Face.zip "https://github.com/MotMeister45/motmeister-face/releases/download/v1.1.0/MotMeister-Face-macOS.zip" 2>/dev/null

# Unzip
echo "📦 Extracting..."
unzip -o -q MotMeister-Face.zip

# Remove quarantine
echo "🔓 Clearing quarantine..."
xattr -cr "MotMeister Face-darwin-arm64/MotMeister Face.app"

# Move to Applications
echo "📁 Installing to Applications..."
rm -rf "/Applications/MotMeister Face.app" 2>/dev/null
mv "MotMeister Face-darwin-arm64/MotMeister Face.app" /Applications/

# Cleanup
rm -rf MotMeister-Face.zip "MotMeister Face-darwin-arm64"

echo ""
echo "✅ Installed!"
echo ""
echo "🚀 Launching MotMeister Face..."

# Launch
open "/Applications/MotMeister Face.app"

echo ""
echo "🎉 Done! Enjoy watching MotMeister work!"
echo ""
