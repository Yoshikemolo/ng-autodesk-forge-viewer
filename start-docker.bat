@echo off
echo ===============================================
echo Checking Docker Desktop status...
echo ===============================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed.
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Desktop is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Desktop is not running. Attempting to start it...
    
    REM Try to start Docker Desktop
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    echo Waiting for Docker Desktop to start completely...
    echo This may take 30-60 seconds...
    
    REM Wait until Docker is ready (maximum 60 seconds)
    set count=0
    :wait_loop
    timeout /t 5 /nobreak >nul
    docker ps >nul 2>&1
    if %errorlevel% equ 0 goto docker_ready
    
    set /a count+=5
    if %count% lss 60 (
        echo Waiting... %count% seconds
        goto wait_loop
    )
    
    echo ERROR: Docker Desktop could not start after 60 seconds.
    echo Please start Docker Desktop manually.
    pause
    exit /b 1
)

:docker_ready
echo Docker Desktop is running successfully!
echo.
echo ===============================================
echo Starting services with Docker Compose...
echo ===============================================
docker-compose up

pause
