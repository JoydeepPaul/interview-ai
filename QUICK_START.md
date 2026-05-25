# 🚀 QUICK START - 5 MINUTES SETUP

## What You Have

✅ Complete backend code  
✅ Complete frontend code  
✅ Automated setup scripts  
✅ Full documentation  

---

## 3-Step Quick Setup

### Step 1: Run Setup (2 minutes)

**Double-click:** `setup.bat`

This will:
- ✅ Check Node.js installation
- ✅ Create environment files
- ✅ Install all dependencies (npm)
- ✅ Create startup scripts

### Step 2: Get Credentials (1 minute)

**Double-click:** `get-credentials.bat`

This will guide you to get:
- MongoDB connection string
- Google GenAI API key

Then **edit .env** with your credentials

### Step 3: Run the App (2 minutes)

**Terminal 1 - Double-click:** `start-backend.bat`  
Wait for: `✓ Server is running on http://localhost:3000`

**Terminal 2 - Double-click:** `start-frontend.bat`  
Wait for: `Local: http://localhost:5173/`

**Open browser:** http://localhost:5173

---

## Test It Works

1. **Register** - Create an account
2. **Login** - Use your credentials
3. **Start Interview** - Click "Start Interview"
4. **Answer Questions** - Get AI evaluation
5. **View Results** - See your score and feedback

---

## File Guide

| File | Purpose | What to Do |
|------|---------|-----------|
| `setup.bat` | Automated setup | Run first (double-click) |
| `get-credentials.bat` | Get your API keys | Run before editing .env |
| `configure.bat` | Edit .env file | Run after getting credentials |
| `start-backend.bat` | Start backend | Keep running in Terminal 1 |
| `start-frontend.bat` | Start frontend | Keep running in Terminal 2 |
| `.env` | Backend config | Edit with credentials |
| `frontend\.env.local` | Frontend config | Auto-created |

---

## Credentials Needed

### MongoDB (Free)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### Google GenAI (Free)
1. Go to: https://ai.google.dev/
2. Click "Get API Key"
3. Copy key
4. Update `GOOGLE_GENAI_API_KEY` in `.env`

### JWT Secret (Auto-generated)
- Already created in `.env`
- Change to random string if needed

---

## Troubleshooting

**Problem: Node.js not found**
- Install from https://nodejs.org/
- Restart your computer
- Run setup.bat again

**Problem: Can't connect to MongoDB**
- Check connection string in `.env`
- Verify MongoDB credentials
- Check your IP is whitelisted on MongoDB Atlas

**Problem: Google API error**
- Verify API key in `.env`
- Check at: https://ai.google.dev/
- Ensure key is enabled

**Problem: Port 3000 already in use**
- Close other programs using port 3000
- Or change PORT in `.env` to 3001, 3002, etc.

**Problem: Can't find .env file**
- Run `setup.bat` first
- It creates .env automatically

---

## After Setup

✅ Both servers running  
✅ Logged in successfully  
✅ Interview working  
✅ AI evaluation working  

### Next Options

- **Customize** - Edit colors in `frontend/src/styles/`
- **Add Features** - Check `ARCHITECTURE_GUIDE.md`
- **Deploy** - See `FINAL_README.md`
- **Explore Code** - Check `PROJECT_FILES_INDEX.md`

---

## Keep Both Terminals Open

```
┌─────────────────────┬─────────────────────┐
│   Terminal 1        │   Terminal 2        │
├─────────────────────┼─────────────────────┤
│ start-backend.bat   │ start-frontend.bat  │
│ Backend: 3000       │ Frontend: 5173      │
│ Keep running ✓      │ Keep running ✓      │
└─────────────────────┴─────────────────────┘
       Browser: http://localhost:5173
```

---

## Important Commands

**Stop Backend:** Press `Ctrl+C` in Terminal 1  
**Stop Frontend:** Press `Ctrl+C` in Terminal 2  
**Restart:** Close terminals and re-run .bat files  
**Edit Config:** Double-click `configure.bat`  

---

## What Each File Does

### Backend Files
- `src/models/` - Database schemas
- `src/controllers/` - Business logic
- `src/routes/` - API endpoints
- `src/app.js` - Express server

### Frontend Files
- `frontend/src/pages/` - React pages
- `frontend/src/styles/` - CSS styling
- `frontend/src/services/` - API calls
- `frontend/src/App.jsx` - Router

### Configuration
- `.env` - Backend secrets
- `frontend/.env.local` - Frontend config
- `package.json` - Dependencies

---

## Default Credentials (After Setup)

**Backend:** http://localhost:3000  
**Frontend:** http://localhost:5173  
**Database:** MongoDB Atlas (your connection)  
**API Key:** Google GenAI (your key)  

---

## Need Help?

**Setup Issues:**
- Check `LOCAL_SETUP_GUIDE.md`
- Read error messages carefully

**Features:**
- Check `FINAL_README.md`
- See `ARCHITECTURE_GUIDE.md`

**API:**
- See `SERVICE_LAYER_GUIDE.md`
- Test with `get-credentials.bat`

**Code:**
- Check `PROJECT_FILES_INDEX.md`
- Review source files

---

## Summary

```
1. Run setup.bat
2. Run get-credentials.bat
3. Get MongoDB & Google keys
4. Edit .env with credentials
5. Run start-backend.bat
6. Run start-frontend.bat
7. Open http://localhost:5173
8. Register and login
9. Start using Interview AI
```

**Total time: ~5 minutes ⏱️**

---

**You're all set! Happy coding! 🎉**

Questions? Check the documentation files or refer to LOCAL_SETUP_GUIDE.md for detailed steps.
