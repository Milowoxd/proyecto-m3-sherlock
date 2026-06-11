import { formatMessage, parseGeminiResponse, isValidMessage } from './utils.js';

// ============================================
// ESTADO
// ============================================
let conversationHistory = [];
let currentSessionId = null;

// ============================================
// LOCALSTORAGE
// ============================================
function getSessions() {
  try {
    return JSON.parse(localStorage.getItem('sherlock-sessions') || '{}');
  } catch {
    return {};
  }
}

function saveSession() {
  if (!currentSessionId || conversationHistory.length === 0) return;
  const sessions = getSessions();
  const firstUserMsg = conversationHistory.find(m => m.role === 'user');
  const title = firstUserMsg
    ? firstUserMsg.parts[0].text.slice(0, 40)
    : 'Nueva conversación';

  sessions[currentSessionId] = {
    id: currentSessionId,
    title,
    history: conversationHistory,
    updatedAt: Date.now()
  };
  localStorage.setItem('sherlock-sessions', JSON.stringify(sessions));
  renderSidebar();
}

function loadSession(sessionId) {
  const sessions = getSessions();
  const session = sessions[sessionId];
  if (!session) return;

  currentSessionId = sessionId;
  conversationHistory = session.history;

  const messages = document.getElementById('chat-messages');
  messages.innerHTML = '';

  conversationHistory.forEach(msg => {
    const sender = msg.role === 'user' ? 'user' : 'sherlock';
    appendMessage(sender, msg.parts[0].text, false);
  });

  scrollToBottom();
  renderSidebar();
}

function renderSidebar() {
  const container = document.getElementById('sidebar-sessions');
  if (!container) return;

  const sessions = getSessions();
  const sorted = Object.values(sessions).sort((a, b) => b.updatedAt - a.updatedAt);

  if (sorted.length === 0) {
    container.innerHTML = '<p class="sidebar-empty">Sin conversaciones guardadas</p>';
    return;
  }

  container.innerHTML = sorted.map(session => `
    <div class="session-item ${session.id === currentSessionId ? 'active' : ''}"
         onclick="loadSessionById('${session.id}')">
      <div class="session-title">${session.title}</div>
      <div class="session-date">${formatDate(session.updatedAt)}</div>
    </div>
  `).join('');
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

// ============================================
// INIT
// ============================================
export function initChat() {
  currentSessionId = 'session-' + Date.now();
  conversationHistory = [];
  renderSidebar();

  const input = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send');

  btnSend.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// ============================================
// ENVIAR MENSAJE
// ============================================
async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!isValidMessage(text)) return;

  setInputEnabled(false);
  input.value = '';

  appendMessage('user', text);
  conversationHistory.push(formatMessage('user', text));

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

    conversationHistory.push(formatMessage('model', replyText));
    appendMessage('sherlock', replyText);
    saveSession();

  } catch (error) {
    appendMessage('error', 'Holmes no está disponible en este momento. Quizás está en uno de sus experimentos. Inténtalo en un momento.');
  } finally {
    showTyping(false);
    setInputEnabled(true);
    document.getElementById('chat-input').focus();
  }
}

// ============================================
// DOM
// ============================================
export function appendMessage(sender, text, scroll = true) {
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
  if (scroll) scrollToBottom();
}

function showTyping(visible) {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.style.display = visible ? 'block' : 'none';
}

function setInputEnabled(enabled) {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('btn-send');
  if (input) input.disabled = !enabled;
  if (btn) btn.disabled = !enabled;
}

function scrollToBottom() {
  const messages = document.getElementById('chat-messages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}

// ============================================
// FUNCIONES GLOBALES (para onclick en HTML)
// ============================================
window.newChat = function () {
  currentSessionId = 'session-' + Date.now();
  conversationHistory = [];

  const messages = document.getElementById('chat-messages');
  messages.innerHTML = `
    <div class="message message-sherlock">
      <div class="message-sender">Sherlock Holmes</div>
      <div class="message-text">
        Elemental, mi estimado visitante. No pierda el tiempo con formalismos, dígame directamente qué necesita.
      </div>
    </div>
  `;
  renderSidebar();
  document.getElementById('chat-input').focus();
};

window.loadSessionById = function (sessionId) {
  loadSession(sessionId);
};

window.clearAllChats = function () {
  if (!confirm('¿Eliminar todas las conversaciones con Holmes? Esta acción no se puede deshacer.')) return;;
  localStorage.removeItem('sherlock-sessions');
  window.newChat();
};