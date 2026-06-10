// ============================================
// CHAT - Lógica de mensajes con Gemini AI
// ============================================

import { formatMessage, parseGeminiResponse, isValidMessage } from './utils.js';

// Historial de conversación en memoria
let conversationHistory = [];

export function initChat() {
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

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();

  // Valida que no esté vacío
  if (!isValidMessage(text)) return;

  // Deshabilita input mientras espera respuesta
  setInputEnabled(false);
  input.value = '';

  // Muestra mensaje del usuario
  appendMessage('user', text);

  // Agrega al historial
  conversationHistory.push(formatMessage('user', text));

  // Muestra indicador de escritura
  showTyping(true);

  try {
    const response = await fetch('/api/functions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: conversationHistory })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la respuesta');
    }

    const data = await response.json();
    const replyText = parseGeminiResponse(data);

    // Agrega respuesta al historial
    conversationHistory.push(formatMessage('model', replyText));

    // Muestra respuesta de Sherlock
    appendMessage('sherlock', replyText);

  } catch (error) {
    appendMessage('error', 'Error al conectar con Sherlock. Inténtalo de nuevo.');
  } finally {
    showTyping(false);
    setInputEnabled(true);
    document.getElementById('chat-input').focus();
  }
}

export function appendMessage(sender, text) {
  const messages = document.getElementById('chat-messages');

  const div = document.createElement('div');

  if (sender === 'error') {
    div.classList.add('message', 'message-error');
    div.innerHTML = `<div class="message-text">⚠️ ${text}</div>`;
  } else {
    div.classList.add('message', sender === 'user' ? 'message-user' : 'message-sherlock');
    div.innerHTML = `
      <div class="message-sender">${sender === 'user' ? 'Tú' : 'Sherlock Holmes'}</div>
      <div class="message-text">${text}</div>
    `;
  }

  messages.appendChild(div);
  scrollToBottom();
}

function showTyping(visible) {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.style.display = visible ? 'block' : 'none';
  }
}

function setInputEnabled(enabled) {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('btn-send');
  if (input) input.disabled = !enabled;
  if (btn) btn.disabled = !enabled;
}

function scrollToBottom() {
  const messages = document.getElementById('chat-messages');
  messages.scrollTop = messages.scrollHeight;
}