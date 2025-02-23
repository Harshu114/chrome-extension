document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.getElementById("chat-body");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const closeChat = document.getElementById("close-chat");

    let conversationHistory = []; // Stores chat history for context

    // Event Listeners
    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });

    closeChat.addEventListener("click", () => {
        document.getElementById("chatbot-container").style.display = "none";
    });

    function sendMessage() {
        let userMessage = chatInput.value.trim(); // Trim spaces

        if (userMessage === "") return; // Prevent sending empty messages

        displayMessage("You: " + userMessage, "user");
        chatInput.value = ""; // Clear input after sending

        // Add message to chat history
        conversationHistory.push({ role: "user", content: userMessage });

        // Show "Bot is typing..." placeholder
        let loadingMsg = displayMessage("Bot: Typing...", "bot");

        // Secure API call via background script
        chrome.runtime.sendMessage({ type: "fetchChatbotResponse", messages: conversationHistory }, (response) => {
            chatBody.removeChild(loadingMsg); // Remove "Typing..." message

            if (response && response.reply) {
                displayMessage("Bot: " + response.reply, "bot");
                conversationHistory.push({ role: "assistant", content: response.reply });
            } else {
                displayMessage("Bot: Sorry, I couldn't fetch a response.", "bot");
            }
        });
    }

    function displayMessage(message, sender) {
        let msgDiv = document.createElement("div");
        msgDiv.className = sender;
        msgDiv.textContent = message;
        chatBody.appendChild(msgDiv);

        // Smooth scrolling to the latest message
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 100);

        return msgDiv; // Return reference (for removing "Typing..." later)
    }
});
