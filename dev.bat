@echo off
:start
echo ===============================================
echo NgAutodeskForgeViewer Development Setup
echo ===============================================
echo.
echo === Docker Options ===
echo 1. Start with Docker (standard)
echo 2. Quick Docker Start (skip lock files)
echo 3. Fix package-lock files
echo 4. Clean Docker cache
echo.
echo === Local Development ===
echo 5. Start without Docker (local development)
echo 6. Fix Angular installation issues
echo 7. Install/Update all dependencies
echo 8. Setup PostgreSQL database
echo 9. Fix database migration error
echo 10. Reset database (delete all data)
echo.
echo === Build and Deploy ===
echo 11. Build for production
echo.
echo === Utilities ===
echo 12. Check service status
echo 13. Test Docker installation
echo 14. Clean all (remove node_modules, caches, etc.)
echo 15. Docker commands help
echo 16. List all available scripts
echo 17. Project status report
echo 18. Quick fix (reset everything)
echo.
echo 0. Exit
echo.
set /p choice="Enter your choice (0-18): "

if "%choice%"=="1" goto docker
if "%choice%"=="2" goto docker_quick
if "%choice%"=="3" goto fix_locks
if "%choice%"=="4" goto docker_clean
if "%choice%"=="5" goto local
if "%choice%"=="6" goto fix_angular
if "%choice%"=="7" goto install_all
if "%choice%"=="8" goto setup_db
if "%choice%"=="9" goto fix_db_error
if "%choice%"=="10" goto reset_db
if "%choice%"=="11" goto build_prod
if "%choice%"=="12" goto check_status
if "%choice%"=="13" goto test_docker
if "%choice%"=="14" goto clean_all
if "%choice%"=="15" goto docker_help
if "%choice%"=="16" goto list_scripts
if "%choice%"=="17" goto project_status
if "%choice%"=="18" goto quick_fix
if "%choice%"=="0" goto end

echo Invalid choice. Please try again.
pause
cls
goto start

:docker
echo.
echo Starting with Docker (standard)...
call start-docker.bat
pause
cls
goto start

:docker_quick
echo.
echo Starting Docker with quick start (removing lock files)...
call docker-quick-start.bat
pause
cls
goto start

:fix_locks
echo.
echo Fixing package-lock.json files...
call fix-package-locks.bat
pause
cls
goto start

:docker_clean
echo.
echo Cleaning Docker cache...
call docker-clean-cache.bat
pause
cls
goto start

:local
echo.
echo Starting local development...
call start-dev.bat
pause
cls
goto start

:fix_angular
echo.
echo Fixing Angular installation...
call fix-angular.bat
pause
cls
goto start

:install_all
echo.
echo ===============================================
echo Installing all dependencies...
echo ===============================================
echo.
echo Installing backend dependencies...
cd backend
call npm install --legacy-peer-deps
cd ..
echo.
echo Installing frontend dependencies...
cd frontend
call npm install --legacy-peer-deps
cd ..
echo.
echo ===============================================
echo All dependencies installed!
echo ===============================================
pause
cls
goto start

:build_prod
echo.
echo Building for production...
call build.bat
pause
cls
goto start

:setup_db
echo.
echo Setting up PostgreSQL database...
call setup-database.bat
pause
cls
goto start

:fix_db_error
echo.
echo Fixing database migration error...
call fix-database-error.bat
pause
cls
goto start

:reset_db
echo.
echo Resetting database...
call reset-database.bat
pause
cls
goto start

:test_docker
echo.
echo Testing Docker installation...
call test-docker.bat
pause
cls
goto start

:docker_help
echo.
call docker-help.bat
pause
cls
goto start

:list_scripts
echo.
call list-scripts.bat
pause
cls
goto start

:project_status
echo.
call project-status.bat
pause
cls
goto start

:quick_fix
echo.
call quick-fix.bat
pause
cls
goto start

:check_status
echo.
call status.bat
pause
cls
goto start

:clean_all
echo.
echo ===============================================
echo Cleaning Options
echo ===============================================
echo.
echo 1. Clean project files (node_modules, caches)
echo 2. Clean Docker cache and images
echo 3. Clean everything
echo 4. Back to main menu
echo.
set /p clean_choice="Enter your choice (1-4): "

if "%clean_choice%"=="1" goto clean_project
if "%clean_choice%"=="2" goto clean_docker_only
if "%clean_choice%"=="3" goto clean_everything
if "%clean_choice%"=="4" goto start

echo Invalid choice.
pause
goto clean_all

:clean_project
echo.
echo ===============================================
echo Cleaning all project files...
echo ===============================================
echo.
echo WARNING: This will remove all node_modules and caches!
set /p confirm="Are you sure? (y/n): "
if /i not "%confirm%"=="y" goto start

echo.
echo Cleaning backend...
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist backend\package-lock.json del backend\package-lock.json
if exist backend\dist rmdir /s /q backend\dist

echo.
echo Cleaning frontend...
if exist frontend\node_modules rmdir /s /q frontend\node_modules
if exist frontend\package-lock.json del frontend\package-lock.json
if exist frontend\.angular rmdir /s /q frontend\.angular
if exist frontend\dist rmdir /s /q frontend\dist

echo.
echo Cleaning npm cache...
call npm cache clean --force

echo.
echo ===============================================
echo Project cleanup completed!
echo ===============================================
pause
cls
goto start

:clean_docker_only
echo.
call docker-clean-cache.bat
pause
cls
goto start

:clean_everything
echo.
echo This will clean both project files AND Docker cache.
set /p confirm="Are you sure? (y/n): "
if /i not "%confirm%"=="y" goto start
goto clean_project
goto clean_docker_only

:end
echo.
echo Goodbye!
exit /b 0
