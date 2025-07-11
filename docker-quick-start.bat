@echo off
echo ===============================================
echo Quick Docker Start (removing lock files)
echo ===============================================
echo.

echo Temporarily removing package-lock.json files...
if exist backend\package-lock.json (
    echo Removing backend\package-lock.json
    del backend\package-lock.json
)
if exist frontend\package-lock.json (
    echo Removing frontend\package-lock.json
    del frontend\package-lock.json
)

echo.
echo Starting Docker Compose...
docker-compose up -d

echo.
echo ===============================================
echo Docker services are starting in background!
echo ===============================================
echo.
echo Check status with: docker-compose ps
echo View logs with: docker-compose logs -f
echo Stop with: docker-compose down
echo.
pause
