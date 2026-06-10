 
import { describe, it, expect } from 'vitest';
import { formatMessage, parseGeminiResponse, isValidMessage, formatHistory } from '../src/utils.js';

// ============================================
// TESTS - utils.js
// ============================================

describe('formatMessage', () => {
  it('debe crear un mensaje con role y parts correctos', () => {
    const result = formatMessage('user', 'Hola Sherlock');
    expect(result).toEqual({
      role: 'user',
      parts: [{ text: 'Hola Sherlock' }]
    });
  });

  it('debe funcionar con role model', () => {
    const result = formatMessage('model', 'Elemental');
    expect(result).toEqual({
      role: 'model',
      parts: [{ text: 'Elemental' }]
    });
  });
});

describe('isValidMessage', () => {
  it('debe retornar true para un mensaje normal', () => {
    expect(isValidMessage('Hola')).toBe(true);
  });

  it('debe retornar false para un string vacio', () => {
    expect(isValidMessage('')).toBe(false);
  });

  it('debe retornar false para solo espacios', () => {
    expect(isValidMessage('   ')).toBe(false);
  });

  it('debe retornar false para un numero', () => {
    expect(isValidMessage(123)).toBe(false);
  });
});

describe('parseGeminiResponse', () => {
  it('debe extraer el texto de una respuesta valida', () => {
    const response = {
      candidates: [{
        content: {
          parts: [{ text: 'Elemental, mi estimado Watson.' }]
        }
      }]
    };
    expect(parseGeminiResponse(response)).toBe('Elemental, mi estimado Watson.');
  });

  it('debe retornar mensaje de error si la respuesta es invalida', () => {
    const response = {};
    expect(parseGeminiResponse(response)).toBe('No pude procesar la respuesta. Inténtalo de nuevo.');
  });
});

describe('formatHistory', () => {
  it('debe formatear un array de mensajes correctamente', () => {
    const history = [
      { role: 'user', parts: [{ text: 'Hola' }] },
      { role: 'model', parts: [{ text: 'Buenos dias' }] }
    ];
    const result = formatHistory(history);
    expect(result).toHaveLength(2);
    expect(result[0].role).toBe('user');
    expect(result[1].role).toBe('model');
  });

  it('debe retornar array vacio si el historial esta vacio', () => {
    expect(formatHistory([])).toEqual([]);
  });
});