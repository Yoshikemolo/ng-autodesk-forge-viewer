@echo off
echo ===============================================
echo Building NgAutodeskForgeViewer for Production
echo ===============================================
echo.

REM Check if dependencies are installed
if not exist backend\node_modules (
    echo Backend dependencies not found. Installing...
    cd backend
    call npm install --legacy-peer-deps
    cd ..
)

if not exist frontend\node_modules (
    echo Frontend dependencies not found. Installing...
    cd frontend
    call npm install --legacy-peer-deps
    cd ..
)

echo.
echo ===============================================
echo Building Backend...
echo ===============================================
cd backend
call npm run build

if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)

echo.
echo ===============================================
echo Building Frontend...
echo ===============================================
cd ../frontend
call npm run build:prod

if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo ===============================================
echo Build completed successfully!
echo ===============================================
echo.
echo Build outputs:
echo - Backend: backend/dist/
echo - Frontend: frontend/dist/
echo.
echo To deploy with Docker:
echo   docker-compose -f docker-compose.prod.yml up -d
echo.
pause
