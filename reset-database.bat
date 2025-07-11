@echo off
echo ===============================================
echo Docker Database Reset
echo ===============================================
echo.
echo WARNING: This will delete all database data!
echo.
set /p confirm="Are you sure you want to reset the database? (y/n): "
if /i not "%confirm%"=="y" exit /b 0

echo.
echo Stopping Docker containers...
docker-compose down

echo.
echo Removing database volume...
docker volume rm forge-postgres-data 2>nul
if %errorlevel% equ 0 (
    echo Database volume removed successfully.
) else (
    echo Database volume not found or already removed.
)

echo.
echo Removing Redis volume...
docker volume rm forge-redis-data 2>nul
if %errorlevel% equ 0 (
    echo Redis volume removed successfully.
) else (
    echo Redis volume not found or already removed.
)

echo.
echo ===============================================
echo Database reset complete!
echo ===============================================
echo.
echo You can now start fresh with:
echo docker-compose up -d
echo.
pause
