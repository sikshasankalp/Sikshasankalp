# Shiksha Sankalp Foundation Backend

## Technology Stack
- Node.js & Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (Validation)

## Setup
1. Clone and install dependencies: npm install
2. Setup PostgreSQL database and update .env with DATABASE_URL.
3. Generate Prisma client: npm run prisma:generate
4. Run migrations: npm run prisma:migrate -- --name init
5. Seed database: npm run prisma:seed
6. Start dev server: npm run dev

## Health Check
GET /api/health
