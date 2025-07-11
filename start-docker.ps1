# Docker Startup Script for NgAutodeskForgeViewer
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Checking Docker Desktop status..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not installed"
    }
    Write-Host "[OK] Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not installed." -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker Desktop is running
Write-Host ""
Write-Host "Checking if Docker Desktop is running..." -ForegroundColor Cyan
try {
    docker ps 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
    Write-Host "[OK] Docker Desktop is running" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Docker Desktop is not running. Attempting to start it..." -ForegroundColor Yellow
    
    # Try to start Docker Desktop
    $dockerPaths = @(
        "C:\Program Files\Docker\Docker\Docker Desktop.exe",
        "$env:LOCALAPPDATA\Docker\Docker Desktop.exe"
    )
    
    $dockerFound = $false
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            Start-Process $path
            $dockerFound = $true
            break
        }
    }
    
    if (-not $dockerFound) {
        Write-Host "[ERROR] Could not find Docker Desktop executable." -ForegroundColor Red
        Write-Host "Please start Docker Desktop manually from the Start Menu." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "Waiting for Docker Desktop to start (up to 60 seconds)..." -ForegroundColor Yellow
    
    # Wait for Docker to be ready
    $maxAttempts = 12
    $attempt = 0
    $dockerReady = $false
    
    while ($attempt -lt $maxAttempts -and -not $dockerReady) {
        Start-Sleep -Seconds 5
        $attempt++
        
        try {
            docker ps 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                $dockerReady = $true
            }
        } catch {}
        
        if (-not $dockerReady) {
            Write-Host "Waiting... attempt $attempt of $maxAttempts" -ForegroundColor Gray
        }
    }
    
    if (-not $dockerReady) {
        Write-Host "[ERROR] Docker Desktop could not start after 60 seconds." -ForegroundColor Red
        Write-Host "Please start Docker Desktop manually and try again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "[OK] Docker Desktop started successfully!" -ForegroundColor Green
}

# Start Docker Compose
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Starting services with Docker Compose..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

docker-compose up
