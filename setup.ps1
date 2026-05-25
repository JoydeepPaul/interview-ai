# Interview AI - Complete Automated Setup Script
# This script will set up the entire project

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Interview AI - Complete Automated Setup               ║" -ForegroundColor Cyan
Write-Host "║          Starting setup process...                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
$nodeCheck = node --version 2>$null
$npmCheck = npm --version 2>$null

if (-not $nodeCheck) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "📥 Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js: $nodeCheck" -ForegroundColor Green
Write-Host "✅ npm: $npmCheck" -ForegroundColor Green
Write-Host ""

# Step 1: Create environment files
Write-Host "🔧 Setting up environment files..." -ForegroundColor Yellow

$backendEnv = @"
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-ai

# JWT Secret (auto-generated)
JWT_SECRET=$(-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_}))

# Google GenAI API Key
GOOGLE_GENAI_API_KEY=paste_your_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Allowed Origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
"@

$frontendEnv = @"
VITE_API_URL=http://localhost:3000/api
"@

# Save backend .env
$backendEnv | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "✅ Created .env (Backend configuration)" -ForegroundColor Green

# Save frontend .env
$frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
Write-Host "✅ Created frontend\.env.local" -ForegroundColor Green
Write-Host ""

# Step 2: Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "⏭️  Backend dependencies already installed, skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}
Write-Host ""

# Step 3: Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location frontend
if (Test-Path "node_modules") {
    Write-Host "⏭️  Frontend dependencies already installed, skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}
Pop-Location
Write-Host ""

# Step 4: Create startup scripts
Write-Host "🚀 Creating startup scripts..." -ForegroundColor Yellow

$backendStart = @"
@echo off
cls
title Interview AI - Backend
echo Starting Interview AI Backend...
echo.
npm run dev
pause
"@

$frontendStart = @"
@echo off
cls
title Interview AI - Frontend
echo Starting Interview AI Frontend...
echo.
cd frontend
npm run dev
pause
"@

$backendStart | Out-File -FilePath "start-backend.bat" -Encoding ASCII
Write-Host "✅ Created start-backend.bat" -ForegroundColor Green

$frontendStart | Out-File -FilePath "start-frontend.bat" -Encoding ASCII
Write-Host "✅ Created start-frontend.bat" -ForegroundColor Green
Write-Host ""

# Step 5: Create configuration helper
Write-Host "⚙️  Creating configuration helper..." -ForegroundColor Yellow

$configHelper = @"
@echo off
cls
title Interview AI - Configure Environment

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Interview AI - Configuration Helper                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo This script will help you configure your environment.
echo.
echo 1. Open .env file in Notepad
echo 2. Replace the following:
echo    - MONGODB_URI: Your MongoDB Atlas connection string
echo    - GOOGLE_GENAI_API_KEY: Your API key from Google AI Studio
echo.
echo Opening .env file now...
echo.
timeout /t 2 /nobreak
start notepad .env
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  After editing, save and close the file                   ║
echo ║  Then run start-backend.bat and start-frontend.bat        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
"@

$configHelper | Out-File -FilePath "configure.bat" -Encoding ASCII
Write-Host "✅ Created configure.bat" -ForegroundColor Green
Write-Host ""

# Step 6: Success message
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✅ Setup Complete!                              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Get Your Credentials:" -ForegroundColor Yellow
Write-Host "   • MongoDB URI: https://www.mongodb.com/cloud/atlas" -ForegroundColor Gray
Write-Host "   • Google GenAI API Key: https://ai.google.dev/" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  Configure Environment:" -ForegroundColor Yellow
Write-Host "   Run: configure.bat" -ForegroundColor Cyan
Write-Host "   (This will open .env file to edit)" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  Start the Application:" -ForegroundColor Yellow
Write-Host "   Terminal 1: start-backend.bat" -ForegroundColor Cyan
Write-Host "   Terminal 2: start-frontend.bat" -ForegroundColor Cyan
Write-Host ""

Write-Host "4️⃣  Open in Browser:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   • LOCAL_SETUP_GUIDE.md" -ForegroundColor Gray
Write-Host "   • FINAL_README.md" -ForegroundColor Gray
Write-Host "   • ARCHITECTURE_GUIDE.md" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 Tip: Keep both terminals open while developing" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
