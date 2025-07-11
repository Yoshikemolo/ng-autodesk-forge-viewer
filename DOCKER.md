# 🐳 Docker Setup Guide

## Quick Start

The easiest way to run the project with Docker:

```bash
# Option 1: Use the interactive menu
./dev.bat
# Select option 2: Quick Docker Start

# Option 2: Direct command
./docker-quick-start.bat

# Option 3: Standard Docker Compose
docker-compose up -d
```

## Common Issues and Solutions

### Issue: "npm ci can only install packages when your package.json and package-lock.json are in sync"

**Solution**: Use the Quick Docker Start which removes lock files temporarily:
```bash
./docker-quick-start.bat
```

Or fix the lock files permanently:
```bash
./fix-package-locks.bat
docker-compose up -d
```

### Issue: "No se esperaba X en este momento" (Windows batch script errors)

**Solution**: Start Docker Desktop manually first, then use:
```bash
docker-compose up -d
```

### Issue: Docker Desktop not running

**Solution**: 
1. Start Docker Desktop from the Start Menu
2. Wait for the whale icon in the system tray
3. Run `./test-docker.bat` to verify
4. Then use `docker-compose up -d`

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev.bat` | Main interactive menu with all options |
| `docker-quick-start.bat` | Quick start (removes lock files) |
| `fix-package-locks.bat` | Regenerate package-lock.json files |
| `docker-clean-cache.bat` | Clean Docker build cache |
| `test-docker.bat` | Test Docker installation |
| `docker-help.bat` | Show Docker commands reference |
| `docker-simple.bat` | Simple Docker check and start |
| `docker-ps.bat` | PowerShell version (more robust) |

## Docker Commands Reference

### Basic Operations
```bash
# Start services
docker-compose up -d          # Background mode
docker-compose up             # With logs visible

# Stop services
docker-compose stop           # Stop containers
docker-compose down           # Stop and remove containers

# View status
docker-compose ps             # List containers
docker-compose logs -f        # View logs (follow mode)
```

### Debugging
```bash
# Enter containers
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U forge_user -d forge_viewer_db

# View specific logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Rebuild
```bash
# Rebuild images
docker-compose build
docker-compose build --no-cache    # Full rebuild
docker-compose up --build          # Rebuild and start
```

## Service URLs

Once running, access:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql
- **Health Check**: http://localhost:3000/health
- **pgAdmin**: http://localhost:5050 (if enabled)
- **Redis Commander**: Not configured (add if needed)

## Docker Compose Files

- `docker-compose.yml` - Development configuration
- `docker-compose.prod.yml` - Production configuration

## Environment Variables

Make sure you have a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
# Edit .env with your configurations
```

## Troubleshooting

1. **Clear everything and start fresh**:
   ```bash
   docker-compose down -v
   docker system prune -a
   ./docker-quick-start.bat
   ```

2. **Check Docker logs**:
   ```bash
   docker-compose logs -f --tail=50
   ```

3. **Verify services are healthy**:
   ```bash
   ./dev.bat
   # Select option 10: Check service status
   ```

4. **Manual database connection**:
   ```bash
   docker-compose exec postgres psql -U forge_user -d forge_viewer_db
   ```

## Production Deployment

For production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

Note: Configure proper environment variables and SSL certificates for production use.
