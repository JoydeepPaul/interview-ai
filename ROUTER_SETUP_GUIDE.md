# React Router Setup Guide

## Overview
This setup creates a production-ready React + React Router application with authentication, protected routes, and proper folder structure.

## Execution

Run the setup script to create all files:
```bash
node setup-router.js
```

Then install React Router dependency:
```bash
cd frontend
npm install react-router-dom
npm run dev
```

## Folder Structure

```
frontend/src/
├── pages/                          # Page components
│   ├── Auth/
│   │   ├── Login/
│   │   │   ├── LoginPage.jsx       # Login form
│   │   │   └── LoginPage.css
│   │   └── Register/
│   │       ├── RegisterPage.jsx    # Registration form
│   │       └── RegisterPage.css
│   ├── Dashboard/
│   │   ├── DashboardPage.jsx       # Main dashboard
│   │   └── DashboardPage.css
│   └── Profile/
│       ├── ProfilePage.jsx         # User profile (GetMe API)
│       └── ProfilePage.css
│
├── components/                     # Reusable components
│   ├── Layout/
│   │   ├── MainLayout.jsx          # Layout for protected pages
│   │   ├── MainLayout.css
│   │   ├── AuthLayout.jsx          # Layout for auth pages
│   │   └── AuthLayout.css
│   └── ProtectedRoute/
│       └── ProtectedRoute.jsx      # Route guard component
│
├── context/                        # React Context
│   └── AuthContext.jsx             # Global auth state
│
├── hooks/                          # Custom hooks
│   └── useAuthGuard.js             # Auth protection hook
│
├── services/                       # API services
│   └── api.js                      # Axios instance + API calls
│
├── styles/                         # Global styles
│   └── App.css                     # Global styles
│
├── utils/                          # Utility functions
│
├── App.jsx                         # Router configuration
├── main.jsx                        # React entry point
└── index.css                       # Base styles
```

## Application Flow

### 1. Authentication Routes (Public)
```
/auth/login      → LoginPage
                  • Email + Password input
                  • Calls POST /api/auth/login
                  • Stores JWT in localStorage
                  • Redirects to /dashboard on success

/auth/register   → RegisterPage
                  • Username + Email + Password
                  • Password confirmation
                  • Calls POST /api/auth/register
                  • Auto-logs in user
                  • Redirects to /dashboard
```

### 2. Protected Routes (Authenticated Users Only)
```
/dashboard       → DashboardPage
                  • Shows welcome message
                  • Quick links to features
                  • Requires valid token

/profile         → ProfilePage
                  • Calls GET /api/user/me
                  • Displays user info
                  • Logout button
                  • Requires valid token
```

### 3. Route Protection
```
ProtectedRoute Component:
├─ Checks if token exists in context
├─ If NO token → Redirect to /auth/login
└─ If YES token → Render protected page

Automatic 401 Handling:
├─ Axios interceptor detects 401 responses
├─ Clears token from localStorage
└─ Redirects to /auth/login
```

## Architecture

### AuthContext (Global State)
```javascript
{
  token,              // JWT token
  user,               // Current user object
  login(),            // Set token in state & localStorage
  logout(),           // Clear token & user
  setCurrentUser(),   // Update user info
  isLoading,          // Loading state
  setIsLoading()      // Set loading
}
```

### API Service (Axios)
```javascript
// Automatic features:
✓ Base URL: http://localhost:3000/api
✓ Automatic Bearer token in headers
✓ Request/response interceptors
✓ Auto-logout on 401 (expired token)

Usage:
authService.register(data)   // POST /auth/register
authService.login(data)      // POST /auth/login
authService.logout()         // POST /auth/logout
authService.getMe()          // GET /user/me
```

## Route Configuration (App.jsx)

```javascript
Routes:
├─ /auth/login          (AuthLayout → LoginPage)
├─ /auth/register       (AuthLayout → RegisterPage)
├─ /dashboard           (ProtectedRoute → MainLayout → DashboardPage)
├─ /profile             (ProtectedRoute → MainLayout → ProfilePage)
├─ /                    (Redirect to /dashboard)
└─ *                    (Redirect to /dashboard or login)
```

## Authentication Flow Diagram

```
┌─────────────────┐
│   User Visits   │
│   /auth/login   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  LoginPage Component                │
│  ├─ Email input                     │
│  ├─ Password input                  │
│  └─ Submit button                   │
└────────┬────────────────────────────┘
         │
         ▼ (Click Submit)
┌─────────────────────────────────────┐
│  API Call: POST /api/auth/login     │
│  Body: { email, password }          │
└────────┬────────────────────────────┘
         │
         ▼ (Success)
┌─────────────────────────────────────┐
│  Response: { token, user }          │
│  ├─ Store token in localStorage     │
│  ├─ Update AuthContext              │
│  └─ Redirect to /dashboard          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  User Accesses /profile             │
│  ├─ ProtectedRoute checks token     │
│  ├─ Token exists → Allow access     │
│  └─ ProfilePage renders             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  ProfilePage Component              │
│  ├─ useEffect → fetch /api/user/me  │
│  ├─ Axios adds Authorization header │
│  └─ Display user data               │
└─────────────────────────────────────┘
```

## Key Components

### 1. AuthContext.jsx
- Provides global auth state
- Wraps entire app
- Access via `useAuth()` hook

```javascript
const { token, user, login, logout } = useAuth()
```

### 2. ProtectedRoute.jsx
- Wraps protected pages
- Redirects if no token
- Works with React Router v6

```javascript
<ProtectedRoute>
  <MainLayout />
</ProtectedRoute>
```

### 3. MainLayout.jsx
- Navbar + main content area
- Used for protected pages
- Contains Outlet for child routes

### 4. AuthLayout.jsx
- Centered auth card layout
- Used for login/register pages
- Gradient background

### 5. API Service (api.js)
- Axios instance with interceptors
- Automatic token attachment
- Centralized API calls

```javascript
// Every request automatically includes:
Authorization: Bearer {token}
```

## Styling

### Color Scheme
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Accent: `#f44336` (Red)
- Text: `#333` (Dark Gray)
- Borders: `#e0e0e0` (Light Gray)

### Responsive Design
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Form Validation

### Login Page
- Email required
- Password required

### Register Page
- Username (min 3 characters)
- Email required
- Password (min 6 characters)
- Confirm password matches

## Error Handling

- Form validation with user-friendly messages
- API error display in alert boxes
- Automatic 401 token expiration handling
- Loading states to prevent duplicate submissions
- Try-catch blocks for async operations

## Development Features

- Hot Module Replacement (HMR)
- React Fast Refresh
- Axios auto-token inclusion
- Centralized error handling
- Global state management
- TypeScript ready (optional)

## To Add More Pages

1. Create page component: `src/pages/NewPage/NewPage.jsx`
2. Create styles: `src/pages/NewPage/NewPage.css`
3. Add route to `App.jsx`:
   ```javascript
   // Public route
   <Route path="/new-page" element={<NewPageComponent />} />
   
   // Protected route
   <Route
     path="/protected-page"
     element={
       <ProtectedRoute>
         <MainLayout />
       </ProtectedRoute>
     }
   >
     <Route path="" element={<NewPageComponent />} />
   </Route>
   ```

## To Add More API Endpoints

Update `src/services/api.js`:
```javascript
export const newService = {
  getAll: () => apiClient.get('/new-endpoint'),
  getOne: (id) => apiClient.get(`/new-endpoint/${id}`),
  create: (data) => apiClient.post('/new-endpoint', data),
  update: (id, data) => apiClient.put(`/new-endpoint/${id}`, data),
  delete: (id) => apiClient.delete(`/new-endpoint/${id}`),
}
```

## Troubleshooting

### 1. Token Not Persisting
- Check localStorage in DevTools
- Verify token is set after login
- Check API response includes token field

### 2. Routes Not Working
- Ensure React Router v6 installed
- Check route paths match exactly
- Verify ProtectedRoute wrapped correctly

### 3. API Requests Failing
- Check backend running on port 3000
- Verify proxy in vite.config.js
- Check CORS headers
- Review API endpoint paths

### 4. Logout Not Working
- Verify logout button calls `logout()` from context
- Check localStorage is cleared
- Verify redirect happens

## Next Steps

1. ✅ Run `node setup-router.js`
2. ✅ Run `cd frontend && npm install react-router-dom`
3. ✅ Run `npm run dev`
4. ✅ Test login/register
5. ✅ Test protected routes
6. ✅ Test logout
7. ✅ Build for production: `npm run build`
