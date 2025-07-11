@echo off
:start
echo ===============================================
echo NgAutodeskForgeViewer Development Setup
echo ===============================================
echo.
echo Choose an option:
echo.
echo 1. Start with Docker
echo 2. Start without Docker (local development)
echo 3. Fix Angular installation issues
echo 4. Install/Update all dependencies
echo 5. Build for production
echo 6. Setup PostgreSQL database
echo 7. Check service status
echo 8. Clean all (remove node_modules, caches, etc.)
echo 9. Exit
echo.
set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto docker
if "%choice%"=="2" goto local
if "%choice%"=="3" goto fix_angular
if "%choice%"=="4" goto install_all
if "%choice%"=="5" goto build_prod
if "%choice%"=="6" goto setup_db
if "%choice%"=="7" goto check_status
if "%choice%"=="8" goto clean_all
if "%choice%"=="9" goto end

echo Invalid choice. Please try again.
pause
goto start

:docker
echo.
echo Starting with Docker...
call start-docker.bat
goto end

:local
echo.
echo Starting local development...
call start-dev.bat
goto end

:fix_angular
echo.
echo Fixing Angular installation...
call fix-angular.bat
goto end

:install_all
echo.
echo ===============================================
echo Installing all dependencies...
echo ===============================================
echo.
echo Installing backend dependencies...
cd backend
call npm install --legacy-peer-deps
echo.
echo Installing frontend dependencies...
cd ../frontend
call npm install --legacy-peer-deps
echo.
echo ===============================================
echo All dependencies installed!
echo ===============================================
pause
goto end

:build_prod
echo.
echo Building for production...
call build.bat
goto end

:setup_db
echo.
echo Setting up PostgreSQL database...
call setup-database.bat
goto end

:clean_all
echo.
echo ===============================================
echo Cleaning all temporary files and caches...
echo ===============================================
echo.
echo WARNING: This will remove all node_modules and caches!
set /p confirm="Are you sure? (y/n): "
if /i not "%confirm%"=="y" goto end

echo.
echo Cleaning backend...
cd backend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist dist rmdir /s /q dist

echo.
echo Cleaning frontend...
cd ../frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .angular rmdir /s /q .angular
if exist dist rmdir /s /q dist

echo.
echo Cleaning npm cache...
call npm cache clean --force

echo.
echo ===============================================
echo Cleanup completed!
echo ===============================================
pause

:end
