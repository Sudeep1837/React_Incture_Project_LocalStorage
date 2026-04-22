# Enterprise Work Management System

JavaScript-only enterprise work management monorepo built with **pure ES Modules (ESM)**, **no Babel**, and **no CommonJS**.

## Overview

This project is a polished, modular, enterprise-style demo app that showcases:

- role-based JWT authentication
- localStorage-driven business data architecture
- realtime UI synchronization over Socket.IO
- modular feature-based React architecture
- premium animated UX with Framer Motion

## Architecture (Honest by Design)

This is an intentionally hybrid academic/demo architecture:

- **Backend (`apps/api`)**: Node.js + Express handles auth, JWT, role-aware middleware, demo users API, health endpoint, and Socket.IO relay.
- **Frontend (`apps/web`)**: React + Redux Toolkit stores business data in `localStorage` (projects, tasks, comments, notifications, theme, preferences, activity, and attachment metadata).
- **Realtime model**: Socket.IO broadcasts domain events; clients update Redux + localStorage.
- **No centralized DB**: no MongoDB/PostgreSQL/SQLite/Firebase/Supabase, no Prisma, no ORM.

## ESM and Tooling Guarantees

- JavaScript only
- ESM only (`import` / `export`)
- no `require()`
- no `module.exports`
- no `.cjs` configs
- no Babel config or Babel transform pipeline
- frontend tests run on **Vitest** + React Testing Library

## Monorepo Structure

```text
root/
  apps/
    api/
      src/
        config/
        controllers/
        data/
        middleware/
        routes/
        services/
        sockets/
        utils/
    web/
      src/
        app/
        components/
        constants/
        features/
        hooks/
        lib/
        routes/
        services/
        store/
        test-utils/
        __tests__/
  package.json
  README.md
```

## Core Frontend Stack

- React + Vite
- Redux Toolkit
- React Router
- React Hook Form + Yup
- Tailwind CSS
- Axios
- Recharts
- `@dnd-kit`
- `react-toastify`
- `framer-motion`
- Vitest + React Testing Library

## Core Backend Stack

- Node.js + Express
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- socket.io
- multer (mock attachment metadata endpoint)

## Realtime Domain Events

- `project:created`
- `project:updated`
- `task:created`
- `task:updated`
- `task:moved`
- `comment:added`
- `notification:created`

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `POST /api/users` (Admin)
- `PATCH /api/users/:userId` (Admin)
- `GET /api/health`
- `POST /api/upload` (mock metadata)

## Demo Credentials

- `admin@demo.com / Admin@123`
- `manager@demo.com / Manager@123`
- `employee@demo.com / Employee@123`

## Setup

```bash
npm install
cp apps/api/.env.example apps/api/.env
npm run dev
```

- Web: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:5000](http://localhost:5000)

## Environment Variables (`apps/api/.env`)

- `PORT`
- `CLIENT_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Scripts

- `npm run dev` - run web + api
- `npm run dev:web` - run frontend only
- `npm run dev:api` - run backend only
- `npm run build` - build frontend
- `npm run test` - run frontend Vitest suite
- `npm run lint` - lint web + api
- `npm run format` - format repository

## Testing

```bash
npm run test -w apps/web
```

Includes unit tests and integration-style UI coverage in JavaScript.

## Mock Attachment Note

Attachments are demo-oriented and stored as local metadata in frontend persistence. Backend upload endpoint returns temporary metadata only and does not provide centralized file storage.
