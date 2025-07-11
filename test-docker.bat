@echo off
echo ===============================================
echo Testing Docker Installation
echo ===============================================
echo.

REM Check if Docker is installed
echo Checking if Docker is installed...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Docker is not installed.
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo [OK] Docker is installed

REM Check if Docker Desktop is running
echo.
echo Checking if Docker Desktop is running...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Docker Desktop is not running.
    echo Please start Docker Desktop from the Start Menu.
    pause
    exit /b 1
)
echo [OK] Docker Desktop is running

REM Show Docker version
echo.
echo Docker version information:
docker version

echo.
echo ===============================================
echo Docker is ready to use!
echo ===============================================
pause
