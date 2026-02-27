# 🕷️ TFT Coach LATAM

Asistente en tiempo real para Teamfight Tactics — Riot API + Claude AI.

## Stack

- **Backend:** Node.js + Express (proxy para Riot API)
- **Frontend:** React
- **Deploy:** Render.com

---

## Deploy en Render (paso a paso)

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tft-coach.git
git push -u origin main
```

### 2. Crear Web Service en Render

1. Ir a [render.com](https://render.com) → **New** → **Web Service**
2. Conectar tu repo de GitHub
3. Configurar **exactamente** así:
   - **Name:** `tft-coach`
   - **Environment:** `Node`
   - **Root Directory:** *(dejar vacío)*
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server/index.js`

### 3. Variables de entorno en Render

En la sección **Environment Variables** agregar:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `RIOT_API_KEY` | `RGAPI-bc40386d-2f0e-48d3-a57b-a11ec26578ae` |

> ⚠️ La API key de Riot dura 24hs en desarrollo. Para producción necesitarás una **Production API Key** en [developer.riotgames.com](https://developer.riotgames.com).

### 4. Deploy automático

Render hace deploy automático en cada push a `main`. ✅

---

## Desarrollo local

```bash
# Instalar dependencias del servidor
npm install

# Buildear React
npm run build

# Correr (sirve frontend + API en el mismo puerto)
npm start
```

La app estará en `http://localhost:3001`

O con hot-reload:

```bash
# Terminal 1
npm run dev

# Terminal 2
cd client && npm start
```

---

## Arquitectura

```
tft-coach/
├── server/
│   └── index.js      ← Express: proxy Riot API + sirve React build
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       └── App.js    ← React app completa
├── package.json
└── .gitignore
```

### Por qué no hay CORS

```
Browser  →  /api/riot/la2.api.riotgames.com/...  (mismo origen)
         →  Express  →  api.riotgames.com  (con X-Riot-Token header)
```
