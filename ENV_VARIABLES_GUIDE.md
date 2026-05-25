# Interview AI - Environment Variables Setup

## Backend Environment Variables (Render)

```env
# Application
NODE_ENV=production
PORT=3000

# Database
MONGO_URI=mongodb+srv://JOYDEEP:your_password@interview-ai-cluster.wsz37k2.mongodb.net/?appName=INTERVIEW-AI-CLUSTER

# Security
JWT_SECRET=your_generated_jwt_secret_here

# AI Service
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here

# Frontend
FRONTEND_URL=https://your-netlify-site.netlify.app
ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
```

## Frontend Environment Variables (Netlify)

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

## How to Generate/Get Each Variable

### 1. MONGO_URI
- Go to: https://cloud.mongodb.com/
- Select your cluster
- Click "Connect" → "Drivers"
- Copy the connection string
- Replace `<password>` with your actual password
- Add `/?appName=INTERVIEW-AI-CLUSTER` to the end

**Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/?appName=INTERVIEW-AI-CLUSTER
```

### 2. JWT_SECRET
Generate a secure random string:

**On Windows (Git Bash or PowerShell):**
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**On macOS/Linux:**
```bash
openssl rand -hex 32
```

**Example output:**
```
f8a9c2e4b1d5f3a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5f7a9b1d3e5f7a9b1
```

### 3. GOOGLE_GENAI_API_KEY
- Go to: https://ai.google.dev/
- Click "Get API Key"
- Create new API key in Google Cloud Console
- Copy the key (starts with `AIza`)

**Example:**
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. FRONTEND_URL & ALLOWED_ORIGINS
After Netlify deployment, you'll get a URL like:
```
https://interview-ai-xxxxx.netlify.app
```

Use this URL for both:
- `FRONTEND_URL` (for backend to know where frontend is)
- `ALLOWED_ORIGINS` (for CORS to allow requests from frontend)

### 5. VITE_API_URL
After Render deployment, you'll get a URL like:
```
https://interview-ai-backend-xxxxx.onrender.com
```

Append `/api` to it:
```
https://interview-ai-backend-xxxxx.onrender.com/api
```

---

## Production Checklist

- [ ] MONGO_URI is set and working
- [ ] JWT_SECRET is a strong random string
- [ ] GOOGLE_GENAI_API_KEY is valid
- [ ] NODE_ENV is set to `production`
- [ ] FRONTEND_URL points to live Netlify URL
- [ ] ALLOWED_ORIGINS matches FRONTEND_URL
- [ ] VITE_API_URL points to live Render backend
- [ ] All variables added to Render dashboard
- [ ] All variables added to Netlify dashboard
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Health check passing: `https://your-backend.onrender.com/health`
- [ ] Can register/login on frontend
- [ ] Can start interview and generate questions
- [ ] Can submit answers and get AI evaluation

---

## Security Tips

1. **Never commit `.env` files** - Already excluded in `.gitignore`
2. **Use strong JWT_SECRET** - At least 32 characters
3. **Rotate credentials** - Review periodically
4. **Monitor API usage** - Check Google API quota
5. **Use HTTPS only** - Both Render and Netlify provide HTTPS
6. **Enable DB authentication** - MongoDB has built-in auth
7. **Keep MongoDB user credentials safe** - Use password manager

---

## Troubleshooting Environment Variables

### Issue: "MONGO_URI is not set"
- Check Render environment variables page
- Ensure key is exactly `MONGO_URI` (case-sensitive)
- Verify value is complete and correct

### Issue: "Google API error"
- Check API key is enabled in Google Cloud Console
- Verify quota hasn't been exceeded
- Try regenerating the key

### Issue: "CORS error from frontend"
- Check ALLOWED_ORIGINS matches exactly
- Include protocol (`https://`)
- Check for trailing slashes

### Issue: "Invalid JWT token"
- Verify JWT_SECRET matches between deployment and local
- Check token expiration (1d default)
- Try logging out and back in

---

**All variables are now configured! Your app is production-ready. 🚀**
