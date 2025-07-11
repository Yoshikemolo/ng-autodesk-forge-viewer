@echo off
echo ===============================================
echo Starting development WITHOUT Docker
echo ===============================================
echo.
echo NOTE: You need to have installed:
echo - Node.js 20.x
echo - PostgreSQL 16.x running locally
echo - Autodesk Forge credentials in .env
echo.
echo ===============================================

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed.
    echo Please install Node.js 20.x from: https://nodejs.org/
    pause
    exit /b 1
)

REM Copy .env if it does not exist
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit the .env file with your Autodesk Forge credentials
    echo.
)

echo ===============================================
echo Installing Backend dependencies...
echo ===============================================
cd backend
if not exist node_modules (
    call npm install --legacy-peer-deps
) else (
    echo Backend dependencies already installed.
)

echo.
echo ===============================================
echo Installing Frontend dependencies...
echo ===============================================
cd ../frontend
if not exist node_modules (
    echo Installing for the first time...
    call npm install --legacy-peer-deps
) else (
    echo Checking frontend dependencies...
    call npm list @angular-devkit/build-angular >nul 2>&1
    if %errorlevel% neq 0 (
        echo Missing Angular dependencies. Reinstalling...
        rmdir /s /q node_modules
        if exist package-lock.json del package-lock.json
        call npm install --legacy-peer-deps
    ) else (
        echo Frontend dependencies already installed.
    )
)

cd ..

echo.
echo ===============================================
echo Checking PostgreSQL connection...
echo ===============================================
call scripts\check-postgres.bat
if %errorlevel% neq 0 (
    echo.
    echo ERROR: PostgreSQL is not available!
    echo.
    echo You have two options:
    echo 1. Install and configure PostgreSQL locally
    echo 2. Use Docker version instead (./start-docker.bat)
    echo.
    pause
    exit /b 1
)

echo.
echo ===============================================
echo Starting services...
echo ===============================================
echo.
echo Backend will run at: http://localhost:3000
echo Frontend will run at: http://localhost:4200
echo GraphQL Playground at: http://localhost:3000/graphql
echo.
echo Opening terminals for each service...

REM Start backend with health checks in new window
start "NgForgeViewer Backend" cmd /k "scripts\start-backend.bat"

REM Wait a bit for backend to start initializing
timeout /t 5 /nobreak >nul

REM Start frontend with health checks in new window
start "NgForgeViewer Frontend" cmd /k "scripts\start-frontend.bat"

echo.
echo ===============================================
echo Services starting in separate windows!
echo ===============================================
echo.
echo The Frontend window will wait for the Backend to be ready.
echo This may take 30-60 seconds on first start.
echo.
echo If you see connection errors:
echo 1. Check the Backend window for errors
echo 2. Ensure PostgreSQL is running and accessible
echo 3. Verify your .env configuration
echo.
pause
