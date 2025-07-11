@echo off
echo ===============================================
echo NPM Install Options for NgAutodeskForgeViewer
echo ===============================================
echo.
echo This project uses Angular 19 with various dependencies
echo that may have peer dependency conflicts.
echo.
echo Choose installation method:
echo.
echo 1. Install with --legacy-peer-deps (RECOMMENDED)
echo    - Ignores peer dependency conflicts
echo    - May use slightly older compatible versions
echo    - Most stable option
echo.
echo 2. Install with --force
echo    - Forces installation ignoring all warnings
echo    - May lead to runtime issues
echo    - Use with caution
echo.
echo 3. Standard install (npm install)
echo    - Strict dependency resolution
echo    - May fail due to conflicts
echo    - Most compatible when it works
echo.
echo 4. Clean install with legacy peer deps
echo    - Removes node_modules and package-lock.json
echo    - Fresh install with --legacy-peer-deps
echo    - Best for fixing persistent issues
echo.
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto legacy
if "%choice%"=="2" goto force
if "%choice%"=="3" goto standard
if "%choice%"=="4" goto clean_legacy
if "%choice%"=="5" goto end

echo Invalid choice. Please try again.
pause
goto start

:legacy
echo.
echo Installing with --legacy-peer-deps...
cd frontend
call npm install --legacy-peer-deps
cd ../backend
call npm install --legacy-peer-deps
goto done

:force
echo.
echo Installing with --force...
echo WARNING: This may cause runtime issues!
cd frontend
call npm install --force
cd ../backend
call npm install --force
goto done

:standard
echo.
echo Installing with standard npm install...
cd frontend
call npm install
cd ../backend
call npm install
goto done

:clean_legacy
echo.
echo Performing clean install with --legacy-peer-deps...
echo.
echo Cleaning frontend...
cd frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo Installing frontend dependencies...
call npm install --legacy-peer-deps
echo.
echo Cleaning backend...
cd ../backend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo Installing backend dependencies...
call npm install --legacy-peer-deps
goto done

:done
echo.
echo ===============================================
echo Installation completed!
echo ===============================================
echo.
echo You can now run the project with:
echo   ./start-dev.bat (for local development)
echo   ./start-docker.bat (for Docker)
echo.
pause

:end
