// ============================================
// CHAT - Lógica de mensajes
// ============================================

// Historial de conversación (se mantiene en memoria durante la sesión)
let conversationHistory = [];

function initChat() {
  const input = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send');

  // Enviar con botón
  btnSend.addEventListener('click', sendMessage);

  // Enviar con Enter (Shift+Enter hace salto de línea)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();

  if (!text) return;

  // Muestra el mensaje del usuario
  appendMessage('user', text);
  input.value = '';

  // Agrega al historial
  conversationHistory.push({
    role: 'user',
    parts: [{ text }]
  });

  // Por ahora respuesta simulada (luego conectamos Gemini)
  showTyping(true);
  setTimeout(() => {
    const response = 'Interesante. Déjeme analizar los hechos antes de responder precipitadamente.';
    appendMessage('sherlock', response);
    conversationHistory.push({
      role: 'model',
      parts: [{ text: response }]
    });
    showTyping(false);
  }, 1000);
}

function appendMessage(sender, text) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.classList.add('message', sender === 'user' ? 'message-user' : 'message-sherlock');

  div.innerHTML = `
    <div class="message-sender">${sender === 'user' ? 'Tú' : 'Sherlock Holmes'}</div>
    <div class="message-text">${text}</div>
  `;

  messages.appendChild(div);
  scrollToBottom();
}

function showTyping(visible) {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.style.display = visible ? 'block' : 'none';
  }
}

function scrollToBottom() {
  const messages = document.getElementById('chat-messages');
  messages.scrollTop = messages.scrollHeight;
}