const { 
    CHAT_CONFIG, 
    UI_ELEMENTS, 
    MESSAGES, 
    URLS,
    calculateIconRotation, 
    getPageContext, 
    createResizeHandles, 
    handleResize, 
    updateChatPosition,
    getApiKey,
    setApiKey,
    generateResponse
} = window;

let apiKey = null;
let isDragging = false;
let isResizing = false;
let dragOffsetX, dragOffsetY;
let startPosX, startPosY;
let hasMoved = false;
let resizeSide;
let startDimensions = {};

function createChatBox() {
    const chatBox = document.createElement('div');
    chatBox.id = UI_ELEMENTS.CHAT_BOX_ID;
    chatBox.className = 'chat-box';
    chatBox.title = 'Open Chat';

    const chatIcon = document.createElement('img');
    chatIcon.src = chrome.runtime.getURL(URLS.CHAT_ICON);
    chatIcon.className = 'chat-icon';
    chatIcon.draggable = false;

    chatBox.appendChild(chatIcon);
    document.body.appendChild(chatBox);

    // Add event listeners for drag and click functionality
    chatBox.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    return chatBox;
}

function createChatUI() {
    const chatUI = document.createElement('div');
    chatUI.id = UI_ELEMENTS.CHAT_UI_ID;
    chatUI.className = 'chat-ui';

    const header = createHeader();
    chatUI.appendChild(header);

    document.body.appendChild(chatUI);
    return chatUI;
}

function createHeader() {
    const header = document.createElement('div');
    header.className = 'chat-header';

    const leftSection = document.createElement('div');
    leftSection.style.display = 'flex';
    leftSection.style.alignItems = 'center';
    leftSection.style.flex = '1';

    const linkIcon = document.createElement('a');
    linkIcon.href = URLS.API_KEY_PAGE;

    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL(URLS.CHAT_ICON);
    icon.className = 'chat-header-icon';

    const text = document.createElement('span');
    text.textContent = 'Chat';

    linkIcon.appendChild(icon);
    leftSection.appendChild(linkIcon);
    leftSection.appendChild(text);

    const goBackButton = document.createElement('button');
    goBackButton.className = 'go-back-button';
    goBackButton.title = 'Go back to API key setup';
    goBackButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    `;
    goBackButton.onclick = async () => {
        const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
        // Clear existing content
        while (chatUI.firstChild) {
            chatUI.removeChild(chatUI.firstChild);
        }
        // Clear API key
        await setApiKey('');
        apiKey = null;
        // Add header back
        chatUI.appendChild(createHeader());
        // Show API key form
        const apiKeyForm = createApiKeyForm();
        chatUI.appendChild(apiKeyForm);
    };

    header.appendChild(leftSection);
    header.appendChild(goBackButton);

    return header;
}

function createApiKeyForm() {
    const form = document.createElement('div');
    form.id = UI_ELEMENTS.API_KEY_FORM_ID;
    form.className = 'api-key-form';

    const apiKeyLink = document.createElement('a');
    apiKeyLink.href = URLS.API_KEY_PAGE;
    apiKeyLink.innerText = MESSAGES.GET_API_KEY_LINK_TEXT;
    apiKeyLink.target = '_blank';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = UI_ELEMENTS.API_KEY_INPUT_ID;
    input.className = 'api-key-input';
    input.placeholder = MESSAGES.API_KEY_PLACEHOLDER;

    const button = document.createElement('button');
    button.id = UI_ELEMENTS.FORM_BUTTON_ID;
    button.className = 'api-key-button';
    button.innerText = MESSAGES.SET_API_KEY_BUTTON;
    button.onclick = async () => {
        const newApiKey = document.getElementById(UI_ELEMENTS.API_KEY_INPUT_ID).value;
        const success = await setApiKey(newApiKey);
        if (success) {
            apiKey = newApiKey;
            form.style.display = 'none';
            initializeChatUI();
        }
    };

    form.appendChild(apiKeyLink);
    form.appendChild(input);
    form.appendChild(button);

    return form;
}

function initializeChatUI() {
    const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
    if (!chatUI.querySelector(`#${UI_ELEMENTS.CHAT_MESSAGES_ID}`)) {
        const messagesDiv = document.createElement('div');
        messagesDiv.id = UI_ELEMENTS.CHAT_MESSAGES_ID;
        messagesDiv.className = 'chat-messages';
        messagesDiv.innerHTML = `<p>${MESSAGES.WELCOME}</p>`;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = UI_ELEMENTS.CHAT_INPUT_ID;
        input.className = 'chat-input';
        input.placeholder = 'Type a message...';
        input.addEventListener('keypress', handleInputKeyPress);

        chatUI.appendChild(messagesDiv);
        chatUI.appendChild(input);
    }
}

async function handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        const message = e.target.value;
        e.target.value = '';
        await sendMessage(message);
    }
}

async function sendMessage(message) {
    const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES_ID);
    if (chatMessages) {
        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'user-message';
        userMessageDiv.innerHTML = `<p class="message-bubble">${message}</p>`;
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Get and add bot response
        const context = getPageContext();
        const response = await generateResponse(context, message);
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'bot-message';
        botMessageDiv.innerHTML = `<p class="message-bubble">${response}</p>`;
        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function setupDragAndResize() {
    const chatBox = document.getElementById(UI_ELEMENTS.CHAT_BOX_ID);
    const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);

    chatBox.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    const edges = {
        'n': 'ns-resize',
        'e': 'ew-resize',
        's': 'ns-resize',
        'w': 'ew-resize',
        'ne': 'nesw-resize',
        'nw': 'nwse-resize',
        'se': 'nwse-resize',
        'sw': 'nesw-resize'
    };

    createResizeHandles(chatUI, edges);

    document.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) {
            isResizing = true;
            resizeSide = Array.from(e.target.classList)
                .find(cls => cls.startsWith('resize-handle-'))
                ?.replace('resize-handle-', '');
            startDimensions = {
                startX: e.clientX,
                startY: e.clientY,
                startWidth: parseInt(getComputedStyle(chatUI).width),
                startHeight: parseInt(getComputedStyle(chatUI).height)
            };
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            handleResize(e, chatUI, startDimensions, resizeSide);
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}

function handleDragStart(e) {
    isDragging = true;
    dragOffsetX = e.clientX - e.target.getBoundingClientRect().left;
    dragOffsetY = e.clientY - e.target.getBoundingClientRect().top;
    startPosX = e.clientX;
    startPosY = e.clientY;
    hasMoved = false;
    e.target.style.cursor = 'grabbing';
}

function handleDragMove(e) {
    if (isDragging) {
        const chatBox = document.getElementById(UI_ELEMENTS.CHAT_BOX_ID);
        const moveX = Math.abs(e.clientX - startPosX);
        const moveY = Math.abs(e.clientY - startPosY);
        
        if (moveX > 1 || moveY > 1) {
            hasMoved = true;
        }
        
        chatBox.style.left = (e.clientX - dragOffsetX) + 'px';
        chatBox.style.top = (e.clientY - dragOffsetY) + 'px';
        chatBox.style.right = 'auto';
        chatBox.style.bottom = 'auto';

        const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
        if (chatUI) {
            updateChatPosition(chatUI, chatBox);
        }
    }
}

function handleDragEnd(e) {
    if (isDragging) {
        isDragging = false;
        e.target.style.cursor = 'pointer';
        if (!hasMoved) {
            toggleChatUI();
        }
    }
}

async function toggleChatUI() {
    let chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
    const chatBox = document.getElementById(UI_ELEMENTS.CHAT_BOX_ID);
    
    apiKey = await getApiKey();

    if (!chatUI) {
        chatUI = createChatUI();
        if (!apiKey) {
            const apiKeyForm = createApiKeyForm();
            chatUI.appendChild(apiKeyForm);
        } else {
            initializeChatUI();
        }
        setupDragAndResize();
    } else {
        updateChatPosition(chatUI, chatBox);
        const newDisplay = chatUI.style.display === 'none' ? 'flex' : 'none';
        chatUI.style.display = newDisplay;
        if (apiKey) {
            initializeChatUI();
        }
    }
}

// Initialize the chat box
const chatBox = createChatBox();

// Add mouse move listener for icon rotation effect
document.addEventListener('mousemove', (e) => {
    const chatIcon = document.querySelector(`#${UI_ELEMENTS.CHAT_BOX_ID} img`);
    if (chatIcon) {
        const { angle, flip } = calculateIconRotation(chatIcon, e.clientX, e.clientY);
        //console.log('[Chat UI] Icon rotation calculated:', { angle, flip });
        // Uncomment the following line to enable icon rotation
        // chatBox.style.transform = `rotate(${angle}deg) ${flip}`;
    }
});
(function () {
    document.addEventListener("mouseup", async (event) => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
  
      if (!text || text.split(/\s+/).length > 1) return;
  
      const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;
  
      try {
        const res = await fetch(apiURL);
        const data = await res.json();
  
        const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition || "No definition found.";
        showWordTooltip(text, definition, event.pageX, event.pageY);
      } catch (err) {
        showWordTooltip(text, "Error fetching meaning.", event.pageX, event.pageY);
      }
    });
  
    function showWordTooltip(word, definition, x, y) {
      removeWordTooltip();
  
      const tooltip = document.createElement("div");
      tooltip.className = "word-tooltip-extension-box";
      tooltip.innerHTML = `<strong>${word}:</strong> ${definition}`;
  
      Object.assign(tooltip.style, {
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px",
        borderRadius: "8px",
        maxWidth: "300px",
        zIndex: 9999,
        fontSize: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      });
  
      document.body.appendChild(tooltip);
      setTimeout(removeWordTooltip, 8000);
    }
  
    function removeWordTooltip() {
      const el = document.querySelector(".word-tooltip-extension-box");
      if (el) el.remove();
    }
  })();
  