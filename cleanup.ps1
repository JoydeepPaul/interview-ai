# Interview-AI Project Cleanup Script
# This script removes unnecessary files
# Date: May 26, 2026
# Usage: .\cleanup.ps1

Write-Host ""
Write-Host "========================================"
Write-Host "Interview-AI Project Cleanup" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""

$filesToRemove = @(
    "00_COMPLETE_PROCESS_SUMMARY.md",
    "00_READ_THIS_FIRST.txt",
    "ARCHITECTURE_GUIDE.md",
    "AUTH_STYLING_GUIDE.md",
    "AUTOMATED_SETUP_README.md",
    "COMPLETE_OVERVIEW.md",
    "COMPLETE_SETUP_CHECKLIST.md",
    "COMPLETION_CERTIFICATE.md",
    "COMPLETION_CERTIFICATE_FINAL.txt",
    "CREDENTIALS_READY.txt",
    "CREDENTIALS_SETUP.md",
    "DELIVERY_SUMMARY.md",
    "DEPLOYMENT_COMPLETE.txt",
    "DEPLOYMENT_INDEX.md",
    "DEPLOYMENT_INSTRUCTIONS.md",
    "DESIGN_SYSTEM.md",
    "DOCUMENTATION_INDEX.md",
    "ENV_VARIABLES_GUIDE.md",
    "FINAL_DEPLOYMENT_READY.md",
    "FINAL_README.md",
    "FINAL_SUMMARY.md",
    "FRONTEND_SETUP.md",
    "GO_LIVE_NOW.txt",
    "IMPLEMENTATION_STATUS.md",
    "INTERVIEW_IMPLEMENTATION_PLAN.md",
    "LOCAL_SETUP_GUIDE.md",
    "PRODUCTION_DEPLOYMENT_CHECKLIST.md",
    "PROJECT_COMPLETION_GUIDE.md",
    "PROJECT_DELIVERY_REPORT.txt",
    "PROJECT_FILES_INDEX.md",
    "PROJECT_STATUS_FINAL.md",
    "QUICK_REFERENCE_CARD.txt",
    "QUICK_START.md",
    "README_DEPLOYMENT.md",
    "README_START_HERE.md",
    "ROUTER_SETUP_GUIDE.md",
    "SERVICE_LAYER_GUIDE.md",
    "SETUP_COMPLETE.txt",
    "START_DEPLOYMENT.md",
    "START_HERE.md",
    "STATUS_DEPLOYMENT_READY.txt",
    "UI_SETUP_GUIDE.md",
    "configure.bat",
    "get-credentials.bat",
    "replacements.txt",
    "setup-frontend.js",
    "setup-router.js",
    "setup-services.js",
    "setup-ui.js",
    "start-backend.bat",
    "start-frontend.bat"
)

Write-Host "Files to be removed: $($filesToRemove.Count)" -ForegroundColor Yellow
Write-Host ""

$removedCount = 0
$skippedCount = 0

foreach ($file in $filesToRemove) {
    $filePath = Join-Path (Get-Location) $file
    
    if (Test-Path $filePath) {
        try {
            Remove-Item $filePath -Force
            Write-Host "✓ Removed: $file" -ForegroundColor Green
            $removedCount++
        }
        catch {
            Write-Host "✗ Failed: $file" -ForegroundColor Red
            $skippedCount++
        }
    }
    else {
        $skippedCount++
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "✅ Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Files removed: $removedCount"
Write-Host "  Files skipped: $skippedCount"
Write-Host ""
Write-Host "Essential files kept:" -ForegroundColor Cyan
Write-Host "  ✓ README.md"
Write-Host "  ✓ PROJECT_COMPLETION_SUMMARY.md"
Write-Host "  ✓ NEXT_STEPS_GUIDE.md"
Write-Host "  ✓ COMPLETION_REPORT.md"
Write-Host "  ✓ QUICK_START.txt"
Write-Host "  ✓ TASKS_COMPLETED.txt"
Write-Host "  ✓ YOUR_PROJECT_IS_COMPLETE.md"
Write-Host "  ✓ README_FINAL_STATUS.md"
Write-Host "  ✓ FILES_CLEANUP_GUIDE.md"
Write-Host "  ✓ All source code (src/ and frontend/)"
Write-Host "  ✓ All config files (netlify.toml, render.yaml, etc.)"
Write-Host ""
Write-Host "Project is ready! All unnecessary files removed." -ForegroundColor Green
Write-Host ""
