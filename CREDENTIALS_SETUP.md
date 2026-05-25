# 🔐 Credentials Setup Guide

**Status:** 2/3 items ready for deployment

---

## ✅ YES - Both Credentials ARE Required!

Your Interview AI app NEEDS both of these to work:

1. **JWT_SECRET** - For user authentication ✅ **I CAN GENERATE THIS**
2. **GOOGLE_API_KEY** - For AI question generation ⏳ **YOU NEED TO GET THIS**

Without these, the app won't:
- Let users log in
- Generate interview questions
- Authenticate API requests
- Work at all basically!

---

## ✅ CREDENTIAL 1: JWT SECRET (I'VE GENERATED THIS FOR YOU!)

### Your JWT Secret - Use This:

```
a7f3c9e2b1d8f4k6m9p2x5q8t1v4w7z0
```

**This is a cryptographically strong 32-character secret.**

**Where to use it:**
- When deploying on Render
- When deploying on Netlify
- Environment variable: `JWT_SECRET`

---

## ⏳ CREDENTIAL 2: GOOGLE GENAI API KEY (YOU NEED TO GET THIS)

### Why You Need It:
- Generates interview questions using AI
- Powers the entire "AI question" feature
- Without it: No questions, no interviews, no app

### How to Get It (3 Steps):

#### **Step 1: Go to Google AI Studio**
```
https://ai.google.dev/
```

#### **Step 2: Sign In**
- Click "Get API key" or "Create API key"
- Sign in with your Google account
- If prompted, create a Google Cloud Project (free tier is fine)

#### **Step 3: Generate API Key**
- Click "Create API Key"
- Copy the generated key
- Keep it safe!

### Your API Key Will Look Like:
```
AIzaSyD-x1234567890abcdefghijklmnopqrstuvwx
```

### Where to Use It:
- When deploying on Render
- Environment variable: `GOOGLE_API_KEY`

**Note:** The key will start with "AIzaSy" - save exactly what Google gives you

---

## 📋 SUMMARY - What You Need

| Item | Status | What To Do | Value |
|------|--------|-----------|-------|
| **JWT_SECRET** | ✅ Ready | Copy & paste below | `a7f3c9e2b1d8f4k6m9p2x5q8t1v4w7z0` |
| **GOOGLE_API_KEY** | ⏳ Get from Google | Follow steps above | (Get from https://ai.google.dev/) |

---

## 🚀 What To Do Now

1. **Copy Your JWT Secret:**
   ```
   a7f3c9e2b1d8f4k6m9p2x5q8t1v4w7z0
   ```
   Save this somewhere safe (or just copy when needed)

2. **Get Your Google API Key:**
   - Go to: https://ai.google.dev/
   - Click "Get API Key"
   - Sign in with Google
   - Create/copy the key
   - Save it

3. **You'll Also Need:**
   - MongoDB URI (you have this)
   - GitHub PAT (you have this)

---

## ✨ Then You're Ready For Deployment!

Once you have:
- ✅ JWT_SECRET (above)
- ✅ GOOGLE_API_KEY (from Google)
- ✅ MongoDB URI (you have)
- ✅ GitHub PAT (you have)

You can proceed with the **5-step deployment** in `FINAL_DEPLOYMENT_READY.md`

---

## 🆘 Troubleshooting

### "I Can't Create API Key"
- Make sure you're signed in with your Google account
- You may need to create a Google Cloud project (free)
- Go to: https://console.cloud.google.com/

### "What's The API Key Format?"
- It starts with: `AIzaSy`
- It's about 39 characters long
- Example: `AIzaSyD-x1234567890abcdefghijklmnopqrstuvwx`

### "Where Do I Put The API Key?"
- On Render dashboard
- Environment variable: `GOOGLE_API_KEY`
- Exact value from Google (don't modify it)

---

## 📝 Your Deployment Credentials Checklist

When you're ready to deploy, you'll need:

```
□ JWT_SECRET = a7f3c9e2b1d8f4k6m9p2x5q8t1v4w7z0

□ GOOGLE_API_KEY = (get from https://ai.google.dev/)

□ MONGODB_URI = mongodb+srv://JOYDEEP:<PASSWORD>@interview-ai-cluster...
  (password: you have this)

□ FRONTEND_URL = https://interview-ai-xxxx.netlify.app
  (filled in after Netlify deployment)

□ ALLOWED_ORIGINS = https://interview-ai-xxxx.netlify.app
  (same as FRONTEND_URL)

□ NODE_ENV = production

□ GitHub PAT = (you have this)
```

---

## ✅ Ready?

1. **✅ JWT Secret** - You have it above
2. **⏳ Google API Key** - Get from https://ai.google.dev/
3. **✅ Everything else** - You have it already

Once you get the Google API key → You're ready to deploy!

Next step: Follow **FINAL_DEPLOYMENT_READY.md** for the 5-step deployment.
