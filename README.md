# Ai AGENDA — Fullstack Demo (Frontend + Backend)

This repository is a demo fullstack project prepared for testing. It uses **SQLite + Prisma** in the backend and a **Vite + React** frontend.

## Quick start (local)


### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

By default the backend will run on `http://localhost:4000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend uses `/api` relative paths, so run it in the same machine and the demo will call the backend.

## Seed accounts
- Admin: admin@aiagenda.test / password
- Seller 1: vendedor1@aiagenda.test / password
- Seller 2: vendedor2@aiagenda.test / password
- Buyer: cliente@aiagenda.test / password


## Notes
- This is a demo scaffold for testing flows: products, orders, invoice sending (simulated), marking delivery and commission payment (simulated).
- To integrate real Melhor Envios, Mercado Pago or NF-e providers, add API keys and implement webhook handling in `backend/src/index.js`.
