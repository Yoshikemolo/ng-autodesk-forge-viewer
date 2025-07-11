@echo off
cls
echo ===============================================
echo    NgAutodeskForgeViewer - Quick Start Guide
echo ===============================================
echo.
echo What do you want to do?
echo.
echo 1. I want to run the project NOW (skip any issues)
echo 2. I want to fix issues first, then run
echo 3. I'm having Docker problems
echo 4. I have a database error
echo 5. Show me all options (advanced menu)
echo.
set /p quick="Select (1-5): "

if "%quick%"=="1" (
    echo.
    echo Starting quick mode...
    call docker-quick-start.bat
) else if "%quick%"=="2" (
    echo.
    echo Fixing issues first...
    call fix-package-locks.bat
    echo.
    echo Now starting Docker...
    docker-compose up -d
    echo.
    pause
) else if "%quick%"=="3" (
    echo.
    echo Testing Docker installation...
    call test-docker.bat
    echo.
    echo If Docker is working, run: docker-compose up -d
    echo If not, start Docker Desktop manually first.
    echo.
    pause
) else if "%quick%"=="4" (
    echo.
    echo Fixing database error...
    call fix-database-error.bat
) else if "%quick%"=="5" (
    call dev.bat
) else (
    echo Invalid choice.
    pause
    goto :eof
)
