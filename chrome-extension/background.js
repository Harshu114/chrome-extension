// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("Word Meaning & Chatbot Extension Installed!");

    // Store the Gemini API key securely in Chrome storage
    chrome.storage.sync.set({ G_API_KEY: "AlzaSyCHM4bSSWF8LyrbcYf3Zh_s2m4dk1zQjJk" });

    // Add context menu for word meaning
    chrome.contextMenus.create({
        id: "findWordMeaning",
        title: "Find Meaning",
        contexts: ["selection"]
    });
});

let meaningCache = {};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "findWordMeaning") {
        let selectedWord = info.selectionText.trim().toLowerCase();

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getSelectionCoordinates
        }, (injectionResults) => {
            if (injectionResults && injectionResults[0].result) {
                let { x, y } = injectionResults[0].result;

                if (meaningCache[selectedWord]) {
                    showDefinitionPopup(tab.id, selectedWord, meaningCache[selectedWord], x, y);
                } else {
                    fetchMeaning(selectedWord, tab.id, x, y);
                }
            }
        });
    }
});

function fetchMeaning(word, tabId, x, y) {
    fetch(`https://www.google.com/search?hl=en&q=define:${word}`)
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let meaningElement = doc.querySelector(".BNeawe.iBp4i.AP7Wnd");
            let meaning = meaningElement ? meaningElement.innerText : "No definition found.";

            meaningCache[word] = meaning;
            showDefinitionPopup(tabId, word, meaning, x, y);
        })
        .catch(error => {
            console.error("Error fetching meaning:", error);
            showDefinitionPopup(tabId, word, "Error fetching meaning.", x, y);
        });
}

function getSelectionCoordinates() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return null;
    let range = selection.getRangeAt(0);
    let rect = range.getBoundingClientRect();
    return { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
}

function showDefinitionPopup(tabId, word, meaning, x, y) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (word, meaning, x, y) => {
            let existingPopup = document.getElementById("word-popup");
            if (existingPopup) existingPopup.remove();

            let popup = document.createElement("div");
            popup.id = "word-popup";
            popup.style.cssText = `
                position: absolute;
                top: ${y + 10}px;
                left: ${x + 10}px;
                background: black;
                color: white;
                border: 1px solid white;
                padding: 10px;
                font-size: 14px;
                box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
                border-radius: 5px;
                z-index: 10000;
                text-align: center;
                max-width: 250px;
                word-wrap: break-word;
            `;

            popup.innerHTML = `
                <strong>${word}</strong>: ${meaning}
                <br><br>
                <button id="speak-btn" style="padding: 5px 10px; background:#007bff; color:white; border:none; cursor:pointer;">🔊 Speak</button>
                <button id="closePopup" style="padding: 5px 10px; background:#dc3545; color:white; border:none; cursor:pointer;">Close</button>
            `;

            document.body.appendChild(popup);

            document.getElementById("closePopup").addEventListener("click", () => popup.remove());

            document.getElementById("speak-btn").addEventListener("click", () => {
                let utterance = new SpeechSynthesisUtterance(meaning);
                utterance.lang = "en-US";
                speechSynthesis.speak(utterance);
            });

            setTimeout(() => popup.remove(), 10000);

            function closePopup(event) {
                if (!popup.contains(event.target)) {
                    popup.remove();
                    document.removeEventListener("click", closePopup);
                }
            }

            setTimeout(() => document.addEventListener("click", closePopup), 100);
        },
        args: [word, meaning, x, y]
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "fetchChatbotResponse") {
        chrome.storage.sync.get("G_API_KEY", (data) => {
            if (!data || !data.G_API_KEY) {
                sendResponse({ success: false, error: "API key not found" });
                return;
            }

            fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${data.G_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: {
                        text: `You are a **friendly, humorous AI with an Indian personality**.
                        You use light humor, casual tone, and a bit of desi (Indian) style in your responses.
                        Keep things fun and engaging while staying informative.

                        **User:** ${request.messages?.[request.messages.length - 1]?.content || ""} 
                        **Chatbot:**`
                    },
                    temperature: 0.8
                })
            })
            .then(response => response.json())
            .then(data => {
                if (!data || !data.candidates || !data.candidates[0]) {
                    throw new Error("Invalid API response format.");
                }
                let botReply = data.candidates[0].output || "Sorry, I couldn't generate a response.";
                sendResponse({ success: true, reply: botReply });
            })
            .catch(error => {
                console.error("Chatbot API error:", error);
                sendResponse({ success: false, error: "Error fetching response from Gemini API." });
            });
        });
        return true;
    }
});