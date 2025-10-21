@echo off
REM ================================================
REM FIX NODE_ENV ERROR ON WINDOWS
REM ================================================

echo ========================================
echo Fixing NODE_ENV error for Windows...
echo ========================================
echo.

REM ================================================
REM ASK USER WHICH METHOD
REM ================================================
echo Choose fix method:
echo.
echo 1. Install cross-env (RECOMMENDED - works on all platforms)
echo 2. Remove NODE_ENV from scripts (QUICK FIX - simpler)
echo.
set /p CHOICE="Enter your choice (1 or 2): "

if "%CHOICE%"=="1" goto METHOD1
if "%CHOICE%"=="2" goto METHOD2

echo Invalid choice. Using Method 2 (Quick Fix)
goto METHOD2

:METHOD1
REM ================================================
REM METHOD 1: Install cross-env
REM ================================================
echo.
echo ========================================
echo Method 1: Installing cross-env...
echo ========================================
echo.

echo [INFO] Installing cross-env...
call npm install --save-dev cross-env

if %errorlevel% equ 0 (
    echo [OK] cross-env installed successfully
) else (
    echo [ERROR] Failed to install cross-env
    pause
    exit /b 1
)

echo.
echo [INFO] cross-env installed!
echo.
echo [MANUAL STEP NEEDED]
echo Please update your package.json scripts to use cross-env:
echo.
echo   BEFORE: "test": "NODE_ENV=test jest --runInBand --forceExit"
echo   AFTER:  "test": "cross-env NODE_ENV=test jest --runInBand --forceExit"
echo.
echo Example scripts section:
echo   "scripts": {
echo     "test": "cross-env NODE_ENV=test jest --runInBand --forceExit",
echo     "test:watch": "cross-env NODE_ENV=test jest --watch --runInBand",
echo     "test:coverage": "cross-env NODE_ENV=test jest --coverage --runInBand --forceExit"
echo   }
echo.
echo After updating, run: npm test
echo.
pause
exit /b 0

:METHOD2
REM ================================================
REM METHOD 2: Remove NODE_ENV from scripts
REM ================================================
echo.
echo ========================================
echo Method 2: Removing NODE_ENV from scripts...
echo ========================================
echo.

echo [INFO] Backing up package.json...
copy /y package.json "package.json.backup.%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul
echo [OK] Backup created

echo.
echo [INFO] Updating package.json...

REM Use PowerShell to replace NODE_ENV=test with empty string
powershell -Command "(Get-Content package.json) -replace 'NODE_ENV=test ', '' | Set-Content package.json"

if %errorlevel% equ 0 (
    echo [OK] package.json updated
) else (
    echo [WARNING] Could not auto-update package.json
    echo [INFO] Please manually remove 'NODE_ENV=test ' from scripts
)

echo.
echo ========================================
echo Fix Completed!
echo ========================================
echo.
echo [OK] What was done:
echo    - Backed up package.json
echo    - Removed NODE_ENV=test from scripts
echo.
echo [INFO] The NODE_ENV will be set by jest.setup.js instead
echo.
echo [TEST] Now run: npm test
echo.
pause
exit /b 0
