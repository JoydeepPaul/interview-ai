# GenAI Frontend - Complete Overview

## 4-Layer Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: PRESENTATION LAYER                                    │
│  Pages that users interact with                                 │
│  (LoginPage, RegisterPage, DashboardPage, ProfilePage)         │
│  └─ Shows UI, collects input, displays errors/messages          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: COMPONENT LAYER                                       │
│  Reusable UI components                                         │
│  (FormInput, Button, Alert, Layouts, ProtectedRoute)           │
│  └─ No business logic, fully reusable, highly configurable      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: SERVICE LAYER                                         │
│  API communication & business logic                             │
│  (services/api.js with Axios interceptors)                     │
│  └─ HTTP requests, token attachment, error handling             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: STATE MANAGEMENT LAYER                                │
│  Global application state                                       │
│  (AuthContext - token, user, login, logout)                    │
│  └─ Persistent storage, context API, useAuth hook               │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
GenAI/
├── src/
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login/     (LoginPage.jsx, LoginPage.css)
│   │   │   └── Register/  (RegisterPage.jsx, RegisterPage.css)
│   │   ├── Dashboard/     (DashboardPage.jsx, DashboardPage.css)
│   │   └── Profile/       (ProfilePage.jsx, ProfilePage.css)
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.jsx/css    (Protected pages layout)
│   │   │   └── AuthLayout.jsx/css    (Auth pages layout)
│   │   ├── Common/
│   │   │   ├── Button.jsx/css        (Reusable button)
│   │   │   └── Alert.jsx/css         (Alert messages)
│   │   ├── Form/
│   │   │   └── FormInput.jsx/css     (Form input field)
│   │   └── ProtectedRoute/
│   │       └── ProtectedRoute.jsx    (Route guard)
│   │
│   ├── context/
│   │   └── AuthContext.jsx           (Global auth state)
│   │
│   ├── services/
│   │   └── api.js                    (Axios + API calls)
│   │
│   ├── hooks/
│   │   └── useAuthGuard.js           (Auth hook)
│   │
│   ├── styles/
│   │   └── App.css                   (Global styles)
│   │
│   ├── App.jsx                       (Router config)
│   └── main.jsx                      (React entry)
│
└── package.json, vite.config.js, index.html
```

## Routes & Navigation

```
PUBLIC ROUTES (No Authentication Required)
├─ /auth/login       → LoginPage (email + password form)
│                      Features: Demo credentials, validation
│
└─ /auth/register    → RegisterPage (signup form)
                       Features: Demo data generator, validation

PROTECTED ROUTES (Authentication Required)
├─ /dashboard        → DashboardPage (main landing)
│                      Features: User welcome, quick links
│
└─ /profile          → ProfilePage (GetMe API)
                       Features: User info, logout button

DEFAULT ROUTES
├─ /                 → Redirects to /dashboard
└─ *                 → Redirects to /dashboard
```

## Data Flow

### Authentication Flow

```
1. USER VISITS /auth/login
   ↓
2. LoginPage RENDERS
   ├─ FormInput (email)
   ├─ FormInput (password)
   ├─ Button (Sign In)
   └─ Button (Demo Credentials)
   ↓
3. USER ENTERS CREDENTIALS
   ├─ Input value → formData state
   ├─ On change → validate & show errors
   └─ Demo button → auto-fill form
   ↓
4. USER CLICKS SIGN IN
   ├─ Validate form
   ├─ Show errors if invalid
   ├─ Show loading spinner on button
   └─ Call authService.login(email, password)
   ↓
5. API CALL (axios)
   ├─ POST /api/auth/login
   ├─ Auto-attach: Authorization: Bearer {token}
   └─ Handle 401/errors with auto-logout
   ↓
6. BACKEND RESPONSE
   ├─ { token: "jwt...", user: {...} }
   └─ Or error { message: "Invalid credentials" }
   ↓
7. UPDATE CONTEXT (AuthContext)
   ├─ login(token) → Store in localStorage & state
   ├─ setCurrentUser(user) → Store user data
   └─ Show success alert
   ↓
8. REDIRECT TO /dashboard
   └─ setTimeout(navigate, 1000)
   ↓
9. PROTECTED ROUTE CHECK
   ├─ ProtectedRoute sees token ✅
   ├─ Renders MainLayout
   └─ Renders DashboardPage
   ↓
✅ USER IS AUTHENTICATED
```

### Protected Route Access

```
USER NAVIGATES TO /profile
   ↓
ROUTE CHECKS: Is user authenticated?
   ├─ ProtectedRoute component
   ├─ useAuth() → Get token from context
   └─ Check: token exists?
   ↓
   ├─ YES: Render ProfilePage
   │        ├─ useEffect → fetch /api/user/me
   │        ├─ Axios auto-includes: Authorization header
   │        ├─ Display user data
   │        └─ Show logout button
   │
   └─ NO: <Navigate to="/auth/login" />
          └─ Redirect to login
```

## Component Communication

### Props & State Flow

```
LoginPage (Parent)
├─ State: formData, errors, loading, alert
├─ Children:
│  ├─ FormInput (Props: label, type, value, onChange, error, icon)
│  ├─ Button (Props: loading, disabled, onClick)
│  └─ Alert (Props: type, message, onClose)
└─ Calls: authService.login(), useAuth().login()
```

### Context Usage

```
AuthContext (Global)
├─ token: JWT string
├─ user: { id, username, email }
├─ isLoading: boolean
├─ login(token): function
├─ logout(): function
└─ setCurrentUser(user): function

Consumed by:
├─ ProtectedRoute (check token)
├─ ProfilePage (display user)
├─ DashboardPage (display user)
├─ api.js (auto-attach token)
└─ Any component using useAuth()
```

## Key Features

### Authentication
- ✅ JWT-based authentication
- ✅ Token persisted in localStorage
- ✅ Automatic token attachment to requests
- ✅ Auto-logout on token expiration (401)
- ✅ Blacklist on logout

### Forms
- ✅ Real-time validation
- ✅ Error display
- ✅ Loading states
- ✅ Demo credentials
- ✅ Form auto-fill

### UI/UX
- ✅ Modern gradient design (purple theme)
- ✅ Smooth animations
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Emoji icons
- ✅ Success/error alerts
- ✅ Loading spinners

### Security
- ✅ Protected routes
- ✅ Token auto-logout
- ✅ Secure API calls
- ✅ CORS handled

## Styling

### Color Scheme
```
Primary:    #667eea (purple)
Secondary:  #764ba2 (dark purple)
Success:    #4caf50 (green)
Error:      #f44336 (red)
Text:       #333 (dark)
Border:     #e0e0e0 (light)
```

### Layouts
```
Login/Register:  Two-column (side panel + form card)
Mobile:         Single column (no side panel)
Dashboard/Profile: Full width with navbar
```

### Animations
```
Entry:   Slide up (0.3s)
Alerts:  Slide down (0.3s)
Loading: Spin (0.8s)
Hover:   Transform + shadow
Focus:   Border + shadow
```

## API Endpoints

```
POST   /api/auth/register
       Body: { username, email, password }
       Response: { token, user: { id, username, email } }

POST   /api/auth/login
       Body: { email, password }
       Response: { token, user: { id, username, email } }

POST   /api/auth/logout
       Response: { success: true, message: "..." }

GET    /api/user/me (Protected)
       Headers: Authorization: Bearer {token}
       Response: { success: true, user: { id, username, email } }
```

## Development Workflow

### Setup
```bash
1. node setup-router.js          # Create router structure
2. node setup-ui.js               # Create UI components
3. cd frontend
4. npm install react-router-dom
5. npm run dev
```

### Running
```bash
1. Backend:  node src/server.js  (port 3000)
2. Frontend: npm run dev         (port 5173)
3. Visit:    http://localhost:5173
```

### Testing Flow
```
1. Login page → Click "Use Demo Credentials"
2. Form auto-fills → Click "Sign In"
3. On success → Redirect to /dashboard
4. Go to /profile → See GetMe API data
5. Click "Logout" → Redirect to /login
6. Try accessing /profile → Redirect to /login (protected)
```

## Best Practices Used

1. **Separation of Concerns**
   - Each layer independent
   - Single responsibility
   - Easy to test & maintain

2. **Component Reusability**
   - FormInput, Button, Alert reused everywhere
   - No duplicate code
   - Consistent styling

3. **State Management**
   - Global auth state (context)
   - Local form state (useState)
   - localStorage persistence

4. **Error Handling**
   - Form validation errors
   - API error messages
   - User-friendly alerts
   - Auto-logout on 401

5. **Performance**
   - Lazy validation
   - Efficient re-renders
   - CSS animations (GPU accelerated)
   - No unnecessary API calls

6. **Security**
   - Token in localStorage
   - Bearer token in headers
   - Auto-logout on expiration
   - Protected routes

7. **Accessibility**
   - Labels for inputs
   - Focus states
   - Error messages
   - Keyboard navigation

8. **Responsive Design**
   - Mobile-first approach
   - Breakpoints at 768px, 1024px
   - Touch-friendly buttons
   - Proper spacing

## File Summary

### Core Files
- `App.jsx` - Router configuration
- `main.jsx` - React entry point
- `context/AuthContext.jsx` - Global auth state
- `services/api.js` - API communication

### Page Files
- `pages/Auth/Login/LoginPage.jsx` - Login page
- `pages/Auth/Register/RegisterPage.jsx` - Register page
- `pages/Dashboard/DashboardPage.jsx` - Dashboard
- `pages/Profile/ProfilePage.jsx` - Profile (GetMe API)

### Component Files
- `components/Form/FormInput.jsx` - Input field
- `components/Common/Button.jsx` - Button
- `components/Common/Alert.jsx` - Alert
- `components/Layout/MainLayout.jsx` - Main layout
- `components/Layout/AuthLayout.jsx` - Auth layout
- `components/ProtectedRoute/ProtectedRoute.jsx` - Route guard

### Setup Scripts
- `setup-router.js` - Create router structure
- `setup-ui.js` - Create UI components

### Documentation
- `ARCHITECTURE_GUIDE.md` - This document
- `AUTH_STYLING_GUIDE.md` - Form styling details
- `ROUTER_SETUP_GUIDE.md` - Router setup
- `UI_SETUP_GUIDE.md` - UI setup
- `FRONTEND_SETUP.md` - Initial frontend setup

## Quick Reference

### Add New Page
```jsx
// 1. Create file: src/pages/NewPage/NewPage.jsx
// 2. Add to App.jsx routes
<Route path="/new-page" element={<NewPage />} />
```

### Add API Endpoint
```javascript
// 1. Update services/api.js
export const newService = {
  call: (data) => apiClient.post('/endpoint', data)
}
// 2. Use in component
const response = await newService.call(data)
```

### Add Button Variant
```css
/* Update components/Common/Button.css */
.btn-custom {
  background: #color;
  color: #text;
}
```

### Customize Colors
```css
/* Update all CSS files */
Primary: #667eea → #yourcolor
Secondary: #764ba2 → #yourcolor
```

## Troubleshooting

### Issue: Token not persisting
**Solution:** Check localStorage in DevTools, verify token is returned from API

### Issue: Routes not loading
**Solution:** Ensure react-router-dom installed, check route paths

### Issue: API calls failing
**Solution:** Check backend running on 3000, verify proxy in vite.config.js

### Issue: Styles not applying
**Solution:** Check CSS file imported, verify class names match

## Deployment

### Build for Production
```bash
npm run build    # Creates dist/ folder
```

### Serve Production Build
```bash
npm run preview  # Preview production build locally
```

### Deploy to Server
```bash
# Copy dist/ contents to web server
# Or use Netlify, Vercel, etc.
```

## Next Steps

1. ✅ Run setup scripts
2. ✅ Install dependencies
3. ✅ Test authentication flow
4. ✅ Customize colors/styling
5. ✅ Add more pages/features
6. ✅ Build for production
7. ✅ Deploy!

---

**Status:** ✅ Complete
- 4-layer architecture ✅
- Form styling ✅
- Authentication flow ✅
- Protected routes ✅
- Responsive design ✅
- Demo credentials ✅
