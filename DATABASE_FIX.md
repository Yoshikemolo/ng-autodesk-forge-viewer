# 🔧 Database Error Fix

## Problem
Error: `column "email" of relation "users" contains null values`

This error occurs when TypeORM tries to sync the database schema with the entities, but the tables already exist from `init.sql`.

## Solution Applied

1. **Disabled TypeORM synchronize** in `backend/src/config/typeorm.config.ts`:
   ```typescript
   synchronize: false, // Disabled because we use init.sql for initial setup
   ```

2. **Updated entity definitions** to match exactly with `init.sql` schema

3. **Created helper scripts**:
   - `fix-database-error.bat` - Fixes the current error without losing data
   - `reset-database.bat` - Complete database reset (deletes all data)

## Quick Fix Options

### Option 1: Fix Current Error (Recommended)
```bash
./dev.bat
# Select option 9: Fix database migration error
```
Or directly:
```bash
./fix-database-error.bat
```

### Option 2: Complete Reset
```bash
./dev.bat
# Select option 10: Reset database (delete all data)
```
Or directly:
```bash
./reset-database.bat
```

### Option 3: Quick Start (Skip Issues)
```bash
./docker-quick-start.bat
```

## Prevention

The issue has been fixed by:
1. Setting `synchronize: false` in TypeORM config
2. Ensuring entity definitions match SQL schema exactly
3. Using proper column naming (snake_case in DB, camelCase in entities)

## Manual Fix (if scripts don't work)

```bash
# Stop all containers
docker-compose down

# Remove database volume
docker volume rm forge-postgres-data

# Start fresh
docker-compose up -d
```

## Database Connection Info

- **Host**: localhost (from host machine) or `postgres` (from containers)
- **Port**: 5432
- **Database**: forge_viewer_db
- **User**: forge_user
- **Password**: (check your .env file)
- **Default admin**: admin@forge.local / admin123

## Check Database Status

```bash
# Connect to database
docker-compose exec postgres psql -U forge_user -d forge_viewer_db

# List tables
\dt

# Check users table
SELECT * FROM users;

# Exit
\q
```
