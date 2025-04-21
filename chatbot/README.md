# AI Web Chatbot

## Introduction
The AI Web Chatbot is a Chrome extension that enables seamless AI interaction directly within any web page. This powerful tool integrates with Google's Generative AI to provide intelligent, context-aware assistance based on the content of your current web page.

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Privacy Policy](#privacy-policy)

## Installation
To install the AI Web Chatbot Chrome extension:

1. Clone this repository:
   ```bash
   git clone https://github.com/uliba3/ai-web-chatbot.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the cloned repository directory
5. The extension icon should appear in your Chrome toolbar

## Usage
After installation:

1. Click the AI Web Chatbot icon in your browser
2. Enter your API key when prompted (first-time setup only)
3. Start chatting with the AI about any content on the current webpage
4. Use the draggable and resizable chat window for optimal positioning

## Features
- **Contextual AI Assistance:** Get intelligent responses based on webpage content
- **Movable Interface:** Drag and position the chat window anywhere on the page
- **Resizable Window:** Adjust the chat window size to your preference
- **Secure API Key Storage:** Your API key is stored securely in local storage
- **Real-time Responses:** Quick and relevant AI-powered interactions

## Dependencies
The extension relies on:
- Google Generative AI API
- Chrome Extension APIs:
  - `activeTab`
  - `scripting`
  - `storage`

## Configuration
### API Key Setup
1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Enter the key when first launching the extension
3. The key will be securely stored for future use

## Documentation
Key project files:
- `manifest.json`: Extension configuration and permissions
- `background.js`: Background service worker and AI initialization
- `content.js`: UI and interaction logic
- `api.js`: API communication handling
- `utils.js`: Utility functions
- `styles.css`: Chat window styling
- `generative-ai.js`: AI model integration

## Examples
Sample interactions:
1. **Content Summary:**
   - Q: "What is this page about?"
   - AI provides a concise summary of the current webpage

2. **Specific Questions:**
   - Q: "Can you explain the technical terms on this page?"
   - AI offers detailed explanations of complex concepts

## Troubleshooting
Common issues and solutions:

1. **Chat Not Loading**
   - Verify your API key is correctly entered
   - Refresh the webpage
   - Reload the extension

2. **API Key Issues**
   - Ensure you've entered a valid Google Generative AI API key
   - Check for any spaces or special characters

3. **Performance Issues**
   - Clear browser cache
   - Disable other extensions temporarily
   - Reload the webpage

## Privacy Policy

### Data Protection
- No personal data collection
- No storage of chat history
- Local-only processing
- Secure API key storage

### Data Usage
- Webpage content is processed only for immediate AI responses
- No data persistence beyond the current session
- No tracking or analytics

### Security
- Industry-standard security practices
- Local storage encryption for API keys
- Secure API communication

### Third-Party Services
This extension only interacts with:
- Google Generative AI API ([Privacy Policy](https://support.google.com/gemini/answer/13594961?hl=en))

For support or questions, please open an issue on the GitHub repository.

