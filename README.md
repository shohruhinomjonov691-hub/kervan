# Kervan · Restaurant API & Administration

The backend for Kervan, a restaurant web application covering menu browsing, customer accounts, orders, branches, and customer inquiries. It serves a REST API to the React client and an EJS administration interface from the same Express application.

[Frontend repository](https://github.com/shohruhinomjonov691-hub/kervan-react) · [Application](http://kervan.uz/)

## Features

- Customer registration, login, logout, profile updates, and image uploads.
- Menu listing with search, collection filters, sorting, and pagination.
- Authenticated order creation, order history, and order status updates.
- Public branch listings and customer comments.
- Restaurant administration for menu items, users, branches, and dashboard statistics.
- Reservation requests and customer inquiries relayed to Telegram from the server.
- Demo payment-method metadata management without a payment gateway.

## Technology & architecture

Node.js, TypeScript, Express, MongoDB/Mongoose, EJS, JWT, bcryptjs, express-session, MongoDB session storage, Multer, and Socket.IO.

```text
React client → REST routes → controllers → service classes → Mongoose models
Browser admin → /admin routes → controllers → EJS views
Contact forms → Telegram service → configured bot/chat
```

| Directory | Responsibility |
| --- | --- |
| [`src/controllers`](src/controllers) | HTTP requests and responses |
| [`src/models`](src/models) | Business services and authentication |
| [`src/schema`](src/schema) | MongoDB document schemas |
| [`src/libs`](src/libs) | Types, enums, upload utilities, and shared configuration |
| [`src/views`](src/views) | Administration templates |
| [`src/public`](src/public) | Administration CSS, JavaScript, and images |

Customer API authentication uses JWT-based checks; administration uses sessions stored in MongoDB. Socket.IO currently tracks client connections; order management is implemented through REST endpoints.

## Run locally

Prerequisites: a reachable MongoDB database, npm, and Node.js with built-in `fetch` support for the Telegram service. Use Node.js 20 for this setup. The committed `.nvmrc` points to an older Node 16 runtime and does not reflect the Telegram service's runtime requirement.

```bash
git clone --branch develop https://github.com/shohruhinomjonov691-hub/kervan.git
cd kervan
npm install
cp .env.example .env
```

Configure `.env`:

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port; example/default is `3003` |
| `FRONTEND_URL` | Allowed React client origin, e.g. `http://localhost:3000` |
| `MONGO_URL` | MongoDB connection URI |
| `SESSION_SECRET` | Long random administration session secret |
| `SECRET_TOKEN` | JWT signing secret |
| `TELEGRAM_BOT_TOKEN` | Server-side bot credential for reservation/inquiry delivery |
| `TELEGRAM_CHAT_ID` | Destination chat for the configured bot |

Keep real credentials outside version control. Telegram credentials are needed for contact delivery, not for browsing the menu.

```bash
npm run start:dev
```

The API is served at `http://localhost:3003`; the administration entry point is `http://localhost:3003/admin`. Populate menu/branch data through the administration flows; an empty database does not contain the deployed site's content.

## API overview

| Area | Representative endpoints |
| --- | --- |
| Accounts | `POST /member/signup`, `POST /member/login`, `GET /member/detail`, `POST /member/update` |
| Menu | `GET /product/all`, `GET /product/:id` |
| Orders | `POST /order/create`, `GET /order/all`, `POST /order/update` |
| Branches | `GET /branch/all` |
| Comments | `GET /comment/all`, `POST /comment/create` |
| Contact | `POST /contact/booking`, `POST /contact/inquiry` |
| Administration | `/admin`, `/admin/product/all`, `/admin/user/all`, `/admin/branch/all` |

See [`src/router.ts`](src/router.ts) and [`src/router-admin.ts`](src/router-admin.ts) for the full route definitions and authentication middleware.

## Build & deployment

```bash
npm run build
NODE_ENV=production npm run start:prod
```

The build compiles TypeScript and runs `extra.js` to copy EJS views and static assets into `dist/`. In production the server loads `.env.production`; provide the same required configuration there. Preserve uploaded files separately from generated build output.

## Project scope

Kervan is a completed portfolio project. Its payment-method flow validates demo input and persists card brand, last four digits, holder name, and expiry. Full card numbers and CVVs are not persisted; no money is charged. Use synthetic demo inputs only.

The `test` script is a placeholder and exits with an error. This repository does not currently provide an automated backend test suite.

## Author

[Shokhrukhbek Inomjonov](https://github.com/shohruhinomjonov691-hub)
