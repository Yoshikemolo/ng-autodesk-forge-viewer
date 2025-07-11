@echo off
echo ===============================================
echo Fixing Angular installation issues
echo ===============================================

cd frontend

echo.
echo Cleaning cache and old files...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

if exist .angular (
    echo Removing Angular cache...
    rmdir /s /q .angular
)

echo.
echo Cleaning npm cache...
call npm cache clean --force

echo.
echo ===============================================
echo Installing Angular dependencies...
echo ===============================================
echo Using --legacy-peer-deps to resolve dependency conflicts...
call npm install --legacy-peer-deps

echo.
echo ===============================================
echo Verifying Angular CLI installation...
echo ===============================================
call npx ng version

echo.
echo ===============================================
echo Installation completed!
echo ===============================================
echo.
echo You can now run:
echo   cd frontend
echo   npm start
echo.
pause
