# 🚀 Quick Development Guide

## 🎯 Quick Start

### Simplest Way
```bash
./start.bat
```
This interactive script will guide you through the best option for your situation.

### Advanced Menu
**Windows users:** Use the interactive menu:
```bash
./dev.bat
```

This provides options to:
1. Start with Docker
2. Start without Docker (local development)
3. Fix Angular installation issues
4. Install/Update all dependencies
5. Build for production
6. Setup PostgreSQL database
7. Clean all (remove node_modules, caches, etc.)

## 🔄 Service Dependencies and Health Checks

When running without Docker, the services start with automatic health checks:

1. **PostgreSQL Check**: Backend waits for database to be ready
2. **Backend Health Check**: Frontend waits for backend to be ready
3. **Automatic Retries**: Services retry connections for up to 60 seconds

### Database Setup (Local Development)

```bash
# Option 1: Use the setup script
./setup-database.bat

# Option 2: Manual setup
# 1. Create database
psql -U postgres -c "CREATE DATABASE forge_viewer_db;"
# 2. Create user
psql -U postgres -c "CREATE USER forge_user WITH PASSWORD 'your_password';"
# 3. Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE forge_viewer_db TO forge_user;"
# 4. Run init script
psql -U forge_user -d forge_viewer_db -f backend/init.sql
```

## ⚠️ Important: Peer Dependencies

This project uses Angular 19 which may have peer dependency conflicts with some packages. All installation scripts use `--legacy-peer-deps` to resolve these conflicts.

### Manual Installation Options

```bash
# Recommended: Use legacy peer deps
npm install --legacy-peer-deps

# Alternative: Force installation (use with caution)
npm install --force

# For specific installation options
./npm-install-options.bat
```

### Why --legacy-peer-deps?

Angular 19 is relatively new and some dependencies haven't updated their peer dependency declarations yet. Using `--legacy-peer-deps` tells npm to use the legacy algorithm for peer dependencies, which is more permissive.

## 🐋 Docker Issues

### Problem: "The system cannot find the file specified"
**Solution:** Docker Desktop is not running.

1. **Start Docker Desktop manually:**
   - Open Docker Desktop from Start Menu
   - Wait for it to fully start (whale icon in system tray turns white)
   - Try `docker-compose up` again

2. **Or use our helper script:**
   ```bash
   ./start-docker.bat
   ```

### Problem: "version attribute is obsolete"
**Solution:** Already fixed! The `version` field has been removed from docker-compose files.

## 🛠️ Development Without Docker

If you prefer to develop without Docker:

```bash
# Use our development script
./start-dev.bat

# Or manually:
# Terminal 1 - Backend
cd backend
npm install
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### Prerequisites for Non-Docker Development:
- ✅ Node.js 20.x
- ✅ PostgreSQL 16.x running locally
- ✅ Create database: `forge_viewer_db`
- ✅ Run SQL script: `backend/init.sql`
- ✅ Update `.env` with your database credentials

## 🔑 Environment Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Autodesk Forge credentials:**
   ```env
   FORGE_CLIENT_ID=your_client_id_here
   FORGE_CLIENT_SECRET=your_client_secret_here
   ```

3. **Update database credentials (if not using Docker):**
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=forge_viewer_db
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   ```

## 🐛 Common Issues

### Issue: Cannot connect to PostgreSQL
- **Docker:** Ensure the postgres container is running: `docker ps`
- **Local:** Ensure PostgreSQL service is running and credentials are correct

### Issue: Forge Viewer not loading
- Check browser console for errors
- Verify Forge credentials in `.env`
- Ensure backend is running and accessible

### Issue: GraphQL Playground not loading
- Access it at: http://localhost:3000/graphql
- Ensure `GRAPHQL_PLAYGROUND=true` in `.env`

## 📝 Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload
2. **Debugging:** VS Code launch configs included
3. **Testing:** Run `npm test` in respective directories
4. **Linting:** Run `npm run lint` to check code style

## 🆘 Need Help?

- Check logs: `docker-compose logs -f [service-name]`
- Backend logs: Check terminal or `docker-compose logs -f backend`
- Frontend logs: Check browser console
- Database issues: `docker-compose logs -f postgres`

## 📋 Development Notes

### Service Startup Order

When running without Docker, services start in this order:
1. **PostgreSQL** - Must be running first
2. **Backend (NestJS)** - Waits for PostgreSQL, starts on port 3000
3. **Frontend (Angular)** - Waits for Backend, starts on port 4200

The scripts handle this automatically with health checks:
- Backend waits up to 60 seconds for PostgreSQL
- Frontend waits up to 120 seconds for Backend
- Clear error messages if services fail to start

### Available Scripts

| Script | Description |
|--------|-------------|
| `./dev.bat` | Interactive development menu |
| `./start-dev.bat` | Start all services with health checks |
| `./start-docker.bat` | Start with Docker (auto-starts Docker Desktop) |
| `./setup-database.bat` | Initialize PostgreSQL database |
| `./fix-angular.bat` | Fix Angular dependency issues |
| `./build.bat` | Build for production |
| `./npm-install-options.bat` | NPM installation options menu |

### Scripts Directory

The `scripts/` directory contains helper utilities:
- `check-postgres.bat` - Verify PostgreSQL connection
- `check-backend.bat` - Verify Backend is ready
- `start-backend.bat` - Start Backend with health check
- `start-frontend.bat` - Start Frontend with health check
