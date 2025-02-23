document.addEventListener("mouseup", (event) => {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        showMeaningPopup(selectedText, event.clientX, event.clientY);
    }
});

function showMeaningPopup(word, x, y) {
    chrome.runtime.sendMessage({ type: "fetchMeaning", word }, (response) => {
        if (response.success) {
            let meaning = response.data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";
            createPopup(word, meaning, x, y);
        } else {
            console.error("Error fetching meaning:", response.error);
        }
    });
}

function createPopup(word, meaning, x, y) {
    let existingPopup = document.getElementById("word-meaning-popup");
    if (existingPopup) existingPopup.remove(); // Remove old popups

    let popup = document.createElement("div");
    popup.id = "word-meaning-popup";
    popup.innerHTML = `
        <strong>${word}</strong>: ${meaning}
        <br><button id="more-info-btn">More Info</button>
    `;
    popup.style.cssText = `
        position: fixed;
        top: ${y + 10}px;
        left: ${x + 10}px;
        background: white;
        border: 1px solid black;
        padding: 8px;
        font-size: 14px;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        transition: opacity 0.5s ease-in-out;
    `;

    document.body.appendChild(popup);

    setTimeout(() => popup.style.opacity = "0", 3000); // Fade out after 3 seconds
    setTimeout(() => popup.remove(), 3500); // Remove popup after fade-out

    document.getElementById("more-info-btn").addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "openPopup", word });
    });
}
