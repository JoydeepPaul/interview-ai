# 🚀 Local Setup Guide - Interview AI Project

## Prerequisites

Before you start, make sure you have the following installed:

### Required Software
- ✅ **Node.js** (v16+ recommended) - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **Git** (optional, for version control)
- ✅ **MongoDB** (local or Atlas account)
- ✅ **Google GenAI API Key** - [Get API Key](https://ai.google.dev/)
- ✅ **Code Editor** (VS Code recommended)

### Check Installation
Open Command Prompt or PowerShell and run:
```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show 8.0.0 or higher
```

---

## Step 1: Create Environment Files

### Backend Environment (.env in root)

Create a file `C:\Users\JOYDEEP PAUL\Desktop\GenAI\.env` with:

```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-ai
# OR for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/interview-ai

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# Google GenAI
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here

# Server
PORT=3000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Allowed Origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Important:** Replace with your actual values:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A long random string (e.g., use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `GOOGLE_GENAI_API_KEY` - From [Google AI Studio](https://ai.google.dev/)

### Frontend Environment (frontend\.env.local)

Create a file `C:\Users\JOYDEEP PAUL\Desktop\GenAI\frontend\.env.local` with:

```
VITE_API_URL=http://localhost:3000/api
```

---

## Step 2: Install Backend Dependencies

```bash
# Navigate to project root
cd C:\Users\JOYDEEP PAUL\Desktop\GenAI

# Install dependencies
npm install
```

**What it does:**
- Installs Express, MongoDB, JWT, Google GenAI, CORS, and other dependencies
- Creates `node_modules` folder
- Generates `package-lock.json`

**Expected time:** 2-5 minutes

---

## Step 3: Install Frontend Dependencies

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Go back to root
cd ..
```

**What it does:**
- Installs React, Vite, Router, Axios, and other frontend packages
- Creates `node_modules` folder in frontend
- Generates `package-lock.json` in frontend

**Expected time:** 2-5 minutes

---

## Step 4: Prepare MongoDB

### Option A: MongoDB Atlas (Recommended for beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Add your IP to Network Access
6. Update `MONGODB_URI` in `.env` with your connection string

### Option B: Local MongoDB

1. Install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Install MongoDB as a service (during installation)
3. MongoDB runs on `mongodb://localhost:27017`
4. Set `MONGODB_URI=mongodb://localhost:27017/interview-ai` in `.env`

---

## Step 5: Get Google GenAI API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create new API key
4. Copy the key
5. Paste into `GOOGLE_GENAI_API_KEY` in `.env`

---

## Step 6: Start the Backend

### Terminal 1 (Backend)

```bash
# Navigate to project root
cd C:\Users\JOYDEEP PAUL\Desktop\GenAI

# Start backend
npm run dev
```

**Expected output:**
```
✓ Server is running on http://localhost:3000
✓ MongoDB connected
```

If you see errors:
- Check `.env` file exists
- Verify MongoDB connection string
- Verify Google GenAI API key
- Check port 3000 isn't in use

---

## Step 7: Start the Frontend

### Terminal 2 (Frontend)

```bash
# Navigate to frontend
cd C:\Users\JOYDEEP PAUL\Desktop\GenAI\frontend

# Start frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

---

## Step 8: Test the Application

1. Open browser: `http://localhost:5173`
2. You should see the login page
3. Click "Register" to create account
4. Fill in email and password
5. Click "Register" button
6. You'll be redirected to login
7. Login with your credentials
8. You should see the dashboard

---

## Step 9: Test Interview Feature

1. On dashboard, click "Start Interview"
2. Select:
   - **Topic:** JavaScript
   - **Difficulty:** Medium
   - **Questions:** 5
3. Click "Start Interview"
4. Answer the questions
5. Click "Submit" after each answer
6. See AI evaluation
7. View results and feedback

---

## Common Issues & Solutions

### Issue: MongoDB connection error

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
- Make sure MongoDB is running
- Check MongoDB Atlas connection string is correct
- Verify credentials in `.env`

### Issue: Google GenAI API key error

**Error:** `401 Unauthorized`

**Solution:**
- Verify API key is correct
- Check key is enabled in Google Cloud Console
- Ensure quota is not exceeded

### Issue: Port 3000 already in use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
- Check what's using port 3000: `netstat -ano | findstr :3000`
- Kill the process: `taskkill /PID <PID> /F`
- Or change PORT in `.env` to 3001

### Issue: Frontend can't connect to backend

**Error:** `NetworkError when attempting to fetch resource`

**Solution:**
- Verify backend is running on port 3000
- Check `VITE_API_URL` in `frontend/.env.local`
- Check CORS is enabled (should be in app.js)

### Issue: Blank page after login

**Error:** Dashboard shows but no content loads

**Solution:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Verify API endpoints are working
- Check MongoDB has data

---

## Development Workflow

### Running Both Simultaneously

**Terminal 1:**
```bash
cd C:\Users\JOYDEEP PAUL\Desktop\GenAI
npm run dev
```

**Terminal 2:**
```bash
cd C:\Users\JOYDEEP PAUL\Desktop\GenAI\frontend
npm run dev
```

**Result:**
- Backend runs on `http://localhost:3000`
- Frontend runs on `http://localhost:5173`
- Open frontend URL in browser

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend:** Changes auto-refresh browser
- **Backend:** Changes auto-restart server (using nodemon)

### Debugging

**Frontend Debugging:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Use Network tab to inspect API calls
4. Use React DevTools extension

**Backend Debugging:**
1. Check terminal output
2. Add `console.log()` statements
3. Use VS Code debugger
4. Check MongoDB queries with MongoDB Compass

---

## Project Structure

```
C:\Users\JOYDEEP PAUL\Desktop\GenAI\
├── src/                          # Backend code
│   ├── models/                   # Database models
│   ├── controllers/              # Business logic
│   ├── routes/                   # API routes
│   ├── app.js                    # Express app
│   └── server.js                 # Server entry
│
├── frontend/                     # Frontend code
│   ├── src/
│   │   ├── pages/               # React pages
│   │   ├── styles/              # CSS files
│   │   ├── context/             # Auth context
│   │   ├── services/            # API service
│   │   └── App.jsx              # Main app
│   └── vite.config.js           # Vite config
│
├── .env                         # Backend env
├── .env.local                   # Frontend env (in frontend/)
├── package.json                 # Backend dependencies
└── frontend/package.json        # Frontend dependencies
```

---

## Available npm Scripts

### Backend

```bash
npm run dev          # Start development with hot reload
npm start            # Start production server
npm run build        # Build for production (if needed)
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
```

---

## API Testing

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new collection
3. Add requests:

**Register:**
```
POST http://localhost:3000/api/auth/register
Body (JSON):
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login:**
```
POST http://localhost:3000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Start Interview:**
```
POST http://localhost:3000/api/interviews/start
Headers:
  Authorization: Bearer <your_token>
Body (JSON):
{
  "topic": "JavaScript",
  "difficulty": "Medium",
  "questionCount": 5
}
```

---

## Next Steps After Setup

1. ✅ Verify login/register works
2. ✅ Test interview creation
3. ✅ Submit answers and see AI evaluation
4. ✅ View results and analytics
5. ✅ Check all pages work correctly
6. ✅ Customize colors/styling if needed
7. ✅ Deploy when ready

---

## Customization Options

### Change App Name
- Update `VITE_APP_TITLE` in frontend/.env.local
- Update browser title in frontend/index.html

### Change Colors
- Edit `frontend/src/styles/*.css`
- Replace `#0A66C2` (primary blue) with your color
- Update other theme colors as needed

### Change Interview Questions
- Modify topics in `frontend/src/pages/InterviewStartPage.jsx`
- Add more difficulty levels
- Change question count options

---

## Deployment Checklist

Before deploying:
- [ ] Tested all features locally
- [ ] Set up production MongoDB
- [ ] Set up production Google GenAI account
- [ ] Created `.env` for production
- [ ] Built frontend: `npm run build`
- [ ] Tested production build locally
- [ ] Prepared hosting platforms
- [ ] Set up CI/CD if needed

---

## Need Help?

**Check These Files:**
- `FINAL_README.md` - Complete documentation
- `ARCHITECTURE_GUIDE.md` - System design
- `SERVICE_LAYER_GUIDE.md` - API details
- `DESIGN_SYSTEM.md` - Styling guide

**Common Checks:**
1. Is Node.js installed?
2. Is MongoDB running?
3. Is Google GenAI API key correct?
4. Are environment variables set?
5. Are both terminals running?

---

## Quick Start Summary

```bash
# 1. Clone/navigate to project
cd C:\Users\JOYDEEP PAUL\Desktop\GenAI

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend && npm install && cd ..

# 4. Create .env files (see Step 1)

# 5. Terminal 1 - Start backend
npm run dev

# 6. Terminal 2 - Start frontend
cd frontend && npm run dev

# 7. Open http://localhost:5173 in browser
```

---

**You're ready to go! 🚀**

Follow the steps above and your Interview AI platform will be running locally.

Good luck! 💻
