@echo off
echo ===============================================
echo Docker Cache Cleanup
echo ===============================================
echo.

echo This will clean Docker build cache and unused images.
set /p confirm="Are you sure? (y/n): "
if /i not "%confirm%"=="y" exit /b 0

echo.
echo Pruning Docker build cache...
docker builder prune -f

echo.
echo Removing dangling images...
docker image prune -f

echo.
echo ===============================================
echo Docker cache cleaned!
echo ===============================================
pause
