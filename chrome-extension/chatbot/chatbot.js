function sendMessage() {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) return;
  
    addMessage(userInput, 'user-message');
    getMeaning(userInput);
    document.getElementById('userInput').value = '';
  }
  
  function addMessage(text, className) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = className;
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  function getMeaning(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`) // ✅ Fixed backticks
      .then(response => response.json())
      .then(data => {
        const meaning = data[0]?.meanings?.[0]?.definitions?.[0]?.definition || "No meaning found.";
        addMessage(meaning, 'bot-message');
      })
      .catch(() => {
        addMessage("Sorry, I couldn't find the meaning.", 'bot-message');
      });
  }
  
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
  
  function startListening() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
  
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      document.getElementById('userInput').value = text;
      sendMessage();
    };
  
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  
    recognition.start();
  }

  