document.addEventListener("DOMContentLoaded", async () => {
    // Get the current tab's word (if passed)
    chrome.storage.local.get("selectedWord", async (data) => {
        if (data.selectedWord) {
            await updatePopup(data.selectedWord);
        }
    });

    // Close the popup when clicking the close button
    document.getElementById("close-btn")?.addEventListener("click", () => {
        window.close();
    });

    // Toggle Dark Mode
    const darkModeBtn = document.getElementById("toggle-darkmode");
    chrome.storage.sync.get("darkMode", (data) => {
        if (data.darkMode) {
            document.body.classList.add("dark-mode");
        }
    });

    darkModeBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        let isDarkMode = document.body.classList.contains("dark-mode");
        chrome.storage.sync.set({ darkMode: isDarkMode });
    });

    // Text-to-Speech
    document.getElementById("speak-btn")?.addEventListener("click", () => {
        let text = document.getElementById("word-title")?.textContent || "";
        if (text) speakText(text);
    });

    // Prevent closing when clicking inside the meaning box
    const meaningBox = document.getElementById("word-box");
    meaningBox?.addEventListener("click", (event) => event.stopPropagation());

    // Close meaning box when clicking outside
    document.addEventListener("click", (event) => {
        if (meaningBox && !meaningBox.contains(event.target)) {
            meaningBox.style.display = "none";
        }
    });
});

// Fetch and update the popup with word meaning
async function updatePopup(word) {
    try {
        let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        let data = await response.json();

        if (!data || !Array.isArray(data) || !data[0]?.meanings?.length) {
            throw new Error("Invalid API response");
        }

        let definition = data[0].meanings[0].definitions[0]?.definition || "No definition found.";
        let meaningBox = document.getElementById("word-box");

        if (meaningBox) {
            meaningBox.style.display = "block"; // Show the meaning box
        }
        
        document.getElementById("word-title")?.textContent = word;
        document.getElementById("word-definition")?.textContent = definition;
    } catch (error) {
        console.error("Error fetching meaning:", error);
        document.getElementById("word-definition")?.textContent = "Error fetching meaning.";
    }
}

// Text-to-Speech Function
function speakText(text) {
    if (!text) return;
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // English pronunciation
    speechSynthesis.speak(utterance);
}
