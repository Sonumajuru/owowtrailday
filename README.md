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
| `API_URL`     | Base URL for API routes (e.g., `http://localhost:3000/api/v1`)   |
| `TOKEN_KEY`   | Alphanumeric secret key for signing tokens                       |

---

### How to run the tests:

From repo root:

```bash
run all tests: npx jest
```

### Installing Dependencies

Run the following command to install all necessary packages:

```bash
npm install
```

---

Run, development server:

```bash
yarn dev
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
