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
