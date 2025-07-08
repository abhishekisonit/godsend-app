# Database Setup Scripts

This directory contains automated scripts for setting up and managing the PostgreSQL database with Prisma.

## Quick Start

```bash
# Set up database (start containers, push schema, generate client)
npm run db:setup

# Reset database (remove volumes and restart)
npm run db:reset

# Check database status
npm run db:status
```

## Available Scripts

### `npm run db:setup`
- Starts PostgreSQL container using Docker Compose
- Waits for database to be ready
- Updates environment files
- Pushes Prisma schema to database
- Generates Prisma client
- Verifies database connection

**Options:**
- `--force` or `-f`: Force restart containers
- `--verbose` or `-v`: Show detailed output

### `npm run db:reset`
- Stops and removes all containers and volumes
- Runs `db:setup` to start fresh

### `npm run db:status`
- Shows container status
- Displays recent database logs

### `npm run db:push`
- Pushes schema changes to database (Docker approach)
- Use this when you modify `schema.prisma`

### `npm run db:generate`
- Generates Prisma client
- Use this after schema changes

### `npm run db:studio`
- Opens Prisma Studio in browser
- Accessible at http://localhost:5555

## Environment Files

The script automatically manages two environment files:

### `.env` (for Next.js app)
```
DATABASE_URL="postgresql://postgres:prisma@localhost:5433/postgres?schema=public"
```

### `.env.docker` (for Prisma commands)
```
DATABASE_URL="postgresql://postgres:prisma@postgres_db:5432/postgres?schema=public"

```

## Development Workflow

1. **Initial Setup:**
   ```bash
   npm run db:setup
   ```

2. **Schema Changes:**
   ```bash
   # Edit prisma/schema.prisma
   npm run db:push
   npm run db:generate
   ```

3. **Start Development:**
   ```bash
   npm run dev
   ```

4. **Database Management:**
   ```bash
   npm run db:studio  # View/edit data
   npm run db:status  # Check status
   npm run db:reset   # Reset everything
   ```

## Troubleshooting

### Common Issues

1. **Docker not running:**
   ```bash
   # Start Docker Desktop first
   npm run db:setup
   ```

2. **Port conflicts:**
   ```bash

   # Check what's using port 5433
   netstat -ano | findstr :5433
   ```

3. **Permission issues:**
   ```bash
   # Run as administrator on Windows
   npm run db:setup
   ```

4. **Container stuck:**
   ```bash
   npm run db:reset --force
   ```

### Debug Mode

Run with verbose output to see detailed logs:
```bash
npm run db:setup --verbose
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Prisma CLI    │    │  PostgreSQL DB  │
│                 │    │                 │    │                 │
│ localhost:5433  │◄──►│ postgres_db:5432│◄──►│   Container     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

- **Next.js App**: Connects via `localhost:5433` (host-to-container)

- **Prisma CLI**: Connects via `postgres_db:5432` (container-to-container)
- **Database**: Runs in Docker container with persistent volume

## Files

- `setup-database.ts`: Main TypeScript implementation
- `README.md`: This documentation

## Dependencies

- Docker Desktop
- Node.js 18+
- TypeScript
- tsx (for running TypeScript files directly) 