# Silvaniya E-commerce Platform

A full-stack jewellery e-commerce platform for **Silvaniya - The Art of Eternal Shine**.

## Project Structure

```
silvaniya/
├── docs/                    # Documentation
│   ├── 01-PRD.md           # Product Requirements Document
│   ├── 02-ARCHITECTURE.md  # System Architecture
│   ├── 03-DATABASE-SCHEMA.prisma  # Database Schema
│   ├── 04-API-ENDPOINTS.md # API Reference
│   └── 05-IMPLEMENTATION-PLAN.md  # Implementation Plan
├── silvaniya-api/          # NestJS Backend API
├── silvaniya-web/          # Next.js Customer Website
├── silvaniya-admin/        # Next.js Admin Panel
└── docker-compose.yml      # Local development services
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS, Prisma, PostgreSQL, Redis, BullMQ |
| Customer Site | Next.js 14, Tailwind CSS, Zustand |
| Admin Panel | Next.js 14, Tailwind CSS, Shadcn/ui |
| Payments | Razorpay |
| Storage | AWS S3 / Cloudflare R2 |

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- pnpm (recommended) or npm

## Quick Start

### 1. Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, MinIO (S3), and MailHog
docker-compose up -d
```

Services will be available at:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MinIO Console: `http://localhost:9001` (admin/minioadmin)
- MailHog UI: `http://localhost:8025`

### 2. Setup API (silvaniya-api)

```bash
cd silvaniya-api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Start development server
npm run start:dev
```

API will be available at: `http://localhost:4000/api/v1`
API Docs: `http://localhost:4000/docs`

### 3. Setup Customer Website (silvaniya-web)

```bash
cd silvaniya-web

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local

# Start development server
npm run dev
```

Website will be available at: `http://localhost:3000`

### 4. Setup Admin Panel (silvaniya-admin)

```bash
cd silvaniya-admin

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local

# Start development server
npm run dev
```

Admin Panel will be available at: `http://localhost:3001`

**Default Admin Credentials:**
- Email: `admin@silvaniya.com`
- Password: `admin123`

## Development Commands

### API (silvaniya-api)

```bash
npm run start:dev      # Start with hot reload
npm run build          # Build for production
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run lint           # Lint code
npm run test           # Run tests
```

### Web/Admin (Next.js)

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Lint code
```

## Environment Variables

### API (.env)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/silvaniya"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
ADMIN_JWT_SECRET=your-admin-secret-key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Storage (MinIO for local)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=silvaniya-media
```

### Web/Admin (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
```

## Project Documentation

- [Product Requirements Document](./docs/01-PRD.md)
- [System Architecture](./docs/02-ARCHITECTURE.md)
- [Database Schema](./docs/03-DATABASE-SCHEMA.prisma)
- [API Endpoints](./docs/04-API-ENDPOINTS.md)
- [Implementation Plan](./docs/05-IMPLEMENTATION-PLAN.md)

## Deployment

### Recommended Services

| Component | Service |
|-----------|---------|
| API | Railway / Render |
| Web/Admin | Vercel |
| Database | Neon / Supabase |
| Redis | Upstash |
| Storage | Cloudflare R2 |

## License

Private - Vernium Gold Private Limited
# Silvaniya
