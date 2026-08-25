# API Key Setup Guide

## ⚠️ Security Notice
Your OpenAI API key has been removed from the public repository for security reasons.

## How to Set Up Your API Key

### Option 1: Local Development (Recommended)
1. Open `config.js` in your local project
2. Replace `'your-api-key-here'` with your actual API key:
   ```javascript
   OPENAI_API_KEY: 'sk-proj-your-actual-api-key-here',
   ```
3. Keep this file local - don't commit it to GitHub

### Option 2: Environment Variables (Advanced)
For production deployment, use environment variables instead of hardcoding the API key.

### Option 3: Use Current System (No API Needed)
Your chat system works perfectly with smart fallback responses! No API key needed.

## Current Status
✅ **Chat System**: Working perfectly with smart Tanglish responses  
✅ **WhatsApp Integration**: One-click ordering with pre-filled messages  
✅ **No API Required**: System works offline with intelligent responses  

## Deploy to GitHub Pages
1. Commit your changes (without API key)
2. Push to GitHub
3. Enable GitHub Pages in repository settings
4. Your website will be live at: `https://growithoufeek.github.io/bismi-mehendi/`

## For Production Use
- Add your API key locally for testing
- Use the smart fallback system for public deployment
- Customers get excellent service either way!
