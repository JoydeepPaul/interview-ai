@echo off
REM Interview-AI Project Cleanup Script
REM This script removes unnecessary files that are no longer needed
REM Date: May 26, 2026

cd /d "%~dp0"

echo.
echo ========================================
echo Interview-AI Project Cleanup
echo ========================================
echo.
echo Removing unnecessary documentation files...
echo.

REM Remove old documentation files
del /q "00_COMPLETE_PROCESS_SUMMARY.md" 2>nul
del /q "00_READ_THIS_FIRST.txt" 2>nul
del /q "ARCHITECTURE_GUIDE.md" 2>nul
del /q "AUTH_STYLING_GUIDE.md" 2>nul
del /q "AUTOMATED_SETUP_README.md" 2>nul
del /q "COMPLETE_OVERVIEW.md" 2>nul
del /q "COMPLETE_SETUP_CHECKLIST.md" 2>nul
del /q "COMPLETION_CERTIFICATE.md" 2>nul
del /q "COMPLETION_CERTIFICATE_FINAL.txt" 2>nul
del /q "CREDENTIALS_READY.txt" 2>nul
del /q "CREDENTIALS_SETUP.md" 2>nul
del /q "DELIVERY_SUMMARY.md" 2>nul
del /q "DEPLOYMENT_COMPLETE.txt" 2>nul
del /q "DEPLOYMENT_INDEX.md" 2>nul
del /q "DEPLOYMENT_INSTRUCTIONS.md" 2>nul
del /q "DESIGN_SYSTEM.md" 2>nul
del /q "DOCUMENTATION_INDEX.md" 2>nul
del /q "ENV_VARIABLES_GUIDE.md" 2>nul
del /q "FINAL_DEPLOYMENT_READY.md" 2>nul
del /q "FINAL_README.md" 2>nul
del /q "FINAL_SUMMARY.md" 2>nul
del /q "FRONTEND_SETUP.md" 2>nul
del /q "GO_LIVE_NOW.txt" 2>nul
del /q "IMPLEMENTATION_STATUS.md" 2>nul
del /q "INTERVIEW_IMPLEMENTATION_PLAN.md" 2>nul
del /q "LOCAL_SETUP_GUIDE.md" 2>nul
del /q "PRODUCTION_DEPLOYMENT_CHECKLIST.md" 2>nul
del /q "PROJECT_COMPLETION_GUIDE.md" 2>nul
del /q "PROJECT_DELIVERY_REPORT.txt" 2>nul
del /q "PROJECT_FILES_INDEX.md" 2>nul
del /q "PROJECT_STATUS_FINAL.md" 2>nul
del /q "QUICK_REFERENCE_CARD.txt" 2>nul
del /q "QUICK_START.md" 2>nul
del /q "README_DEPLOYMENT.md" 2>nul
del /q "README_START_HERE.md" 2>nul
del /q "ROUTER_SETUP_GUIDE.md" 2>nul
del /q "SERVICE_LAYER_GUIDE.md" 2>nul
del /q "SETUP_COMPLETE.txt" 2>nul
del /q "START_DEPLOYMENT.md" 2>nul
del /q "START_HERE.md" 2>nul
del /q "STATUS_DEPLOYMENT_READY.txt" 2>nul
del /q "UI_SETUP_GUIDE.md" 2>nul
del /q "configure.bat" 2>nul
del /q "get-credentials.bat" 2>nul
del /q "replacements.txt" 2>nul
del /q "setup-frontend.js" 2>nul
del /q "setup-router.js" 2>nul
del /q "setup-services.js" 2>nul
del /q "setup-ui.js" 2>nul
del /q "start-backend.bat" 2>nul
del /q "start-frontend.bat" 2>nul

echo.
echo ========================================
echo ✅ Cleanup Complete!
echo ========================================
echo.
echo Essential files kept:
echo   ✅ README.md
echo   ✅ PROJECT_COMPLETION_SUMMARY.md
echo   ✅ NEXT_STEPS_GUIDE.md
echo   ✅ COMPLETION_REPORT.md
echo   ✅ QUICK_START.txt
echo   ✅ TASKS_COMPLETED.txt
echo   ✅ YOUR_PROJECT_IS_COMPLETE.md
echo   ✅ README_FINAL_STATUS.md
echo   ✅ All source code (src/ and frontend/)
echo   ✅ All config files
echo.
echo Project is ready!
echo.
pause
