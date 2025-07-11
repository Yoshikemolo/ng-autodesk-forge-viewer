@echo off
cls
echo ===============================================
echo      NgAutodeskForgeViewer Status Report
echo ===============================================
echo.
echo === FIXES APPLIED ===
echo [✓] Docker image names corrected
echo [✓] Package lock issues resolved  
echo [✓] Batch script errors fixed
echo [✓] Database migration error fixed
echo [✓] TypeORM synchronize disabled
echo.
echo === QUICK START OPTIONS ===
echo.
echo 1. Fix database error and start:
echo    ./dev.bat → Option 9
echo.
echo 2. Quick start (skip all issues):
echo    ./docker-quick-start.bat
echo.
echo 3. Complete reset and start fresh:
echo    ./reset-database.bat
echo    ./docker-compose up -d
echo.
echo === CURRENT STATUS ===
echo.
docker --version >nul 2>&1
if errorlevel 1 (
    echo [!] Docker is not installed
) else (
    docker ps >nul 2>&1
    if errorlevel 1 (
        echo [!] Docker Desktop is not running
    ) else (
        echo [✓] Docker is ready
        echo.
        echo Checking containers...
        docker-compose ps 2>nul
    )
)
echo.
echo === NEED HELP? ===
echo.
echo - Interactive menu: ./dev.bat
echo - Quick start guide: ./start.bat
echo - Docker help: ./docker-help.bat
echo - List all scripts: ./list-scripts.bat
echo.
echo Documentation:
echo - README.md
echo - DOCKER.md
echo - DATABASE_FIX.md
echo - SUMMARY.md
echo.
pause
