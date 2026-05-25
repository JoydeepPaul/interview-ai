#!/bin/bash

# ========================================
# Interview AI - Complete Deployment Script
# For macOS/Linux
# ========================================

set -e

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🚀 Interview AI - COMPLETE DEPLOYMENT AUTOMATION 🚀   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install from: https://git-scm.com/download"
    exit 1
fi

# ========================================
# Step 1: Initialize Git Repository
# ========================================
echo "[Step 1/5] Initializing Git Repository..."
git init
git config user.name "Joydeep Paul"
git config user.email "pauljoydeep@example.com"

echo "✅ Git initialized"

# ========================================
# Step 2: Stage and Commit Changes
# ========================================
echo ""
echo "[Step 2/5] Staging files..."
git add .

echo ""
echo "[Step 3/5] Creating initial commit..."
git commit -m "Initial commit: Interview AI production-ready

- ES modules unified backend
- All secrets removed
- Production deployment configs
- Ready for Netlify + Render

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo "✅ Files committed"

# ========================================
# Step 3: Get GitHub Details
# ========================================
echo ""
echo "[Step 4/5] GitHub Repository Setup"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: interview-ai"
echo "3. Visibility: Public"
echo "4. Click 'Create repository'"
echo ""
echo "5. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/JoydeepPaul/interview-ai.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
read -p "Press Enter to continue..."

# ========================================
# Step 4: Push to GitHub
# ========================================
echo ""
echo "[Step 5/5] Pushing code to GitHub..."
echo ""

git remote add origin https://github.com/JoydeepPaul/interview-ai.git
git branch -M main

echo ""
echo "🔐 When prompted, use your GitHub PAT token"
echo ""

git push -u origin main

# ========================================
# Step 5: Deployment Instructions
# ========================================
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ GIT SETUP COMPLETE - NOW DEPLOY TO PRODUCTION      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1️⃣  BACKEND (Render)"
echo "    a) Go to: https://render.com"
echo "    b) Create new Web Service from GitHub"
echo "    c) Select: JoydeepPaul/interview-ai"
echo "    d) Configure:"
echo "       - Name: interview-ai-backend"
echo "       - Build: npm install"
echo "       - Start: npm start"
echo "    e) Add Environment Variables:"
echo "       NODE_ENV = production"
echo "       MONGO_URI = [your MongoDB URI]"
echo "       JWT_SECRET = [generate with: openssl rand -hex 32]"
echo "       GOOGLE_GENAI_API_KEY = [from https://ai.google.dev/]"
echo "       FRONTEND_URL = [your Netlify URL]"
echo "       ALLOWED_ORIGINS = [your Netlify URL]"
echo "    f) Deploy!"
echo ""
echo "2️⃣  FRONTEND (Netlify)"
echo "    a) Go to: https://app.netlify.com"
echo "    b) Add new site from GitHub"
echo "    c) Select: JoydeepPaul/interview-ai"
echo "    d) Configure:"
echo "       - Base directory: frontend"
echo "       - Build: npm run build"
echo "       - Publish: frontend/dist"
echo "    e) Add Environment Variable:"
echo "       VITE_API_URL = [your Render backend URL]/api"
echo "    f) Deploy!"
echo ""
echo "📚 See DEPLOYMENT_INSTRUCTIONS.md for detailed steps"
echo ""
echo "🌍 Your app will be live and accessible worldwide!"
echo ""
