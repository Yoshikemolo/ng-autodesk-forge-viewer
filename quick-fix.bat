@echo off
echo ===============================================
echo    Quick Fix for Common Docker Issues
echo ===============================================
echo.
echo This script will:
echo 1. Clean up any existing containers
echo 2. Remove problematic lock files
echo 3. Reset the database
echo 4. Start fresh with Docker
echo.
echo WARNING: This will DELETE all existing data!
echo.
set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" exit /b 0

echo.
echo Step 1: Stopping all containers...
docker-compose down -v

echo.
echo Step 2: Removing lock files...
if exist backend\package-lock.json del backend\package-lock.json
if exist frontend\package-lock.json del frontend\package-lock.json

echo.
echo Step 3: Removing Docker volumes...
docker volume rm forge-postgres-data 2>nul
docker volume rm forge-redis-data 2>nul

echo.
echo Step 4: Pruning Docker system...
docker system prune -f

echo.
echo Step 5: Starting fresh...
docker-compose up -d

echo.
echo ===============================================
echo Quick fix complete!
echo ===============================================
echo.
echo Services are starting. Check status with:
echo   docker-compose ps
echo   docker-compose logs -f
echo.
echo Access:
echo   Frontend: http://localhost:4200
echo   Backend:  http://localhost:3000/graphql
echo.
pause
