@echo off
echo ===============================================
echo Starting Frontend with health checks...
echo ===============================================

cd /d %~dp0..

REM First check Backend is ready
call scripts\check-backend.bat
if %errorlevel% neq 0 (
    echo Failed to connect to Backend!
    echo Make sure the backend is running in another terminal.
    pause
    exit /b 1
)

echo.
echo ===============================================
echo Starting Angular Frontend...
echo ===============================================
cd frontend
npm start
