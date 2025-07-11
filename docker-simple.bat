@echo off
echo ===============================================
echo Simple Docker Startup
echo ===============================================
echo.

REM Just check if docker is available
docker ps >nul 2>&1
if errorlevel 1 (
    echo Docker Desktop is not running.
    echo.
    echo Please:
    echo 1. Start Docker Desktop from the Start Menu
    echo 2. Wait for it to fully start (whale icon in system tray)
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo Docker is running! Starting services...
echo.
docker-compose up
