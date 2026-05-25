@echo off
REM Interview AI - Credentials Setup Helper
REM This script will help you get and configure your credentials

cls
color 0B
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Interview AI - Credentials Setup Helper               ║
echo ║                Getting Your Keys                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:menu
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          What would you like to do?                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 1. Get MongoDB Connection String
echo 2. Get Google GenAI API Key
echo 3. Generate JWT Secret
echo 4. Edit .env file
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto mongodb
if "%choice%"=="2" goto genai
if "%choice%"=="3" goto jwt
if "%choice%"=="4" goto editenv
if "%choice%"=="5" goto end
goto menu

:mongodb
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          Get MongoDB Connection String                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Follow these steps:
echo.
echo 1. Go to: https://www.mongodb.com/cloud/atlas
echo 2. Sign up for free (or login)
echo 3. Create a new project
echo 4. Create a cluster (Free tier is fine)
echo 5. Click "Connect" button
echo 6. Choose "Connect your application"
echo 7. Copy the connection string
echo 8. Replace username:password with your credentials
echo.
echo Your connection string will look like:
echo mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/interview-ai?retryWrites=true^&w=majority
echo.
echo Opening MongoDB Atlas in browser...
timeout /t 2 /nobreak
start https://www.mongodb.com/cloud/atlas
echo.
pause
goto menu

:genai
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          Get Google GenAI API Key                         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Follow these steps:
echo.
echo 1. Go to: https://ai.google.dev/
echo 2. Click "Get API Key"
echo 3. Create new API key (or use existing)
echo 4. Copy the API key
echo 5. Paste it in your .env file
echo.
echo Your API key will be a long string starting with "AI"
echo.
echo Opening Google AI Studio in browser...
timeout /t 2 /nobreak
start https://ai.google.dev/
echo.
pause
goto menu

:jwt
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          Generate JWT Secret                              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Your JWT Secret has been auto-generated!
echo.
echo Use this command in PowerShell to generate a new one:
echo node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.
echo Or you can use any random 32+ character string.
echo.
pause
goto menu

:editenv
cls
start notepad .env
echo .env file opened in Notepad
echo.
pause
goto menu

:end
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          Thank you for using Setup Helper!               ║
echo ║                                                            ║
echo ║     Don't forget to run configure.bat after getting        ║
echo ║     your credentials to finalize setup!                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
exit /b 0
