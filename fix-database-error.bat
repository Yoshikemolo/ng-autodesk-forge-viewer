@echo off
echo ===============================================
echo Fix Database Migration Error
echo ===============================================
echo.
echo This will fix the "column email already exists" error.
echo The fix will:
echo   1. Stop all services
echo   2. Keep your data intact
echo   3. Recreate the database structure
echo   4. Restart all services
echo.
set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" exit /b 0

echo.

echo Stopping services...
docker-compose down

echo.
echo Starting only PostgreSQL...
docker-compose up -d postgres

echo.
echo Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

echo.
echo Dropping and recreating database...
docker-compose exec postgres psql -U forge_user -d postgres -c "DROP DATABASE IF EXISTS forge_viewer_db;"
docker-compose exec postgres psql -U forge_user -d postgres -c "CREATE DATABASE forge_viewer_db;"

echo.
echo Re-running init.sql...
docker-compose exec postgres psql -U forge_user -d forge_viewer_db -f /docker-entrypoint-initdb.d/init.sql

echo.
echo Starting all services...
docker-compose up -d

echo.
echo ===============================================
echo Database fix complete!
echo ===============================================
echo.
echo Services are starting. Check status with:
echo docker-compose ps
echo docker-compose logs -f backend
echo.
pause
