@echo off
echo ===============================================
echo Checking PostgreSQL connection...
echo ===============================================

setlocal enabledelayedexpansion

REM Load environment variables from .env file
if exist ..\.env (
    for /f "tokens=1,2 delims==" %%a in (..\.env) do (
        set "%%a=%%b"
    )
) else if exist .env (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set "%%a=%%b"
    )
)

REM Set default values if not in .env
if "%POSTGRES_HOST%"=="" set POSTGRES_HOST=localhost
if "%POSTGRES_PORT%"=="" set POSTGRES_PORT=5432
if "%POSTGRES_DB%"=="" set POSTGRES_DB=forge_viewer_db
if "%POSTGRES_USER%"=="" set POSTGRES_USER=forge_user
if "%POSTGRES_PASSWORD%"=="" set POSTGRES_PASSWORD=your_secure_password

REM Set PGPASSWORD environment variable for psql
set PGPASSWORD=%POSTGRES_PASSWORD%

set max_attempts=30
set attempt=0

:check_loop
set /a attempt+=1
echo Attempt %attempt% of %max_attempts%...

REM Try to connect to PostgreSQL using psql (if available)
where psql >nul 2>&1
if %errorlevel% equ 0 (
    echo Testing with psql...
    psql -h %POSTGRES_HOST% -p %POSTGRES_PORT% -U %POSTGRES_USER% -d postgres -c "SELECT 1" >nul 2>&1
    if !errorlevel! equ 0 (
        echo PostgreSQL is ready!
        
        REM Check if database exists
        psql -h %POSTGRES_HOST% -p %POSTGRES_PORT% -U %POSTGRES_USER% -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '%POSTGRES_DB%'" | find "1" >nul 2>&1
        if !errorlevel! neq 0 (
            echo Creating database %POSTGRES_DB%...
            psql -h %POSTGRES_HOST% -p %POSTGRES_PORT% -U %POSTGRES_USER% -d postgres -c "CREATE DATABASE %POSTGRES_DB%"
        )
        exit /b 0
    )
) else (
    REM Fallback: Try to connect using Node.js
    echo Testing with Node.js...
    node -e "const net = require('net'); const client = new net.Socket(); client.connect(%POSTGRES_PORT%, '%POSTGRES_HOST%', () => { console.log('Connected'); client.destroy(); process.exit(0); }); client.on('error', () => { process.exit(1); });" >nul 2>&1
    if !errorlevel! equ 0 (
        echo PostgreSQL port is open!
        echo.
        echo WARNING: Cannot verify database. Make sure:
        echo 1. Database '%POSTGRES_DB%' exists
        echo 2. User '%POSTGRES_USER%' has access
        echo 3. Run backend/init.sql if needed
        echo.
        exit /b 0
    )
)

if %attempt% lss %max_attempts% (
    timeout /t 2 /nobreak >nul
    goto check_loop
)

echo.
echo ERROR: Could not connect to PostgreSQL after %max_attempts% attempts!
echo.
echo Please ensure PostgreSQL is running at %POSTGRES_HOST%:%POSTGRES_PORT%
echo.
echo To install PostgreSQL locally:
echo 1. Download from https://www.postgresql.org/download/windows/
echo 2. Install and start the PostgreSQL service
echo 3. Create user and database:
echo    - User: %POSTGRES_USER%
echo    - Database: %POSTGRES_DB%
echo 4. Run backend/init.sql
echo.
exit /b 1
