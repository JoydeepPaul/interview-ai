@echo off
REM Interview AI - Complete Automated Setup
REM This batch file will set up everything

cls
color 0B
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Interview AI - Complete Automated Setup               ║
echo ║          Starting setup process...                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo 📋 Checking prerequisites...
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo ❌ Node.js is not installed!
    echo 📥 Please install from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js: %NODE_VERSION%
echo ✅ npm: %NPM_VERSION%
echo.

REM Step 1: Create .env files
echo 🔧 Setting up environment files...
if not exist ".env" (
    (
        echo # MongoDB Connection
        echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-ai
        echo.
        echo # JWT Secret
        echo JWT_SECRET=change_this_to_a_random_string_32_characters_long
        echo.
        echo # Google GenAI API Key
        echo GOOGLE_GENAI_API_KEY=paste_your_api_key_here
        echo.
        echo # Server Configuration
        echo PORT=3000
        echo NODE_ENV=development
        echo.
        echo # Frontend URL
        echo FRONTEND_URL=http://localhost:5173
        echo.
        echo # Allowed Origins
        echo ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
    ) > .env
    echo ✅ Created .env file
) else (
    echo ⏭️  .env already exists, skipping...
)

if not exist "frontend\.env.local" (
    (
        echo VITE_API_URL=http://localhost:3000/api
    ) > frontend\.env.local
    echo ✅ Created frontend\.env.local
) else (
    echo ⏭️  frontend\.env.local already exists, skipping...
)
echo.

REM Step 2: Install backend dependencies
echo 📦 Installing backend dependencies...
if exist "node_modules" (
    echo ⏭️  Already installed, skipping...
) else (
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
)
echo.

REM Step 3: Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
if exist "node_modules" (
    echo ⏭️  Already installed, skipping...
) else (
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
)
cd ..
echo.

REM Step 4: Create startup scripts
echo 🚀 Creating startup scripts...
if not exist "start-backend.bat" (
    (
        echo @echo off
        echo cls
        echo title Interview AI - Backend
        echo echo Starting Interview AI Backend...
        echo echo.
        echo npm run dev
        echo pause
    ) > start-backend.bat
    echo ✅ Created start-backend.bat
)

if not exist "start-frontend.bat" (
    (
        echo @echo off
        echo cls
        echo title Interview AI - Frontend
        echo echo Starting Interview AI Frontend...
        echo echo.
        echo cd frontend
        echo npm run dev
        echo pause
    ) > start-frontend.bat
    echo ✅ Created start-frontend.bat
)
echo.

REM Step 5: Create configuration helper
if not exist "configure.bat" (
    (
        echo @echo off
        echo cls
        echo title Interview AI - Configure Environment
        echo.
        echo echo.
        echo echo ╔════════════════════════════════════════════════════════════╗
        echo echo ║     Interview AI - Configuration Helper                   ║
        echo echo ╚════════════════════════════════════════════════════════════╝
        echo echo.
        echo echo This script will help you configure your environment.
        echo echo.
        echo echo 1. Open .env file in Notepad
        echo echo 2. Replace the following:
        echo echo    - MONGODB_URI: Your MongoDB Atlas connection string
        echo echo    - GOOGLE_GENAI_API_KEY: Your API key from Google AI Studio
        echo echo.
        echo echo Opening .env file now...
        echo echo.
        echo timeout /t 2 /nobreak
        echo start notepad .env
        echo echo.
        echo echo ╔════════════════════════════════════════════════════════════╗
        echo echo ║  After editing, save and close the file                   ║
        echo echo ║  Then run start-backend.bat and start-frontend.bat        ║
        echo echo ╚════════════════════════════════════════════════════════════╝
        echo echo.
        echo pause
    ) > configure.bat
    echo ✅ Created configure.bat
)
echo.

REM Success message
echo ╔════════════════════════════════════════════════════════════╗
echo ║          ✅ Setup Complete!                              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 📝 Next Steps:
echo.
echo 1️⃣  Get Your Credentials:
echo    - MongoDB URI: https://www.mongodb.com/cloud/atlas
echo    - Google GenAI API Key: https://ai.google.dev/
echo.
echo 2️⃣  Configure Environment:
echo    Run: configure.bat
echo    (This will open .env file to edit^)
echo.
echo 3️⃣  Start the Application:
echo    Terminal 1: start-backend.bat
echo    Terminal 2: start-frontend.bat
echo.
echo 4️⃣  Open in Browser:
echo    http://localhost:5173
echo.
echo 📚 Documentation:
echo    - LOCAL_SETUP_GUIDE.md
echo    - FINAL_README.md
echo    - ARCHITECTURE_GUIDE.md
echo.
echo 💡 Tip: Keep both terminals open while developing
echo.
pause
