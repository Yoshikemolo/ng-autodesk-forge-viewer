@echo off
echo ===============================================
echo NgAutodeskForgeViewer - Service Status Check
echo ===============================================
echo.

REM Check PostgreSQL
echo Checking PostgreSQL...
call scripts\check-postgres.bat >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL is running
) else (
    echo [FAIL] PostgreSQL is not available
)

REM Check Backend
echo.
echo Checking Backend...
curl -s -o nul -w "%%{http_code}" http://localhost:3000/health >temp_status.txt 2>nul
set /p backend_status=<temp_status.txt
del temp_status.txt >nul 2>&1

if "%backend_status%"=="200" (
    echo [OK] Backend is running at http://localhost:3000
    echo     - GraphQL: http://localhost:3000/graphql
    echo     - Health: http://localhost:3000/health
) else (
    echo [FAIL] Backend is not responding
)

REM Check Frontend
echo.
echo Checking Frontend...
curl -s -o nul -w "%%{http_code}" http://localhost:4200 >temp_status.txt 2>nul
set /p frontend_status=<temp_status.txt
del temp_status.txt >nul 2>&1

if "%frontend_status%"=="200" (
    echo [OK] Frontend is running at http://localhost:4200
) else (
    echo [FAIL] Frontend is not responding
)

echo.
echo ===============================================
echo Status check complete
echo ===============================================
echo.
pause
