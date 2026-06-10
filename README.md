 # 🔍 Sherlock Holmes Chat

SPA para chatear con Sherlock Holmes usando Google Gemini AI.

![Sherlock Holmes Chat](https://img.shields.io/badge/Gemini-AI-blue) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## 🌐 Demo

[Ver aplicación desplegada](https://proyecto-m3-sherlock-bb8ha26zr-milo-s-projects5.vercel.app/)

## 🕵️ El Personaje

Sherlock Holmes es el detective ficticio más famoso de la literatura, creado por Arthur Conan Doyle en 1887. Conocido por su método deductivo, su violín, su pipa y su dirección en 221B Baker Street, Londres. En esta aplicación podrás conversar con él y recibir respuestas en su característico tono arrogante y brillante.

## 📁 Estructura del proyecto
proyecto-m3-sherlock/
├── api/
│   └── functions.js        # Vercel Serverless Function (proxy seguro)
├── src/
│   ├── index.html          # HTML principal
│   ├── styles.css          # Estilos mobile-first
│   ├── app.js              # Routing SPA con History API
│   ├── chat.js             # Lógica del chat
│   └── utils.js            # Funciones utilitarias
├── tests/
│   ├── utils.test.js       # Tests de utils
│   └── app.test.js         # Tests de routing
├── .env.example
├── vercel.json
└── README.md

## ⚙️ Requisitos

- Node.js v18 o superior
- Cuenta en Vercel
- API key de Google Gemini (aistudio.google.com)
- Vercel CLI instalado: `npm install -g vercel`

## 🚀 Ejecutar localmente

1. Clona el repositorio:
```bash
git clone https://github.com/Milowoxd/proyecto-m3-sherlock.git
cd proyecto-m3-sherlock
```

2. Instala dependencias:
```bash
npm install
```

3. Crea el archivo `.env`:
```bash
cp .env.example .env
```

4. Agrega tu API key en `.env`: GEMINI_API_KEY=tu_api_key_aqui
5. Vincula con Vercel:
```bash
vercel link
vercel env pull
```

6. Ejecuta el servidor local:
```bash
vercel dev
```

7. Abre el navegador en `http://localhost:3000`

## 🧪 Ejecutar tests

```bash
npm run test:run
```

## 📦 Desplegar en Vercel

1. Conecta el repositorio en vercel.com
2. Agrega la variable de entorno `GEMINI_API_KEY` en el dashboard
3. Despliega:
```bash
vercel --prod
```

## 🤖 Registro de uso de AI

Este proyecto fue desarrollado con asistencia de Claude (Anthropic):

- **Estructura del proyecto**: Se usó AI para definir la arquitectura de archivos y la separación de responsabilidades.
- **System prompt de Sherlock**: Se iteró el prompt con ayuda de AI para definir la personalidad, tono y limitaciones del personaje.
- **Serverless Function**: Se consultó AI para entender la diferencia entre `module.exports` y `export default` en el contexto de Vercel.
- **Debugging**: Se usó AI para resolver errores de configuración de `vercel.json` y rutas de archivos estáticos.
- **Tests**: Se usó AI para diseñar los casos de test de funciones utilitarias.

## 📸 Capturas de pantalla

*(Agregar capturas de la aplicación funcionando)*

## 🛠️ Tecnologías

- HTML + CSS + JavaScript vanilla
- Google Gemini 2.5 Flash
- Vercel Serverless Functions
- Vitest
