@echo off
echo ===============================================
echo PostgreSQL Database Setup for NgForgeViewer
echo ===============================================
echo.

setlocal enabledelayedexpansion

REM Load environment variables from .env file
if exist .env (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set "%%a=%%b"
    )
) else (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and configure it.
    pause
    exit /b 1
)

REM Set default values if not in .env
if "%POSTGRES_HOST%"=="" set POSTGRES_HOST=localhost
if "%POSTGRES_PORT%"=="" set POSTGRES_PORT=5432
if "%POSTGRES_DB%"=="" set POSTGRES_DB=forge_viewer_db
if "%POSTGRES_USER%"=="" set POSTGRES_USER=forge_user
if "%POSTGRES_PASSWORD%"=="" set POSTGRES_PASSWORD=your_secure_password

echo Configuration:
echo - Host: %POSTGRES_HOST%
echo - Port: %POSTGRES_PORT%
echo - Database: %POSTGRES_DB%
echo - User: %POSTGRES_USER%
echo.

REM Set PGPASSWORD environment variable for psql
set PGPASSWORD=%POSTGRES_PASSWORD%

REM Check if psql is available
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: psql command not found!
    echo.
    echo Please install PostgreSQL client tools:
    echo 1. Download PostgreSQL from https://www.postgresql.org/download/windows/
    echo 2. Make sure to add PostgreSQL bin directory to PATH
    echo.
    echo Alternatively, you can run the SQL manually using pgAdmin or another tool.
    echo The SQL file is located at: backend\init.sql
    echo.
    pause
    exit /b 1
)

echo ===============================================
echo Step 1: Creating database if not exists...
echo ===============================================

REM First connect to postgres database to create our database
psql -h %POSTGRES_HOST% -p %POSTGRES_PORT% -U %POSTGRES_USER% -d postgres -c "CREATE DATABASE %POSTGRES_DB%;" 2>nul
if %errorlevel% equ 0 (
    echo Database %POSTGRES_DB% created successfully!
) else (
    echo Database %POSTGRES_DB% already exists or could not be created.
)

echo.
echo ===============================================
echo Step 2: Running initialization script...
echo ===============================================

REM Run the init.sql script
psql -h %POSTGRES_HOST% -p %POSTGRES_PORT% -U %POSTGRES_USER% -d %POSTGRES_DB% -f backend\init.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database initialization completed successfully!
    echo.
    echo The following has been created:
    echo - Tables: users, models, annotations
    echo - Extensions: uuid-ossp, pgcrypto
    echo - Triggers: updated_at for all tables
    echo - Indexes: for performance optimization
    echo - Default admin user (email: admin@forge.local, password: admin123)
    echo.
) else (
    echo.
    echo ❌ Database initialization failed!
    echo.
    echo Please check:
    echo - PostgreSQL is running
    echo - User %POSTGRES_USER% has necessary permissions
    echo - Connection details are correct
    echo.
)

pause
