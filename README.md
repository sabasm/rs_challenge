# RealSynch Developer Challenge

This repository contains a **TypeScript / React / Express** full-stack application that consumes the [balldontlie](https://www.balldontlie.io/) NBA API and the [WeatherAPI](https://www.weatherapi.com/) weather service.

## Prerequisites

* Node 20 (or higher)
* npm 9 (or yarn ≥1.22)
* Accounts & free API keys for:
  * [https://www.balldontlie.io/](https://www.balldontlie.io/)
  * [https://www.weatherapi.com/](https://www.weatherapi.com/)

## 1 — Quick start

```bash
# clone the repo
git clone https://github.com/ReWattInc/rs_challenge.git
cd rs_challenge

# install root & frontend deps
npm install
npm install --prefix react-ui
```

### Set environment variables

```bash
# copy the template and fill the values
cp .env.example .env
```

`.env.example` (root):

```env
BALLDONTLIE_API_KEY=
WEATHER_API_KEY=
PORT=5000
CLIENT_URL=http://localhost:3000
```

`.env.example` (react-ui):

```env
REACT_APP_API_BASE=/api
```

After editing `.env` (and `react-ui/.env`), start both server **and** client concurrently:

```bash
npm run dev
```

* Server — <http://localhost:5000>
* Client — <http://localhost:3000>

## 2 — Scripts

| command | description |
|---------|-------------|
| `npm run dev` | start backend & frontend with **concurrently** + **nodemon** |
| `npm run build` | build React UI (used for static files in production mode) |
| `npm start` | run Express server only |
| `npm run format` | run Prettier format |
| `npm test` | React tests (frontend) |

## 3 — Project structure

```text
rs_challenge/
├── server/            ← Express API (TypeScript)
│   ├── controllers/   ← thin controllers, no business logic
│   ├── services/      ← API adapters, caching, validation
│   ├── routes/        ← API router composition
│   ├── middleware/    ← error handler, logger, CORS
│   └── config/        ← centralised typed config
├── react-ui/          ← React 18 + Redux Toolkit + MUI
│   ├── components/    ← presentational & container sub-folders
│   ├── redux/         ← store, slices, hooks
│   ├── api/           ← Axios instance with interceptors
│   └── types/         ← shared TypeScript contracts
├── .env.example       ← server variables template
├── package.json       ← root scripts orchestrating mono-repo
└── tsconfig.json      ← monorepo TS path mapping
```

### How the structure mitigates the challenge considerations

| concern | solution in this repo |
|---------|----------------------|
| **Organisational structure & modularity** | Clear separation between **API** (`server/`) and **UI** (`react-ui/`). Each domain (NBA / Weather) lives in its own **service** & **slice** for single-responsibility. |
| **Design patterns / scalability** | Controllers delegate to **service** layer; services wrap external APIs behind a `ApiService` façade with pluggable caching and typed responses — easily extended to more providers. |
| **Environment handling & security** | All sensitive data read from **dotenv-typed** config. Keys never hard-coded; `.env.example` documents required variables. |
| **Error handling** | Central `errorHandler` middleware normalises responses; Axios interceptors translate network errors to predictable objects on both server & client. |
| **Readability / maintenance** | ESLint (Airbnb + Prettier) enforces style; Prettier auto-formats; directory names are self-describing; TypeScript strict types across boundaries. |
| **Up-keep / adding features** | New feature ► add slice in `redux/`, service in `server/services`, route in `server/routes`; wiring is isolated and testable. |
| **Efficiency / optimisation** | In-memory per-endpoint cache with TTL avoids hitting third-party APIs excessively; React side caches in Redux with identical TTL logic. |
| **Process environment & variable handling** | Single source of truth (`server/config/index.ts`) parsed at boot; front-end gets base path from `REACT_APP_API_BASE`, enabling proxy during local dev or absolute URLs in prod. |
| **Developer experience** | `npm run dev` manages both stacks via **concurrently**; hot-reload thanks to **nodemon** and CRA. |

## 4 — Testing & linting

```bash
# run React tests
npm test --prefix react-ui

# run ESLint & Prettier check
npm run format:check
```
