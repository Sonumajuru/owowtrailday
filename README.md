# Welcome OWOW TRAIL Assignment

---

## Getting Started with Development

This project uses **Create next-app**. Follow the steps below to set up your environment:

### Environment Variables

| Name          | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `PORT`        | Port where your local server will run (e.g., `localhost:{port}`) |
| `DB_NAME`     | Name of the database                                             |
| `DB_HOST`     | Domain of the database                                           |
| `DB_USER`     | Database user                                                    |
| `DB_PASSWORD` | Password for the database user                                   |
| `DB_PORT`     | Port where the database is running                               |
| `API_URL`     | Base URL for API routes (e.g., `http://localhost:3001/api/v1`)   |
| `TOKEN_KEY`   | Alphanumeric secret key for signing tokens                       |

---

### Installing Dependencies

From repo root:

```bash
npm install
```

### Run Locally (Backend)

From repo root:

```bash
npx tsx backend/server.ts
```

The API will be available at `http://localhost:3001/api/v1` unless you set a different `PORT`.

### Run Locally (Frontend)

```bash
yarn dev
```

### How to Run Tests

From repo root:

```bash
npx jest
```

### Run with Docker (API + MySQL)

From repo root:

```bash
docker compose up --build
```

The API will be available at `http://localhost:3001/api/v1`.

### If you must run `server.js`

To build and run `server.js` locally:

```bash
npm run backend:build
npm run backend:start
```

## 🧱 Prisma Commands (Full Reference)

### Install & Initialize

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

## 🔁 Prisma: Add New Migrations, Update DB, and View Locally

This section assumes you already created and applied the **baseline** migration (`000_baseline`) and Prisma migrations are now the source of truth.

---

## ✅ 1 Add / Create a New Migration (Local)

### Step A — Update your Prisma schema

Edit:

- `prisma/schema.prisma`

Example change: add a new field, model, relation, index, etc.

### Step B — Create and apply a migration locally

````bash
npx prisma migrate dev --name <migration_name>

### Schema Validation

```bash
npx prisma validate ### Validate schema
`
````

### Baseline Existing Database (Run Once)

```bash
mkdir -p prisma/migrations

npx prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script > prisma/migrations/000_baseline.sql

mkdir prisma/migrations/000_baseline
mv prisma/migrations/000_baseline.sql prisma/migrations/000_baseline/migration.sql

npx prisma migrate resolve --applied 000_baseline
```

### Local Development (Create Migrations)

```bash
npx prisma migrate dev --name <migration_name>
```

### Prisma Client & Studio

```bash
npx prisma generate ### Regenerate Prisma Client
npx prisma studio ### Prisma Studio (GUI)
```
