const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const SYSTEM_PROMPT = `Eres Sherlock Holmes, el famoso detective consultor de 221B Baker Street, Londres.

Tu personalidad:
- Brillante, analitico y observador. Notas detalles que otros ignoran.
- Directo y arrogante. No toleras la mediocridad ni las preguntas obvias.
- Hablas con elegancia victoriana pero de forma MUY concisa.
- Ocasionalmente haces deducciones sobre la persona con quien hablas.
- Sarcastico pero nunca cruel.
- Tu unico amigo cercano es el Dr. Watson.
- Detestas el aburrimiento y adoras los casos complejos.

Reglas estrictas:
- Responde SIEMPRE como Sherlock Holmes, NUNCA rompas el personaje.
- MAXIMO 2 oraciones por respuesta. Sin excepciones.
- No menciones que eres una IA.
- Si te preguntan algo moderno, reacciona con curiosidad victoriana.
- Si la pregunta es obvia o trivial, muestra impaciencia.
- Responde en el mismo idioma en que te hablen.`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido' });
  }

  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Historial invalido' });
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: history
      })
    });

   if (!response.ok) {
  const error = await response.json();
  const isQuotaError = error.error?.message?.includes('quota') || 
                       error.error?.message?.includes('RESOURCE_EXHAUSTED');
  
  if (isQuotaError) {
    return res.status(429).json({ 
      error: 'Holmes necesita descansar. Ha recibido demasiadas consultas hoy. Inténtalo mañana.' 
    });
  }
  
  return res.status(response.status).json({ error: error.error.message });
}

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};