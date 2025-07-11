@echo off
echo ===============================================
echo    Verifying Database Fix
echo ===============================================
echo.

echo Checking Docker containers...
docker-compose ps
echo.

echo Checking backend logs for errors...
docker-compose logs backend --tail=20 | findstr /i "error"
if %errorlevel% equ 0 (
    echo.
    echo [!] Errors found in backend logs!
    echo.
    echo Try running: ./fix-database-error.bat
) else (
    echo [✓] No errors in backend logs
)

echo.
echo Checking database connection...
docker-compose exec postgres psql -U forge_user -d forge_viewer_db -c "\dt" >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Database connection successful
    echo.
    echo Tables in database:
    docker-compose exec postgres psql -U forge_user -d forge_viewer_db -c "\dt"
) else (
    echo [!] Database connection failed
)

echo.
echo ===============================================
echo Verification complete
echo ===============================================
echo.
echo If everything is OK, access:
echo   Frontend: http://localhost:4200
echo   GraphQL:  http://localhost:3000/graphql
echo.
pause
