@echo off
echo ===============================================
echo Waiting for Backend to be ready...
echo ===============================================

setlocal enabledelayedexpansion

set backend_url=http://localhost:3000/health
set max_attempts=60
set attempt=0

:check_loop
set /a attempt+=1
echo Attempt %attempt% of %max_attempts%...

REM Check if backend is responding
curl -s -o nul -w "%%{http_code}" %backend_url% >temp_status.txt 2>nul
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="200" (
    echo Backend is ready!
    echo.
    echo Services available:
    echo - REST API: http://localhost:3000/api
    echo - GraphQL Playground: http://localhost:3000/graphql
    echo - Health Check: http://localhost:3000/health
    echo.
    exit /b 0
)

REM Also try with Node.js as fallback
node -e "const http = require('http'); http.get('%backend_url%', (res) => { if(res.statusCode === 200) process.exit(0); else process.exit(1); }).on('error', () => process.exit(1));" >nul 2>&1
if !errorlevel! equ 0 (
    echo Backend is ready!
    exit /b 0
)

if %attempt% lss %max_attempts% (
    timeout /t 2 /nobreak >nul
    goto check_loop
)

echo.
echo ERROR: Backend did not start after %max_attempts% attempts!
echo.
echo Please check the backend logs in the other window.
echo Common issues:
echo - Database connection problems
echo - Port 3000 already in use
echo - Missing dependencies
echo.
exit /b 1
