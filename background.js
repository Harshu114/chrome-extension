chrome.runtime.onInstalled.addListener(() => {
  console.log("Word Meaning & Chatbot Extension Installed!");

  // Add context menu for word meaning
  chrome.contextMenus.create({
      id: "findWordMeaning",
      title: "Find Meaning",
      contexts: ["selection"]
  });

  // Add context menu to toggle dark mode
  chrome.contextMenus.create({
      id: "toggleDarkMode",
      title: "Toggle Dark Mode",
      contexts: ["all"]
  });
});

// Store cached meanings to avoid excessive API calls
let meaningCache = {};

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "findWordMeaning") {
      let selectedWord = info.selectionText.trim().toLowerCase();

      if (meaningCache[selectedWord]) {
          showDefinitionPopup(tab.id, selectedWord, meaningCache[selectedWord]);
      } else {
          fetchMeaning(selectedWord, tab.id);
      }
  } else if (info.menuItemId === "toggleDarkMode") {
      toggleDarkMode(tab.id);
  }
});

// Fetch meaning and store in cache
function fetchMeaning(word, tabId) {
  chrome.runtime.sendMessage({ type: "fetchMeaning", word }, (response) => {
      if (response.success) {
          let meaning = response.data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";
          meaningCache[word] = meaning;
          showDefinitionPopup(tabId, word, meaning);
      } else {
          showDefinitionPopup(tabId, word, "Error fetching meaning.");
      }
  });
}

// Show word meaning in a styled popup with TTS & dark mode
function showDefinitionPopup(tabId, word, meaning) {
  chrome.storage.sync.get("darkMode", (data) => {
      let darkMode = data.darkMode || false;

      chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: (word, meaning, darkMode) => {
              // Remove existing popup if any
              let existingPopup = document.getElementById("word-popup");
              if (existingPopup) existingPopup.remove();

              // Create popup container
              let popup = document.createElement("div");
              popup.id = "word-popup";
              popup.style.position = "fixed";
              popup.style.bottom = "20px";
              popup.style.right = "20px";
              popup.style.padding = "15px";
              popup.style.width = "280px";
              popup.style.borderRadius = "8px";
              popup.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.2)";
              popup.style.fontSize = "14px";
              popup.style.zIndex = "10000";
              popup.style.textAlign = "center";
              popup.style.transition = "opacity 0.3s ease-in-out";

              // Apply dark mode styles
              if (darkMode) {
                  popup.style.background = "#1e1e1e";
                  popup.style.color = "#f9f9f9";
                  popup.style.border = "1px solid #444";
              } else {
                  popup.style.background = "#ffffff";
                  popup.style.color = "#333";
                  popup.style.border = "1px solid #ccc";
              }

              // Popup content
              popup.innerHTML = `
                  <strong>${word}</strong>: ${meaning} <br><br>
                  <button id="speak-btn" style="padding: 5px 10px; margin-right: 5px; background:#007bff; color:white; border:none; cursor:pointer;">🔊 Speak</button>
                  <button id="closePopup" style="padding: 5px 10px; background:#dc3545; color:white; border:none; cursor:pointer;">Close</button>
              `;

              document.body.appendChild(popup);

              // Close button functionality
              document.getElementById("closePopup").addEventListener("click", () => popup.remove());

              // Text-to-Speech functionality
              document.getElementById("speak-btn").addEventListener("click", () => {
                  let utterance = new SpeechSynthesisUtterance(meaning);
                  utterance.lang = "en-US";
                  speechSynthesis.speak(utterance);
              });

              // Auto-remove popup after 10 seconds
              setTimeout(() => popup.remove(), 10000);
          },
          args: [word, meaning, darkMode]
      });
  });
}

// Toggle Dark Mode in storage and apply across sessions
function toggleDarkMode(tabId) {
  chrome.storage.sync.get("darkMode", (data) => {
      let newMode = !data.darkMode;
      chrome.storage.sync.set({ darkMode: newMode });

      // Notify the user
      chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: (newMode) => {
              alert("Dark mode " + (newMode ? "enabled" : "disabled"));
          },
          args: [newMode]
      });
  });
}

// Handle messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "fetchMeaning") {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${request.word}`)
          .then(response => response.json())
          .then(data => {
              sendResponse({ success: true, data });
          })
          .catch(error => {
              console.error("Error fetching meaning:", error);
              sendResponse({ success: false, error: error.message });
          });

      return true; // Required for async response
  }
});
