# CodingHub

LeetCode‑style coding practice platform with AI‑powered explanations, submission tracking, daily streaks, acceptance rate analytics, discussions, and admin uploads. Frontend is a React SPA (deployed via GitHub Pages); backend is a Node.js/Express API with MongoDB (Mongoose) and Google Gemini integration.

---

## Highlights

- Practice problems with detailed descriptions and constraints
- Code submissions with history, status, runtime, memory, acceptance rate
- AI code explanation via Google Gemini (`/api/explain`) with structured markdown
- Daily streak tracking and progress visualizations (Recharts)
- Discussions and community threads per problem
- Profiles and settings (dark mode, preferences)
- Admin tooling for bulk problem uploads and system initialization

---

## Architecture

- **Frontend:** React SPA (`client/`), built with CRA (`react-scripts`), deployed using `gh-pages` to GitHub Pages (`homepage` set in `client/package.json`).
- **Backend:** Node.js + Express (`server/`), routes under `/api/*`, integrates Google Gemini and MongoDB via Mongoose.
- **Data:** MongoDB for users, problems, submissions, discussions, streaks, profiles, settings.
- **Key Backend Routes:** `/api/auth`, `/api/explain`, `/api/chat-history`, `/api/tutorials`, `/api/practice`, `/api/questions`, `/api/test`, `/api/admin`, `/api/streak`, `/api` (submissions), `/api/discussions`, `/api/profile`, `/api/settings`.

---

## Tech Stack

- **Frontend:** React 19, `react-router-dom`, `@monaco-editor/react`, `react-markdown`, `react-syntax-highlighter`, `recharts`, `react-hot-toast`, `@heroicons/react`, `lucide-react`, `react-icons`.
- **Backend:** Node.js 18+, Express 5, Mongoose 8, JWT, `bcryptjs`, `dotenv`, `cors`, `axios`.
- **AI Integration:** Google Generative AI (Gemini 2.0 Flash) via `@google/generative-ai` and REST endpoint.
- **Dev Tooling:** `nodemon` (backend), `gh-pages` (frontend deploy).

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- MongoDB instance/connection string
- Google Gemini API Key

### Clone

```pwsh
git clone https://github.com/sk-inthiyaz/CodingHub
cd CodingHub
```

### Environment Variables (server)

Create `server/.env` with:

```ini
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=replace_me
GEMINI_API_KEY=replace_me
```

### Install & Run

Frontend (React SPA):

```pwsh
Push-Location client
npm install
npm start
Pop-Location
```

Backend (Express API):

```pwsh
Push-Location server
npm install
npm run dev
Pop-Location
```

Open the client at `http://localhost:3000`. The API runs at `http://localhost:5000`.

---

## Deployment

- Frontend deploy to GitHub Pages:

```pwsh
Push-Location client
npm run build
npm run deploy
Pop-Location
```

- Backend deploy: host Node.js service (e.g., Render/Heroku/Vercel serverless or VM/container). Ensure environment variables are set and CORS origins restricted in production.

---

## API Overview

- `GET /` → API health: returns "API is running"
- `POST /api/explain` → AI code explanation (Gemini). Payload: `{ code: string }`
- Auth: `/api/auth/*` (register/login/JWT)
- Practice & Questions: `/api/practice`, `/api/questions`
- Submissions: `/api` (submission routes) for create/list/history
- Streaks: `/api/streak/*`
- Discussions: `/api/discussions/*`
- Profile & Settings: `/api/profile/*`, `/api/settings/*`
- Tutorials: `/api/tutorials/*`
- Test: `/api/test/*`

Refer to `server/routes/` for exact route handlers.

---

## Frontend Guide

- React Router drives views: Problems, Problem Detail (tabs: Description/Submissions), Profile, Discussions, Settings.
- Markdown rendering and syntax highlighting for problem statements and explanations.
- Monaco Editor for code editing; toast notifications for feedback.
- Visual patterns and UX documented under `ReadmeFiles/` (UI visual guides, quick start).

---

## Admin Guide

- Initialize admin user at server startup (`utils/initAdmin`).
- Upload problems in documented JSON formats (`server/ADMIN_UPLOAD_FORMAT.md`).
- Manage practice/problem metadata via `/api/admin/*` routes.
- Streak uploads supported via JSON files like `admin-upload-streak.json`.

---

## Security & Configuration

- JWT-based authentication; hash passwords with `bcryptjs`.
- Restrict CORS origins in production (currently `*` in development).
- Store secrets in `server/.env`; never commit keys.
- Rate-limit and validate inputs on sensitive endpoints (e.g., `/api/explain`).

---

## Contributing

1. Fork and branch from `main`.
2. Follow existing code style and folder structure.
3. Add/update docs in `ReadmeFiles/` when changing flows or UX.
4. Open a PR with a clear description, screenshots for UI changes, and any migration notes.

---

## License

Copyright © sk‑inthiyaz. All rights reserved.
