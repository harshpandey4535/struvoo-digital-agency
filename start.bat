@echo off
setlocal
 title STRUVOO Website Launcher

REM Always run from this script's folder, even when launched from a shortcut.
cd /d "%~dp0"

 echo.
 echo ==========================================
 echo          STRUVOO WEBSITE LAUNCHER
 echo ==========================================
 echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or is not on PATH.
    echo Install the LTS version from https://nodejs.org/ and run this file again.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm was not found. Reinstall Node.js LTS with npm included.
    echo.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo [ERROR] package.json was not found.
    echo Keep this BAT file in the project root, beside package.json.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [INFO] Dependencies are not installed. Installing them now...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. Check your internet connection and try again.
        pause
        exit /b 1
    )
)

echo [INFO] Starting STRUVOO on http://localhost:5173
 echo [INFO] Keep the server window open while using the website.
 echo.

REM Run Vite in its own window and open the local site in the default browser.
start "STRUVOO Vite Server" cmd /k "cd /d ""%CD%"" && npm run dev -- --host 127.0.0.1 --port 5173 --strictPort"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"

exit /b 0
