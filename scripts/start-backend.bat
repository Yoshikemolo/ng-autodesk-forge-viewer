@echo off
echo ===============================================
echo Starting Backend with health checks...
echo ===============================================

cd /d %~dp0..

REM First check PostgreSQL
call scripts\check-postgres.bat
if %errorlevel% neq 0 (
    echo Failed to connect to PostgreSQL!
    pause
    exit /b 1
)

echo.
echo ===============================================
echo Starting NestJS Backend...
echo ===============================================
cd backend
npm run start:dev
