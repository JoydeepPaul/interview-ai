# 🚀 Complete Production Deployment Guide

## Step 1: Prepare Credentials

### MongoDB Connection String (READY ✅)
```
mongodb+srv://JOYDEEP:***@interview-ai-cluster.wsz37k2.mongodb.net/?appName=INTERVIEW-AI-CLUSTER
```
⚠️ **Replace `***` with your actual MongoDB password**

### Google GenAI API Key (NEEDED)
Get from: https://ai.google.dev/
- Click "Get API Key"
- Copy the key (looks like: `AIza...`)

### JWT Secret (AUTO-GENERATED)
```
use_auto_generated_jwt_secret_on_render_or_generate_openssl_rand_-hex_32
```

---

## Step 2: Push Code to GitHub

### 2a. Initialize Git (Run in your terminal)
```bash
cd "C:\Users\JOYDEEP PAUL\Desktop\GenAI"
git init
git config user.name "Joydeep Paul"
git config user.email "your-email@gmail.com"
git add .
git commit -m "Initial commit: Interview AI production-ready

- ES modules unified
- Secrets removed
- Render + Netlify configs included

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### 2b. Create GitHub Repo
1. Go to: https://github.com/new
2. **Repository name**: `interview-ai`
3. **Visibility**: Public
4. Click **Create repository**

### 2c. Push Code
```bash
git remote add origin https://github.com/JoydeepPaul/interview-ai.git
git branch -M main
git push -u origin main
# When prompted for password, use your GitHub PAT token (already provided)
```

---

## Step 3: Deploy Backend (Render)

### 3a. Create Render Account
- Go to: https://render.com
- Sign in with GitHub
- Authorize Render

### 3b. Create Web Service
1. Dashboard → **New +** → **Web Service**
2. Select: `JoydeepPaul/interview-ai`
3. Configure:
   - **Name**: `interview-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 3c. Add Environment Variables
Click **Environment** and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://JOYDEEP:<password>@interview-ai-cluster.wsz37k2.mongodb.net/?appName=INTERVIEW-AI-CLUSTER` |
| `JWT_SECRET` | Generate with: `openssl rand -hex 32` |
| `GOOGLE_GENAI_API_KEY` | Get from: https://ai.google.dev/ |
| `FRONTEND_URL` | `https://interview-ai.netlify.app` (update after Netlify deploy) |
| `ALLOWED_ORIGINS` | `https://interview-ai.netlify.app` (update after Netlify deploy) |

### 3d. Deploy
- Click **Create Web Service**
- Wait for build to complete
- Your backend URL will be like: `https://interview-ai-backend-xxxx.onrender.com`

---

## Step 4: Deploy Frontend (Netlify)

### 4a. Connect Repository
1. Go to: https://app.netlify.com/teams/info-pauljoydeep/projects
2. Click **Add new site** → **Import an existing project**
3. Select GitHub → `JoydeepPaul/interview-ai`

### 4b. Configure Build
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

### 4c. Add Environment Variables
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://interview-ai-backend-xxxx.onrender.com/api` (from Render)

### 4d. Deploy
- Click **Deploy**
- Your frontend URL will be like: `https://interview-ai-xxxx.netlify.app`

---

## Step 5: Update Backend CORS

After Netlify deployment:

1. Go back to Render dashboard
2. Select `interview-ai-backend`
3. Update environment variables:
   - `FRONTEND_URL` = Your Netlify URL
   - `ALLOWED_ORIGINS` = Your Netlify URL
4. **Redeploy** by going to **Deployments** → **Manual Deploy**

---

## Step 6: Verify Deployment

### 6a. Test Backend
```bash
curl https://interview-ai-backend-xxxx.onrender.com/health
```
Should return:
```json
{"status":"OK","timestamp":"2026-05-21T..."}
```

### 6b. Test Frontend
Open: `https://interview-ai-xxxx.netlify.app`
- Should see login page
- Try registering a new account
- Start an interview

### 6c. Test API Integration
1. Register/Login on frontend
2. Start interview
3. Should generate questions (uses Google GenAI)
4. Submit answers
5. Should see AI evaluation

---

## 🎉 Deployment Complete!

### Your live URLs:
- **Frontend**: `https://interview-ai-xxxx.netlify.app`
- **Backend**: `https://interview-ai-backend-xxxx.onrender.com`
- **Database**: MongoDB Atlas

### Share with Users:
```
Interview AI is live! 🎉
Visit: https://interview-ai-xxxx.netlify.app

Practice interview questions powered by AI!
```

---

## 🔧 Troubleshooting

### Backend won't start
- Check Render logs for error
- Verify MONGO_URI is correct
- Ensure JWT_SECRET is set
- Check Google API key is valid

### Frontend shows blank page
- Check browser console (F12)
- Verify VITE_API_URL is correct
- Check that backend URL is accessible

### API calls fail
- Verify backend is running
- Check CORS settings (ALLOWED_ORIGINS)
- Ensure frontend URL matches ALLOWED_ORIGINS

### Questions not generating
- Verify GOOGLE_GENAI_API_KEY is correct
- Check Render logs for AI service errors
- Ensure MongoDB has free tier capacity

---

## 📋 Credentials Checklist

- [ ] MongoDB URI ready
- [ ] Google GenAI API Key ready
- [ ] GitHub repo created
- [ ] Render account created
- [ ] Netlify account verified
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Netlify
- [ ] Both URLs updated in CORS
- [ ] All tests passing
- [ ] Ready for users!

---

**Built with ❤️ - Now live for the world! 🌍**
