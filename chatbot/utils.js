window.calculateIconRotation = function(iconElement, mouseX, mouseY) {
    const iconRect = iconElement.getBoundingClientRect();
    const iconCenterX = iconRect.left + iconRect.width / 2;
    const iconCenterY = iconRect.top + iconRect.height / 2;
    const angleRadians = Math.atan2(mouseY - iconCenterY, mouseX - iconCenterX);
    let angleDeg = angleRadians * (180 / Math.PI);
    
    const cursorOnTheLeft = mouseX < iconCenterX;
    if (cursorOnTheLeft) {
        angleDeg += 180;
    }
    return {
        angle: angleDeg,
        flip: cursorOnTheLeft ? 'scaleX(-1)' : ''
    };
};

window.getPageContext = function() {
    const text = document.body.innerText;
    const promptText = "Hello! How can we help you today?";
    return text.substring(0, text.indexOf(promptText) + promptText.length);
};

window.createResizeHandles = function(chatUI, edges) {
    Object.entries(edges).forEach(([edge, cursor]) => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-handle-${edge.length === 1 ? 'ns' : 'corner'}`;
        handle.style.cursor = cursor;
        
        if (edge.includes('n')) handle.style.top = '0';
        if (edge.includes('s')) handle.style.bottom = '0';
        if (edge.includes('e')) handle.style.right = '0';
        if (edge.includes('w')) handle.style.left = '0';
        
        chatUI.appendChild(handle);
        return handle;
    });
};

window.handleResize = function(e, chatUI, startDimensions, resizeSide) {
    const dx = e.clientX - startDimensions.startX;
    const dy = e.clientY - startDimensions.startY;
    let newWidth = startDimensions.startWidth;
    let newHeight = startDimensions.startHeight;
    const { CHAT_CONFIG } = window;

    if (resizeSide.includes('e')) {
        newWidth = Math.max(startDimensions.startWidth + dx, CHAT_CONFIG.MIN_WIDTH);
        chatUI.style.width = `${newWidth}px`;
    }
    if (resizeSide.includes('s')) {
        newHeight = Math.max(startDimensions.startHeight + dy, CHAT_CONFIG.MIN_HEIGHT);
        chatUI.style.height = `${newHeight}px`;
    }
    if (resizeSide.includes('w')) {
        newWidth = Math.max(startDimensions.startWidth - dx, CHAT_CONFIG.MIN_WIDTH);
        chatUI.style.width = `${newWidth}px`;
    }
    if (resizeSide.includes('n')) {
        newHeight = Math.max(startDimensions.startHeight - dy, CHAT_CONFIG.MIN_HEIGHT);
        chatUI.style.height = `${newHeight}px`;
    }

    return { newWidth, newHeight };
};

window.updateChatPosition = function(chatUI, chatBox) {
    const chatBoxRect = chatBox.getBoundingClientRect();
    chatUI.style.bottom = `${window.innerHeight - chatBoxRect.top + 10}px`;
    chatUI.style.right = `${window.innerWidth - chatBoxRect.right + 10}px`;
};