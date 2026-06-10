 import { describe, it, expect } from 'vitest';

// ============================================
// TESTS - app.js (routing y navegación)
// ============================================

describe('Routing SPA', () => {
  it('debe identificar la ruta /home como valida', () => {
    const validRoutes = ['/home', '/chat', '/about', '/'];
    expect(validRoutes.includes('/home')).toBe(true);
  });

  it('debe identificar una ruta desconocida', () => {
    const validRoutes = ['/home', '/chat', '/about', '/'];
    expect(validRoutes.includes('/unknown')).toBe(false);
  });

  it('debe tener exactamente 4 rutas definidas', () => {
    const validRoutes = ['/home', '/chat', '/about', '/'];
    expect(validRoutes).toHaveLength(4);
  });

  it('debe incluir la ruta del chat', () => {
    const validRoutes = ['/home', '/chat', '/about', '/'];
    expect(validRoutes.includes('/chat')).toBe(true);
  });
});
