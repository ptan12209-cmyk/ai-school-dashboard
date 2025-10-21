@echo off
REM ================================================
REM FIX JEST ENVIRONMENT LOADING (WINDOWS)
REM ================================================

echo ========================================
echo Fixing Jest environment loading...
echo ========================================
echo.

REM ================================================
REM STEP 1: Create jest.setup.js
REM ================================================
echo Step 1: Creating jest.setup.js...
echo.

if exist "jest.setup.js" (
    echo [WARNING] jest.setup.js already exists
    set /p OVERWRITE="Do you want to overwrite it? (y/N): "
    if /i "%OVERWRITE%"=="y" (
        goto CREATE_SETUP
    ) else (
        echo [INFO] Keeping existing jest.setup.js
        goto STEP2
    )
) else (
    goto CREATE_SETUP
)

:CREATE_SETUP
(
    echo /**
    echo  * Jest Setup File
    echo  * Load environment variables before running tests
    echo  */
    echo.
    echo require^('dotenv'^).config^({ path: '.env.test' }^);
    echo.
    echo // If .env.test doesn't exist, try .env
    echo if ^(!process.env.DB_PASSWORD^) {
    echo   require^('dotenv'^).config^({ path: '.env' }^);
    echo }
    echo.
    echo // Ensure NODE_ENV is set to test
    echo process.env.NODE_ENV = 'test';
    echo.
    echo // Log to verify
    echo console.log^('✅ Jest Setup: Environment loaded'^);
    echo console.log^('   - NODE_ENV:', process.env.NODE_ENV^);
    echo console.log^('   - DB_NAME:', process.env.DB_NAME^);
    echo console.log^('   - DB_USER:', process.env.DB_USER^);
    echo console.log^('   - DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET'^);
) > jest.setup.js

echo [OK] Created jest.setup.js
echo.

:STEP2
REM ================================================
REM STEP 2: Backup package.json
REM ================================================
echo Step 2: Backing up package.json...
echo.

if exist "package.json" (
    copy /y package.json "package.json.backup.%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul
    echo [OK] Backed up package.json
) else (
    echo [ERROR] package.json not found!
    pause
    exit /b 1
)

echo.

REM ================================================
REM STEP 3: Check package.json
REM ================================================
echo Step 3: Checking package.json...
echo.

findstr /C:"setupFiles" package.json >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] setupFiles already exists in package.json
    echo [INFO] Please verify it includes: ^<rootDir^>/jest.setup.js
) else (
    echo [WARNING] setupFiles not found in package.json
    echo.
    echo [INFO] You need to add this to your jest config:
    echo.
    echo   "jest": {
    echo     "setupFiles": ["^<rootDir^>/jest.setup.js"],
    echo     ...
    echo   }
    echo.
)

echo.

REM ================================================
REM STEP 4: Check .env file
REM ================================================
echo Step 4: Checking .env file...
echo.

if exist ".env" (
    echo [OK] .env file exists
    
    findstr /C:"DB_PASSWORD" .env >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] DB_PASSWORD found in .env
    ) else (
        echo [WARNING] DB_PASSWORD not found in .env
    )
) else (
    if exist "_env" (
        echo [WARNING] .env not found, but _env exists
        set /p RENAME="Do you want to rename _env to .env? (y/N): "
        if /i "%RENAME%"=="y" (
            move /y "_env" ".env" >nul
            echo [OK] Renamed _env to .env
        )
    ) else (
        echo [ERROR] Neither .env nor _env found!
        echo [INFO] Please create .env file with database credentials
    )
)

echo.

REM ================================================
REM STEP 5: Test environment loading
REM ================================================
echo Step 5: Testing environment loading...
echo.

if exist "jest.setup.js" (
    echo [INFO] Running test load...
    node -e "require('./jest.setup.js')"
    
    if %errorlevel% equ 0 (
        echo [OK] Environment loading works!
    ) else (
        echo [ERROR] Environment loading failed!
        echo [INFO] Check your .env file
    )
) else (
    echo [ERROR] jest.setup.js not found!
)

echo.

REM ================================================
REM COMPLETION
REM ================================================
echo ==========================================
echo Fix Completed!
echo ==========================================
echo.
echo [OK] What was done:
echo    1. Created jest.setup.js
echo    2. Backed up package.json
echo    3. Checked .env file
echo    4. Tested environment loading
echo.
echo [INFO] Manual steps needed:
echo    1. Add to package.json jest config:
echo       "setupFiles": ["^<rootDir^>/jest.setup.js"],
echo.
echo    2. Run: npm test
echo.
echo [INFO] Verify fix worked:
echo    npm test should show: [OK] Jest Setup: Environment loaded
echo.
echo [INFO] If still failing:
echo    - Check .env has correct DB_PASSWORD
echo    - Run: psql -U postgres ^(test password^)
echo    - Check package.json has setupFiles
echo.
echo [OK] Setup completed!
echo.

pause
