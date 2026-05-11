# GitHub Chat - Chrome Extension

A Chrome extension that adds a chat widget to GitHub pages, allowing users to discuss repositories directly instead of only creating issues.

## Features

- Floating chat toggle button on all GitHub pages
- Real-time chat using Firebase
- Send and delete your own messages
- Persistent user identity per browser
- Clean, GitHub-themed UI

## Installation (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked" and select this `extension/` directory
4. Visit any GitHub repository page - you'll see the chat button in the bottom-right corner

## Files

- `manifest.json` - Chrome extension manifest (Manifest V3)
- `content.js` - Content script that injects toggle + iframe on GitHub pages
- `chat.html` - Chat UI loaded inside the iframe
- `chat.css` - Chat styles (GitHub-themed)
- `chat.js` - Firebase chat logic (messages, real-time updates)
- `icons/` - Extension icons (replace placeholders)
