# chrome-extension
This Chrome extension enhances your reading experience by providing instant word meanings and AI chatbot support. Simply select a word on any webpage to get its definition without leaving the page. Additionally, interact with an AI chatbot for quick assistance and engage in seamless conversations.
# Word Meaning & Chatbot Chrome Extension

## 📌 Overview
This Chrome extension helps users instantly find word meanings, interact with an AI chatbot, enable dark mode, and use text-to-speech functionality. It enhances productivity by providing quick access to definitions and AI-powered interactions without leaving the webpage.

## 🚀 Features
- **Instant Word Meaning**: Select any word on a webpage and view its definition in a popup.
- **AI Chatbot**: Engage with an AI chatbot for quick responses and assistance.
- **Dark Mode**: Toggle dark mode for a comfortable reading experience.
- **Text-to-Speech (TTS)**: Listen to word meanings using text-to-speech.

## 📂 Project Structure
```
chrome-extension/
│── chatbot/
│   ├── chatbot.html    # Chatbot UI
│   ├── chatbot.css     # Chatbot styling
│   ├── chatbot.js      # Chatbot logic
│── icon/
│   ├── icon16.png      # 16x16 icon
│   ├── icon28.png      # 28x28 icon
│   ├── icon128.png     # 128x128 icon
│── popup/
│   ├── popup.html      # Popup UI
│   ├── popup.css       # Popup styling
│   ├── popup.js        # Popup logic
│── content.js          # Handles webpage interactions
│── background.js       # Manages API requests & background tasks
│── manifest.json       # Extension configuration
│── README.md           # Project documentation
```

## 📜 Installation
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   ```
2. **Open Chrome Extensions Page**:
   - Go to `chrome://extensions/`
   - Enable **Developer mode** (top-right corner)
3. **Load Unpacked Extension**:
   - Click **Load unpacked**
   - Select the **chrome-extension** folder
4. **Enjoy the Extension!** 🎉

## 🛠 Usage
- **Word Meaning**: Select a word → Right-click → Choose **Find Meaning**
- **Chatbot**: Click on the floating chatbot icon → Start chatting
- **Dark Mode**: Toggle via extension settings
- **Text-to-Speech**: Click the speaker icon next to word meanings

## ⚡ Technologies Used
- **HTML, CSS, JavaScript** (Frontend)
- **Chrome Extensions API** (For content scripting & background tasks)
- **Dictionary API** (For fetching word meanings)
- **Text-to-Speech API** (For voice functionality)

## 🛑 Troubleshooting
- **Extension not loading?**
  - Ensure all required files are present in the folder
  - Check for syntax errors in `manifest.json`
- **Icons not appearing?**
  - Verify correct paths in `manifest.json`
- **Chatbot not responding?**
  - Check background script logs in Chrome DevTools (`chrome://extensions/ > Inspect views`)

## 📌 Future Enhancements
- ✅ Add synonyms and antonyms support
- ✅ Improve chatbot AI responses
- ✅ Implement customizable theme settings

## 📝 License
This project is licensed under the MIT License.

## 🙌 Contributing
Pull requests are welcome! If you'd like to contribute:
1. Fork the repo
2. Create a new branch (`feature-branch`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to your fork & submit a PR

---
💡 **Author**: Harshal Nandeshwar

