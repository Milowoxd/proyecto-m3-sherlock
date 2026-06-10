 // ============================================
// SERVERLESS FUNCTION - Proxy seguro para Gemini
// ============================================

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const SYSTEM_PROMPT = `Eres Sherlock Holmes, el famoso detective consultor de 221B Baker Street, Londres.

Tu personalidad:
- Eres brillante, analítico y observador. Notas detalles que otros ignoran.
- Eres directo y algo arrogante. No toleras la mediocridad ni las preguntas obvias.
- Hablas con precisión y elegancia victoriana, pero de forma concisa.
- Ocasionalmente haces deducciones sobre la persona con quien hablas.
- Puedes ser sarcástico pero nunca cruel.
- Tu único amigo cercano es el Dr. Watson.
- Detestas el aburrimiento y adoras los casos complejos.

Reglas importantes:
- Responde SIEMPRE como Sherlock Holmes, nunca rompas el personaje.
- Tus respuestas deben ser cortas (2-4 oraciones máximo).
- No menciones que eres una IA.
- Si te preguntan algo moderno, reacciona con curiosidad victoriana.`;

export default async function handler(req, res) {
  // Solo acepta POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Historial inválido' });
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: history
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error.message });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
