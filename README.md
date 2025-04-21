Perfect! Here's the final `README.md` content you can copy-paste directly into your project:

---

# 🧠 Instant Word Meaning with Chatbot – Chrome Extension

This Chrome Extension allows users to **instantly get the meaning or explanation of any selected word or phrase** on a webpage using a chatbot powered by a generative AI model.

---

## 📌 Project Title

**Instant Word Meaning with Chatbot**  
Created by:  
- Harshal Nandeshwar (A-44)  
- Jivan Karlapudi (A-49)  
- Deepa Yadav (A-37)  
**GH Raisoni College of Engineering and Management, Pune (Wagholi)**

---

## 🎯 Aim

To develop a Chrome Extension that provides real-time word meanings or contextual explanations using an AI chatbot.

---

## 🌟 Features

- 🔍 Instantly fetch meaning by selecting any text on a webpage.
- 🤖 Uses a generative AI model for intelligent, contextual explanations.
- 💬 Lightweight and fast response via overlay popup.
- 🧠 AI prompt engineering handled behind the scenes.
- ⚙️ Simple to install and use on any Chrome browser.

---

## 🛠️ Technologies Used

- HTML  
- CSS  
- JavaScript  
- Chrome Extensions API  
- JSON  
- Generative AI (Google PaLM or compatible)

---

## 📁 Folder Structure

```
chatbot/
├── manifest.json             # Metadata and permissions
├── background.js             # Handles extension background logic
├── background-constants.js   # Constants for background script
├── content.js                # Injects script into web pages
├── api.js                    # API handler for chatbot requests
├── generative-ai.js          # Constructs prompts and parses AI responses
├── constants.js              # Centralized constants like API URLs
├── utils.js                  # Helper utility functions
├── styles.css                # CSS for popup display
├── icon.png                  # Extension icon
└── README.md                 # Documentation file
```

---

## ⚙️ How It Works

1. User selects a word or phrase on a webpage.
2. The `content.js` script captures the text and sends it to the background script.
3. The background script uses `api.js` and `generative-ai.js` to send the text to a chatbot API.
4. The AI responds with a relevant explanation or definition.
5. The result is displayed in a styled popup on the same page.

---

## 🚀 Installation

1. Download or clone this repository.
2. Open Google Chrome and navigate to: `chrome://extensions/`
3. Enable **Developer mode** (top-right corner).
4. Click **Load unpacked**.
5. Select the `chatbot/` folder.
6. The extension will now be active and ready to use.

---

## ✅ Use Case

Reading an article and stuck on a word?  
👉 Just highlight it and let the chatbot explain it for you—smart, instant, and contextual.

---

## 📄 License

This project is created for academic and educational use only.

---

## ✨ Credits

Developed by:
- Harshal Nandeshwar (A-44)  
- Jivan Karlapudi (A-49)  
- Deepa Yadav (A-37)  
**GH Raisoni College of Engineering and Management, Pune (Wagholi)**

