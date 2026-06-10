 
// ============================================
// UTILS - Funciones de transformación de datos
// ============================================

/**
 * Formatea un mensaje para enviarlo a la API de Gemini
 * @param {string} role - 'user' o 'model'
 * @param {string} text - contenido del mensaje
 * @returns {object} mensaje formateado
 */
export function formatMessage(role, text) {
  return {
    role,
    parts: [{ text }]
  };
}

/**
 * Extrae el texto de la respuesta de Gemini
 * @param {object} response - respuesta cruda de la API
 * @returns {string} texto extraído
 */
export function parseGeminiResponse(response) {
  try {
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    return 'No pude procesar la respuesta. Inténtalo de nuevo.';
  }
}

/**
 * Valida que un mensaje no esté vacío
 * @param {string} text - texto a validar
 * @returns {boolean}
 */
export function isValidMessage(text) {
  return typeof text === 'string' && text.trim().length > 0;
}

/**
 * Formatea el historial completo para enviarlo a Gemini
 * @param {Array} history - array de mensajes
 * @returns {Array} historial formateado
 */
export function formatHistory(history) {
  return history.map(msg => formatMessage(msg.role, msg.parts[0].text));
}