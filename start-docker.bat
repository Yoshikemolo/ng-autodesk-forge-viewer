@echo off
echo ===============================================
echo Checking Docker Desktop status...
echo ===============================================

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed.
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Desktop is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo Docker Desktop is not running. Attempting to start it...
    
    REM Try to start Docker Desktop
    REM Check common Docker Desktop locations
    if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    ) else if exist "%LOCALAPPDATA%\Docker\Docker Desktop.exe" (
        start "" "%LOCALAPPDATA%\Docker\Docker Desktop.exe"
    ) else (
        echo ERROR: Could not find Docker Desktop executable.
        echo Please start Docker Desktop manually from the Start Menu.
        pause
        exit /b 1
    )
    
    echo Waiting for Docker Desktop to start completely...
    echo This may take 30-60 seconds...
    
    REM Simple wait loop - try 12 times with 5 second intervals
    for /L %%i in (1,1,12) do (
        timeout /t 5 /nobreak >nul
        docker ps >nul 2>&1
        if not errorlevel 1 goto docker_ready
        echo Waiting... attempt %%i of 12
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
