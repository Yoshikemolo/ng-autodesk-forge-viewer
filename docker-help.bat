@echo off
echo ===============================================
echo NgAutodeskForgeViewer - Docker Quick Commands
echo ===============================================
echo.
echo === Quick Start ===
echo docker-compose up -d              # Start all services in background
echo docker-compose up                 # Start with logs visible
echo ./docker-quick-start.bat          # Quick start (removes lock files)
echo.
echo === Service Management ===
echo docker-compose ps                 # View running containers
echo docker-compose logs -f            # View logs (follow mode)
echo docker-compose logs backend       # View backend logs only
echo docker-compose logs frontend      # View frontend logs only
echo docker-compose stop               # Stop services
echo docker-compose down               # Stop and remove containers
echo docker-compose restart            # Restart all services
echo.
echo === Debugging ===
echo docker-compose exec backend sh    # Enter backend container
echo docker-compose exec frontend sh   # Enter frontend container
echo docker-compose exec postgres psql -U forge_user -d forge_viewer_db
echo.
echo === URLs ===
echo Frontend:     http://localhost:4200
echo Backend API:  http://localhost:3000
echo GraphQL:      http://localhost:3000/graphql
echo Health Check: http://localhost:3000/health
echo pgAdmin:      http://localhost:5050  (if enabled)
echo.
echo === Rebuild ===
echo docker-compose build              # Rebuild all images
echo docker-compose build backend      # Rebuild backend only
echo docker-compose up --build         # Rebuild and start
echo.
pause
