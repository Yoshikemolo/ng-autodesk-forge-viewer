@echo off
cls
echo ===============================================
echo    Available Scripts and Their Purpose
echo ===============================================
echo.
echo === Main Entry Points ===
echo start.bat              - Quick start guide (RECOMMENDED FOR BEGINNERS)
echo dev.bat                - Advanced development menu with all options
echo quick-fix.bat          - Quick fix for all common issues (RESETS DATA)
echo project-status.bat     - Show complete project status
echo.
echo === Docker Scripts ===
echo docker-quick-start.bat - Start Docker (removes lock files automatically)
echo start-docker.bat       - Standard Docker startup with auto-detect
echo docker-simple.bat      - Simple Docker check and start
echo docker-ps.bat          - PowerShell version (more robust)
echo docker-clean-cache.bat - Clean Docker build cache
echo docker-help.bat        - Show Docker commands reference
echo.
echo === Fix & Setup Scripts ===
echo fix-package-locks.bat  - Regenerate package-lock.json files
echo fix-angular.bat        - Fix Angular installation issues
echo fix-database-error.bat - Fix database migration error
echo reset-database.bat     - Reset database (delete all data)
echo setup-database.bat     - Setup PostgreSQL database
echo npm-install-options.bat- Show npm installation options
echo.
echo === Status & Testing ===
echo status.bat             - Show current project status
echo test-docker.bat        - Test Docker installation
echo check-status.bat       - Check all services status
echo.
echo === Build & Start Scripts ===
echo build.bat              - Build for production
echo start-dev.bat          - Start without Docker (local dev)
echo start-docker.bat       - Start with Docker
echo.
echo === Documentation ===
echo README.md              - Project overview
echo DEVELOPMENT.md         - Development guide
echo DOCKER.md              - Docker setup guide
echo DATABASE_FIX.md        - Database error troubleshooting
echo SUMMARY.md             - Summary of all changes
echo.
echo ===============================================
echo TIP: Start with ./start.bat for guided setup
echo ===============================================
echo.
pause
