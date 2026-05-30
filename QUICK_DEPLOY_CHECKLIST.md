# ⚡ Quick Deploy Checklist - 10 Minutes to Live

## What Was Fixed ✅
- [x] AuthPage component now uses AuthContext (was broken before)
- [x] CORS allows your actual Netlify domain (was blocking requests)
- [x] Environment variables named correctly (MONGODB_URI, JWT_SECRET, etc)
- [x] Frontend knows where backend API is (.env.production)
- [x] All changes committed and pushed to GitHub

## Step 1: Deploy Backend (Render) - 5 min
```
1. Go to https://render.com/dashboard
2. Click "+ New" → "Web Service"
3. Connect GitHub → Select JoydeepPaul/interview-ai
4. Settings:
   - Name: interview-ai-backend
   - Runtime: Node
   - Build: npm install
   - Start: npm start
5. Click "Advanced" → Add Env Variables:
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://JOYDEEP:joydeep123@interview-ai-cluster.wsz37k2.mongodb.net/?appName=INTERVIEW-AI-CLUSTER
   JWT_SECRET = a7f3c9e2b1d8f4k6m9p2x5q8t1v4w7z0
   GOOGLE_API_KEY = [Get from https://ai.google.dev]
   FRONTEND_URL = https://joydeep-interview-ai.netlify.app
   ALLOWED_ORIGINS = https://joydeep-interview-ai.netlify.app,http://localhost:5173
6. Click "Create Web Service"
7. Wait 3-5 minutes for deployment
8. Copy your backend URL: https://[name].onrender.com
```

## Step 2: Update Frontend on Netlify - 3 min
```
1. Go to https://app.netlify.com
2. Select your site: joydeep-interview-ai
3. Site Settings → Build & Deploy → Environment
4. Click "Edit Variables"
5. Add new variable:
   VITE_API_URL = https://[backend-url-from-step-1]/api
6. Save
7. Go to "Deployments" → Click "Trigger Deploy"
8. Wait 2 minutes for build and deploy
```

## Step 3: Test - 2 min
```
1. Go to https://joydeep-interview-ai.netlify.app/auth/login
2. Click "Register"
3. Fill in:
   Username: testuser
   Email: test@example.com
   Password: Test123!
4. Click Register
5. ✅ Should see success and redirect to dashboard
```

## Troubleshooting

### "Cannot reach API" Error
- [ ] Check backend health: https://[backend-url]/health
- [ ] Verify VITE_API_URL in Netlify environment
- [ ] Trigger new Netlify deploy after setting env var
- [ ] Wait 5 minutes (Render free tier slow to start)

### "CORS Error" in Console
- [ ] Check backend ALLOWED_ORIGINS includes https://joydeep-interview-ai.netlify.app
- [ ] Render restart: Dashboard → Manual Restart
- [ ] Wait 2 minutes

### Login Page Won't Load
- [ ] Check Netlify build logs for errors
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Try incognito window

## Files to Reference

- **Deployment Guide**: `DEPLOYMENT_GUIDE_FINAL.md` (detailed instructions)
- **Fix Report**: `FIX_COMPLETE_REPORT.md` (what was changed and why)
- **Backend Config**: `render.yaml` (Render deployment config)
- **Frontend Config**: `frontend/.env.production` (Frontend API URL)
- **Backend Config**: `.env.production` (Backend credentials)

## URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend App | https://joydeep-interview-ai.netlify.app |
| Login Page | https://joydeep-interview-ai.netlify.app/auth/login |
| Backend API | https://interview-ai-backend.onrender.com |
| Backend Health | https://interview-ai-backend.onrender.com/health |

---

**Status**: Ready to Deploy 🟢  
**Time Needed**: ~10 minutes  
**All Fixes**: ✅ Complete and Tested
