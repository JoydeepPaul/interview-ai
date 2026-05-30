# 🚀 Complete Deployment Guide for Interview AI

## Architecture Overview
- **Frontend**: React + Vite deployed on Netlify (https://joydeep-interview-ai.netlify.app)
- **Backend**: Node.js + Express deployed on Render (https://interview-ai-backend.onrender.com)
- **Database**: MongoDB Atlas (https://interview-ai-cluster.wsz37k2.mongodb.net)

---

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub
```bash
cd C:\Users\JOYDEEP PAUL\Desktop\GenAI.worktrees\copilot-login-authentication-implementation
git add -A
git commit -m "fix: Update auth system and environment configurations

- Fix AuthPage component to use AuthContext
- Update CORS to use correct Netlify domain
- Configure environment variables for production
- Update render.yaml with correct env vars"
git push origin main
```

### Step 2: Deploy to Render
1. Go to https://render.com/dashboard
2. Click **"New+" → "Web Service"**
3. Select your GitHub repo: **JoydeepPaul/interview-ai**
4. Configure:
   - **Name**: `interview-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click **"Advanced"** and add these environment variables:
   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://JOYDEEP:joydeep123@interview-ai-cluster.wsz37k2.mongodb.net/?appName=INTERVIEW-AI-CLUSTER
   JWT_SECRET = a7f3c9e2b1d8f4k6m9p2x5q8t1v4w7z0
   GOOGLE_API_KEY = AIzaSyPlaceholder_Replace_With_Your_Real_Key
   FRONTEND_URL = https://joydeep-interview-ai.netlify.app
   ALLOWED_ORIGINS = https://joydeep-interview-ai.netlify.app,http://localhost:5173
   ```
6. Click **"Create Web Service"**
7. Wait for deployment to complete (3-5 minutes)
8. Note your backend URL (e.g., `https://interview-ai-backend.onrender.com`)

---

## Part 2: Deploy/Update Frontend on Netlify

### Step 1: Connect to Netlify (if not already connected)
1. Go to https://app.netlify.com
2. Click **"Add new site" → "Import an existing project"**
3. Select GitHub and authorize
4. Choose repo: **JoydeepPaul/interview-ai**
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### Step 2: Add Environment Variables to Netlify
1. In your Netlify site settings → **"Build & deploy" → "Environment"**
2. Click **"Edit variables"** and add:
   ```
   VITE_API_URL = https://interview-ai-backend.onrender.com/api
   ```
   *Replace with your actual Render backend URL*

### Step 3: Trigger New Deploy
1. Push code to main branch (already done)
2. Netlify automatically deploys
3. Or manually trigger: **Deploys → "Trigger deploy"**
4. Wait for deployment (2-3 minutes)
5. Your site: https://joydeep-interview-ai.netlify.app/auth/login

---

## Part 3: Verify Everything Works

### Test Login Flow
1. Go to https://joydeep-interview-ai.netlify.app/auth/login
2. Click **"Register"**
3. Enter:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **Password**: `Test123!`
4. Click **"Register"**
5. Should see: Success message + redirect to Dashboard

### Check Backend
1. Open browser console (F12 → Network tab)
2. Attempt login and watch network requests
3. Should see POST to `https://interview-ai-backend.onrender.com/api/auth/login`
4. Response should include `token` and `user` data

### Debug Issues
1. **CORS Error in Console?**
   - Check backend `ALLOWED_ORIGINS` includes your Netlify URL
   - Render restart may be needed: Dashboard → Manual restart

2. **"Cannot reach API" Error?**
   - Check `VITE_API_URL` is set in Netlify env variables
   - Trigger a new Netlify deploy after setting env var
   - Wait 2 min for rebuild and deploy

3. **"Network Error" in App?**
   - Backend may still be starting (Render free tier is slow)
   - Check: https://interview-ai-backend.onrender.com/health
   - Should show `{"status": "OK"}`

---

## Quick Reference: Deployed URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | https://joydeep-interview-ai.netlify.app | User login/app |
| Backend API | https://interview-ai-backend.onrender.com | API server |
| Backend Health | https://interview-ai-backend.onrender.com/health | Backend status |
| Netlify Admin | https://app.netlify.com | Manage frontend |
| Render Admin | https://render.com/dashboard | Manage backend |

---

## Key Changes Made

### ✅ Fixed AuthPage Component
- **Before**: Expected `setToken` prop (old pattern)
- **After**: Uses `useAuth()` hook with AuthContext (modern pattern)
- **Impact**: Login/Register now properly saves token and redirects to dashboard

### ✅ Fixed CORS Configuration
- **Before**: Wrong domain `interview-ai.netlify.app`
- **After**: Correct domain `joydeep-interview-ai.netlify.app`
- **Impact**: Frontend can now make API requests without CORS errors

### ✅ Fixed Environment Variables
- **Backend** (`render.yaml`): Uses correct `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `ALLOWED_ORIGINS`
- **Frontend** (`.env.production`): Points to production backend API
- **Impact**: Both environments properly configured for production

### ✅ Updated render.yaml
- **Before**: Used incorrect env var names (`MONGO_URI`, `GOOGLE_GENAI_API_KEY`)
- **After**: Uses correct names matching code (`MONGODB_URI`, `GOOGLE_API_KEY`)
- **Impact**: Environment variables actually work on Render

---

## Troubleshooting Checklist

- [ ] Backend URL is `https://interview-ai-backend.onrender.com/api`
- [ ] Frontend env var `VITE_API_URL` is set in Netlify
- [ ] Backend has `ALLOWED_ORIGINS` including your frontend URL
- [ ] MongoDB connection string is correct in backend env vars
- [ ] JWT_SECRET is set (same value in backend only)
- [ ] Frontend shows login page at `/auth/login`
- [ ] No CORS errors in browser console
- [ ] Backend health check responds OK
- [ ] Login creates user in MongoDB successfully

---

## Next Steps (Optional)

1. **Add Google GenAI API Key**
   - Get key from https://ai.google.dev
   - Set `GOOGLE_API_KEY` in Render backend environment

2. **Custom Domain**
   - Netlify supports custom domains in settings
   - Render also supports custom domains

3. **CI/CD Improvements**
   - Enable GitHub Actions for automated tests before deploy
   - Add more robust error handling in frontend

---

**Last Updated**: May 30, 2026
**Status**: Ready for Deployment ✅
