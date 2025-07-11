@echo off
echo ===============================================
echo Fixing package-lock.json files
echo ===============================================
echo.

echo Removing old package-lock.json files...
if exist backend\package-lock.json del backend\package-lock.json
if exist frontend\package-lock.json del frontend\package-lock.json

echo.
echo Regenerating backend package-lock.json...
cd backend
call npm install --legacy-peer-deps
cd ..

echo.
echo Regenerating frontend package-lock.json...
cd frontend
call npm install --legacy-peer-deps
cd ..

echo.
echo ===============================================
echo Package-lock files regenerated successfully!
echo ===============================================
echo.
echo You can now run: docker-compose up -d
echo.
pause
