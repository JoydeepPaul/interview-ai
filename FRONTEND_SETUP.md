# Frontend Setup Instructions

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

## Setup Steps

### 1. Create Frontend Files
Run the setup script to create all frontend files:
```bash
node setup-frontend.js
```

This will create the complete Vite React frontend structure in the `frontend/` directory.

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Frontend Features

### 📱 Pages

#### AuthPage
- **Login**: Authenticate with email and password
- **Register**: Create new account with username, email, and password
- Token stored in localStorage
- Auto-redirect to profile page on successful auth

#### ProfilePage
- **GetMe API Integration**: Fetches current user profile from `/api/user/me`
- **Displays**: Username, email, user ID
- **Logout**: Clears token and returns to login

### 🔌 API Proxy

Vite is configured to proxy API requests:
- `http://localhost:5173/api/*` → `http://localhost:3000/api/*`

No need to worry about CORS - all API calls automatically route to the backend.

### 🎨 Styling

- **Responsive Design**: Works on mobile and desktop
- **Modern UI**: Clean, minimal aesthetic
- **CSS Modules**: Organized styles per component
- **Error States**: User-friendly error messages
- **Loading States**: Visual feedback during requests

## Environment Variables

Create a `.env` file in the `frontend/` directory:
```
VITE_API_URL=http://localhost:3000/api
```

Reference: `.env.example`

## Backend Requirements

Ensure your backend is running on `http://localhost:3000` with these endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/me` - Get current user (requires Bearer token)
- `POST /api/auth/logout` - User logout

## Project Structure

```
frontend/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── .env.example            # Environment variables template
├── .gitignore
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main component with routing
    ├── App.css
    ├── index.css           # Global styles
    ├── pages/
    │   ├── AuthPage.jsx    # Login/Register form
    │   └── ProfilePage.jsx # User profile display
    └── styles/
        ├── AuthPage.css
        └── ProfilePage.css
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running on port 3000
- Check that proxy is correctly configured in `vite.config.js`
- Verify CORS headers from backend

### Token Issues
- Check browser's LocalStorage (DevTools → Application → Local Storage)
- Ensure token is being set after login
- Clear localStorage if experiencing persistent issues

### Port Already in Use
If port 5173 is in use, modify `vite.config.js`:
```javascript
server: {
  port: 3001,  // Change to desired port
}
```

## Development Tips

1. **Hot Module Replacement (HMR)**: Changes are instantly reflected without page reload
2. **Fast Refresh**: React component changes update without losing state
3. **DevTools**: React DevTools browser extension recommended
4. **Network Tab**: Monitor API calls and responses in browser DevTools

## Next Steps

After running the frontend:
1. Register a new account
2. Login with your credentials
3. View your profile via GetMe API
4. Logout to test authentication flow
