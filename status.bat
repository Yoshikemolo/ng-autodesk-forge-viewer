@echo off
cls
echo ===============================================
echo        NgAutodeskForgeViewer Status
echo ===============================================
echo.

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [!] Docker is not installed
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

docker ps >nul 2>&1
if errorlevel 1 (
    echo [!] Docker Desktop is not running
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [✓] Docker is running
echo.

REM Check if project containers are running
echo === Container Status ===
docker-compose ps

echo.
echo === Quick Actions ===
echo.
echo 1. Start services:     docker-compose up -d
echo 2. View logs:          docker-compose logs -f
echo 3. Stop services:      docker-compose down
echo 4. Restart services:   docker-compose restart
echo.
echo === Service URLs ===
echo.
echo Frontend:     http://localhost:4200
echo Backend API:  http://localhost:3000
echo GraphQL:      http://localhost:3000/graphql
echo.
pause
