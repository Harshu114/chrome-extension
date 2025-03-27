function createPopup(word, meaning, x, y) {
    let existingPopup = document.getElementById("word-meaning-popup");
    if (existingPopup) existingPopup.remove(); // Remove old popups

    let popup = document.createElement("div");
    popup.id = "word-meaning-popup";
    popup.innerHTML = `
        <strong>${word}</strong>: ${meaning}
        <br>
        <button id="more-info-btn" style="margin-top: 5px; padding: 5px; background:#007bff; color:white; border:none; cursor:pointer;">More Info</button>
        <button id="close-popup-btn" style="margin-top: 5px; padding: 5px; background:#dc3545; color:white; border:none; cursor:pointer;">Close</button>
    `;

    popup.style.cssText = `
        position: fixed;
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

    document.body.appendChild(popup);

    // Ensure popup stays within the viewport
    let popupRect = popup.getBoundingClientRect();
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    // Adjust position if popup overflows the viewport
    if (x + popupRect.width > viewportWidth) x = viewportWidth - popupRect.width - 10;
    if (y + popupRect.height > viewportHeight) y = viewportHeight - popupRect.height - 10;

    popup.style.top = `${y + 10}px`;
    popup.style.left = `${x + 10}px`;

    // Close popup when clicking outside
    function closePopup(event) {
        if (!popup.contains(event.target)) {
            popup.remove();
            document.removeEventListener("click", closePopup);
        }
    }

    // Add event listener to close popup when clicking outside
    setTimeout(() => document.addEventListener("click", closePopup), 0);

    // Prevent the popup from closing when clicking inside it
    popup.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.getElementById("more-info-btn").addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent closing when clicking the button
        chrome.runtime.sendMessage({ type: "openPopup", word });
    });

    document.getElementById("close-popup-btn").addEventListener("click", (event) => {
        popup.remove();
    });
}
