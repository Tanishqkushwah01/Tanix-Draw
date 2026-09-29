# Tanix Draw

**Tanix Draw** is a real-time collaborative whiteboard where multiple people can draw, sketch, and diagram together on the same canvas — live, in the browser.

🔗 **Live:** [https://tanix-draw.vercel.app](https://tanix-draw.vercel.app)

---

## ✨ Features

- **Real-time collaboration** — every stroke, shape, and move syncs instantly across all connected users via WebSockets.
- **Shared rooms** — create a canvas, invite others with a join code, and draw together.
- **Drawing tools** — rectangles, ellipses, arrows, lines, freehand pencil, text, and an eraser.
- **Selection & resize** — select, move, and resize any shape on the canvas.
- **Live cursors** — see collaborators' cursors moving in real time.
- **Persistent canvases** — shapes are saved to the database and reload exactly as you left them.
- **Secure authentication** — email/password signup with OTP email verification, and a secure password-reset flow.
- **Role-based access** — canvas owners approve join requests and control who can edit.
- **Minimap & zoom/pan** — navigate large canvases with ease.
- **Responsive UI** — built with Tailwind CSS for a clean, modern interface.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- React Router
- Native WebSocket client
- Axios

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- Native `ws` WebSocket server
- JSON Web Tokens (JWT) for authentication, delivered via httpOnly cookies
- bcrypt for password hashing
- Brevo (email API) for OTP delivery

**Deployment**
- Frontend: Vercel
- Backend: Node hosting of your choice (Render / Railway / etc.)
- Database: MongoDB Atlas

---

## 📁 Project Structure

```
TKDraw/
├── client/                        # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Api/                # Axios API clients
│       │   ├── CanvasComponents/   # Canvas, toolbar, minimap, panels
│       │   ├── dashboardComponents/
│       │   ├── hooks/
│       │   └── websocket/          # WebSocket client + reconnect logic
│       ├── pages/                  # Route-level pages (Login, Dashboard, Canvas, etc.)
│       └── utils/
│           ├── drawing/            # Shape rendering helpers
│           ├── eraserHelper/
│           └── selection/          # Hit-testing, bounds, resize handles
│
└── server/                        # Express + WebSocket backend
    └── src/
        ├── config/                 # DB connection, CORS allow-list
        ├── controllers/            # Route handlers (auth, canvas, shapes)
        ├── middleware/             # Auth guard, rate limiting
        ├── models/                 # Mongoose schemas
        ├── routes/                 # Express routers
        ├── sockets/                # WebSocket server + room manager
        └── utils/                  # Auth cookies, email sending
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Brevo](https://www.brevo.com/) account for sending OTP emails

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd TKDraw
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

| Variable | Description |
|---|---|
| `PORT` | Port the API server runs on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `BREVO_API_KEY` | API key for sending OTP emails |
| `EMAIL_FROM` | Sender email address for OTP mail |
| `CLIENT_ORIGIN` | Frontend URL(s), comma-separated, used for CORS |
| `TRUST_PROXY` | `true` if running behind a reverse proxy in production |
| `COOKIE_SAMESITE` | `lax` locally, `none` if frontend/backend are on different domains |
| `COOKIE_SECURE` | `true` in production (HTTPS) |

Start the server:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../client
npm install
cp .env.example .env
```

Fill in `client/.env`:

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Backend REST API base URL (must end in `/api`) |
| `VITE_WS_URL` | WebSocket URL (`ws://` locally, `wss://` in production) |
| `VITE_SITE_URL` | Public URL of the frontend, used for SEO tags |

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌐 Deployment Notes

- **CORS:** `CLIENT_ORIGIN` on the backend must exactly match the deployed frontend URL (no trailing slash).
- **Cookies:** if the frontend and backend are on different domains, set `COOKIE_SAMESITE=none` and `COOKIE_SECURE=true` on the backend.
- **Reverse proxy:** if deploying behind a platform proxy (Render, Railway, etc.), set `TRUST_PROXY=true` so rate limiting and IP detection work correctly.
- **WebSocket URL:** make sure `VITE_WS_URL` uses `wss://` in production — plain `ws://` will be blocked on HTTPS sites.
- **SPA routing:** `client/vercel.json` rewrites all routes to `index.html` so direct links (e.g. `/login`) work correctly on refresh.
- **Database access:** whitelist your hosting provider's IP (or `0.0.0.0/0` for simplicity) in MongoDB Atlas network access settings.

---

## 🔒 Security Notes

- Auth tokens are stored in **httpOnly cookies**, not `localStorage`, to reduce XSS exposure.
- OTPs are hashed before being stored and compared using a timing-safe check.
- Sensitive routes (login, OTP, password reset) are rate-limited.
- `.env` files are excluded via `.gitignore` — never commit real secrets. Use `.env.example` as a template.
