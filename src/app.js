 // ============================================
// ROUTING - SPA con History API
// ============================================

// Las tres vistas en HTML
function renderHome() {
  return `
    <div class="home-container">
      <div class="home-avatar">🔍</div>
      <h1 class="home-title">Sherlock Holmes</h1>
      <p class="home-subtitle">Consulting Detective · 221B Baker Street</p>
      <p class="home-description">
        El detective más brillante de Londres está disponible para conversar. 
        Maestro de la deducción, experto en disfraces y enemigo del crimen. 
        No esperes que sea amable, pero sí que sea brillante.
      </p>
      <button class="btn-primary" onclick="navigateTo('/chat')">
        Iniciar conversación
      </button>
    </div>
  `;
}

function renderChat() {
  return `
    <div class="chat-container">
      <div class="chat-messages" id="chat-messages">
        <div class="message message-sherlock">
          <div class="message-sender">Sherlock Holmes</div>
          <div class="message-text">
            Elemental, mi estimado visitante. Ha llegado hasta aquí con alguna pregunta en mente. 
            No pierda el tiempo con formalismos, dígame directamente qué necesita.
          </div>
        </div>
      </div>
      <div class="typing-indicator" id="typing-indicator" style="display:none">
        Sherlock está deduciendo...
      </div>
      <div class="chat-input-area">
        <textarea 
          class="chat-input" 
          id="chat-input" 
          placeholder="Escriba su consulta..." 
          rows="2"
        ></textarea>
        <button class="btn-send" id="btn-send">Enviar</button>
      </div>
    </div>
  `;
}

function renderAbout() {
  return `
    <div class="about-container">
      <h2 class="about-title">// ABOUT</h2>
      
      <div class="about-section">
        <h3>El Personaje</h3>
        <p>
          Sherlock Holmes es el detective ficticio más famoso de la literatura, 
          creado por Arthur Conan Doyle en 1887. Conocido por su método deductivo, 
          su violín, su pipa y su dirección en 221B Baker Street, Londres.
        </p>
      </div>

      <div class="about-section">
        <h3>El Proyecto</h3>
        <p>
          SPA desarrollada con HTML, CSS y JavaScript vanilla. 
          Integra Google Gemini AI mediante Vercel Serverless Functions 
          para mantener la API key segura en el servidor.
        </p>
      </div>

      <div class="about-section">
        <h3>Tecnologías</h3>
        <p>HTML · CSS · JavaScript · Gemini AI · Vercel · Vitest</p>
      </div>
    </div>
  `;
}

// ============================================
// MOTOR DE ROUTING
// ============================================

const routes = {
  '/': renderHome,
  '/home': renderHome,
  '/chat': renderChat,
  '/about': renderAbout,
};

function renderView(path) {
  const app = document.getElementById('app');
  const renderFn = routes[path] || renderHome;
  app.innerHTML = renderFn();
  updateActiveLink(path);

  // Si la vista es chat, inicializa los eventos
  if (path === '/chat') {
    initChat();
  }
}

function navigateTo(path) {
  history.pushState({}, '', path);
  renderView(path);
}

function updateActiveLink(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
}

// ============================================
// EVENTOS DE NAVEGACIÓN
// ============================================

// Intercepta clicks en los links del navbar
document.addEventListener('click', (e) => {
  if (e.target.matches('.nav-link')) {
    e.preventDefault();
    navigateTo(e.target.getAttribute('href'));
  }
});

// Maneja botones back/forward del navegador
window.addEventListener('popstate', () => {
  renderView(window.location.pathname);
});

// ============================================
// INIT
// ============================================

// Renderiza la vista inicial al cargar la página
renderView(window.location.pathname);
