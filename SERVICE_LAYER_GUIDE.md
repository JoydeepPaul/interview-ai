# Service Layer & State Management - Complete Guide

## Overview

This document covers the complete service layer and state management architecture for the GenAI authentication system.

## Architecture Layers

```
┌──────────────────────────────────────────────────────────────────┐
│  Layer 1: PRESENTATION                                           │
│  Pages & Components (LoginPage, RegisterPage, etc)               │
│  Uses: Services & Context                                         │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  Layer 2: SERVICES (API Communication)                           │
│  services/api.js with Axios                                       │
│  Features:                                                        │
│  • Request interceptors (auto-token attachment)                  │
│  • Response interceptors (401 auto-logout)                       │
│  • API method helpers (login, register, getMe)                   │
│  • Error handling                                                 │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  Layer 3: STATE MANAGEMENT (Global State)                        │
│  context/AuthContext.jsx                                          │
│  Features:                                                        │
│  • Token storage & persistence                                   │
│  • User data storage                                             │
│  • Authentication methods (login, logout)                        │
│  • useAuth() hook for component access                           │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  Layer 4: UTILITIES (Helpers)                                    │
│  hooks/, utils/, constants/                                       │
│  Features:                                                        │
│  • Form validation (useForm, validation utils)                   │
│  • Token management utilities                                    │
│  • Route protection hook (useAuthGuard)                          │
│  • Constants & configuration                                     │
└──────────────────────────────────────────────────────────────────┘
```

## Service Layer (services/api.js)

### 1. Axios Configuration

```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

**Configuration Options:**
- `baseURL`: API server URL (configurable via env)
- `timeout`: Request timeout in milliseconds
- `headers`: Default headers for all requests

### 2. Request Interceptor (Auto-Token Attachment)

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
```

**What it does:**
1. Called BEFORE every API request
2. Retrieves token from localStorage
3. Attaches to Authorization header as Bearer token
4. All subsequent requests automatically include token

**Example:**
```javascript
// You write:
await authService.getMe()

// Axios sends:
GET /user/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 3. Response Interceptor (401 Handling)

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)
```

**What it does:**
1. Called AFTER every API response
2. Checks for 401 Unauthorized status
3. If 401: Clears token from localStorage
4. If 401: Redirects to login page
5. Other errors: Just rejects promise (caller handles)

**Benefits:**
- Automatic logout when token expires
- User redirected without manual intervention
- No stale tokens in app

### 4. Authentication Service Methods

```javascript
export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/user/me'),
}
```

#### Method Details

**register(data)**
- **Endpoint:** POST /auth/register
- **Input:** { username, email, password }
- **Output:** { token, user }
- **Usage:** New user signup

**login(data)**
- **Endpoint:** POST /auth/login
- **Input:** { email, password }
- **Output:** { token, user }
- **Usage:** User login

**logout()**
- **Endpoint:** POST /auth/logout
- **Input:** (none, token auto-attached)
- **Output:** { success, message }
- **Usage:** User logout, token blacklist

**getMe()**
- **Endpoint:** GET /user/me
- **Input:** (none, token auto-attached)
- **Output:** { user }
- **Usage:** Fetch current user profile

### 5. Error Handling Utility

```javascript
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.'
  }
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.'
  }
  return error.message || 'An unexpected error occurred'
}
```

**Usage:**
```javascript
try {
  await authService.login(data)
} catch (error) {
  const message = getErrorMessage(error)
  console.error(message)
}
```

## State Management (AuthContext)

### Context Structure

```javascript
interface AuthContextValue {
  // State
  token: string | null
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean

  // Methods
  login(token: string): void
  logout(): void
  setCurrentUser(user: User): void
  setIsLoading(loading: boolean): void
}
```

### Initialization

On app load, AuthContext:
1. Checks localStorage for token
2. Checks localStorage for user data
3. Restores both to state
4. Sets isInitialized to true

```javascript
useEffect(() => {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (storedToken) setToken(storedToken)
  if (storedUser) setUser(JSON.parse(storedUser))

  setIsInitialized(true)
}, [])
```

### Methods

**login(token)**
```javascript
const { login } = useAuth()
login('eyJhbGciOiJIUzI1NiIs...')
// Stores in state and localStorage
```

**logout()**
```javascript
const { logout } = useAuth()
logout()
// Clears token and user from both state and localStorage
```

**setCurrentUser(user)**
```javascript
const { setCurrentUser } = useAuth()
setCurrentUser({ id: '1', username: 'john', email: 'john@example.com' })
// Stores in state and localStorage
```

**setIsLoading(boolean)**
```javascript
const { setIsLoading } = useAuth()
setIsLoading(true)  // Show loading spinner
setIsLoading(false) // Hide loading spinner
```

### Usage Example

```javascript
import { useAuth } from './context/AuthContext'

function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <h1>Welcome {user.username}</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Custom Hooks

### useAuth()

**Purpose:** Access auth state and methods
**Usage:** Any component inside AuthProvider

```javascript
const {
  token,           // JWT token string
  user,            // User object
  isLoading,       // Loading state
  isAuthenticated, // Boolean convenience
  login,           // Store token
  logout,          // Clear auth
  setCurrentUser,  // Update user
} = useAuth()
```

**Example:**
```javascript
function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>Hello {user?.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### useAuthGuard()

**Purpose:** Protect routes - redirect if not authenticated
**Usage:** Call at top of protected page

```javascript
function ProfilePage() {
  useAuthGuard() // Auto-redirects to /auth/login if no token
  
  return <div>Your profile</div>
}
```

**How it works:**
```javascript
useEffect(() => {
  if (!token) {
    navigate('/auth/login', { replace: true })
  }
}, [token])
```

### useForm()

**Purpose:** Manage form state, validation, errors
**Usage:** Any form component

```javascript
const { formData, errors, handleChange, resetForm } = useForm({
  email: '',
  password: '',
})

return (
  <form>
    <input
      name="email"
      value={formData.email}
      onChange={handleChange}
    />
    {errors.email && <span>{errors.email}</span>}
  </form>
)
```

**Features:**
- Auto-updates formData on input change
- Clears errors when user types
- Tracks touched fields
- Provides resetForm method

## Utilities

### Validation (utils/validation.js)

```javascript
// Individual field validation
validateEmail(email)                  // → error string or null
validatePassword(password)            // → error string or null
validateUsername(username)            // → error string or null
validatePasswordConfirmation(p, cp)   // → error string or null

// Form validation
validateLoginForm({ email, password })
validateRegisterForm({ username, email, password, confirmPassword })

// Helper
hasErrors(errorObject)                // → true/false
```

**Example:**
```javascript
const errors = validateLoginForm(formData)
if (hasErrors(errors)) {
  setFormErrors(errors)
  return
}
// Form is valid, proceed to login
```

### Token Management (utils/token.js)

```javascript
// Get/Set
getToken()                    // → token string or null
setToken(token)               // Store in localStorage
removeToken()                 // Delete from localStorage

// Check
hasValidToken()               // → boolean

// User data
getStoredUser()               // → user object or null
setStoredUser(user)           // Store in localStorage
removeStoredUser()            // Delete from localStorage

// Clear all
clearAuthData()               // Remove token and user
```

### Constants (constants.js)

```javascript
API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 10000,
}

AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  GET_ME: '/user/me',
}

ERROR_MESSAGES = {
  NETWORK_ERROR: '...',
  TIMEOUT_ERROR: '...',
  AUTH_ERROR: '...',
  // etc
}

STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
}

ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
}
```

## Complete Login Flow

```
USER VISITS /auth/login
        ↓
LoginPage RENDERS
├─ FormInput (email)
├─ FormInput (password)
└─ Button (Sign In)
        ↓
USER ENTERS EMAIL & PASSWORD
├─ handleChange updates formData
├─ Errors clear on typing
└─ Validation shows errors
        ↓
USER CLICKS SIGN IN
├─ Validate form (validateLoginForm)
├─ Show errors if invalid
├─ Set loading = true
└─ Call authService.login(formData)
        ↓
API REQUEST
├─ POST /api/auth/login
├─ Request interceptor adds: Authorization: Bearer {token}
├─ Wait for response
└─ Handle errors or success
        ↓
API RESPONSE: { token, user }
        ↓
STORE IN CONTEXT
├─ login(token) → store in state & localStorage
├─ setCurrentUser(user) → store in state & localStorage
├─ Show success alert
└─ Set loading = false
        ↓
REDIRECT TO /dashboard
        ↓
ProtectedRoute checks: Is token present?
        ↓
YES → Render DashboardPage
NO → Redirect to /auth/login
        ↓
✅ USER IS AUTHENTICATED
```

## Complete GetMe Flow

```
USER ON /profile PAGE
        ↓
ProfilePage MOUNTS
├─ useEffect hook runs
├─ Calls authService.getMe()
└─ Sets loading = true
        ↓
API REQUEST
├─ GET /api/user/me
├─ Request interceptor auto-adds: Authorization: Bearer {token}
└─ Wait for response
        ↓
BACKEND
├─ Receives request
├─ Validates token
├─ Returns user data
└─ Response: { user: {...} }
        ↓
API RESPONSE: { user }
        ↓
DISPLAY DATA
├─ Update state with user data
├─ Set loading = false
└─ Render user info on page
        ↓
✅ USER PROFILE DISPLAYED
```

## 401 Error Flow

```
STALE TOKEN (expired at backend)
        ↓
USER MAKES API REQUEST
        ↓
REQUEST INTERCEPTOR
├─ Attaches old token: Authorization: Bearer {staleToken}
└─ Sends request
        ↓
BACKEND RESPONSE
├─ Validates token
├─ Token invalid/expired
└─ Returns: 401 Unauthorized
        ↓
RESPONSE INTERCEPTOR
├─ Detects: status === 401
├─ localStorage.removeToken()
├─ window.location.href = '/auth/login'
└─ Force page redirect
        ↓
USER REDIRECTED TO LOGIN
        ↓
✅ AUTOMATIC LOGOUT COMPLETE
```

## Integration with Pages

### LoginPage Integration

```javascript
import { useAuth } from '../context/AuthContext'
import { authService, getErrorMessage } from '../services/api'

function LoginPage() {
  const { login, setCurrentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(formData)
      login(response.data.token)
      setCurrentUser(response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return <form onSubmit={handleSubmit}>{/* form */}</form>
}
```

### RegisterPage Integration

```javascript
function RegisterPage() {
  const { login, setCurrentUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await authService.register(formData)
      login(response.data.token)
      setCurrentUser(response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return <form onSubmit={handleSubmit}>{/* form */}</form>
}
```

### ProfilePage Integration

```javascript
function ProfilePage() {
  const { logout } = useAuth()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getMe()
        setUser(response.data.user)
      } catch (err) {
        // 401 automatically handled by interceptor
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    logout()
    navigate('/auth/login')
  }

  return (
    <div>
      <h1>{user?.username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

## Best Practices

1. **Always use authService** - Never bypass to make direct API calls
2. **Check isAuthenticated** - Use context boolean, not just token presence
3. **Handle all errors** - Try/catch every API call
4. **Validate before submit** - Use validation utilities before API call
5. **Use useAuthGuard** - Protect all pages requiring auth
6. **Clear errors on input** - Better UX in forms
7. **Show loading states** - Feedback to user during requests
8. **Store token carefully** - localStorage is sufficient for this app

## File Structure

```
src/
├── services/
│   ├── api.js              # Axios instance, interceptors, auth methods
│   └── README.md           # Service documentation
├── context/
│   └── AuthContext.jsx     # Global auth state with useAuth hook
├── hooks/
│   ├── useAuthGuard.js     # Route protection hook
│   └── useForm.js          # Form state management hook
├── utils/
│   ├── validation.js       # Form validation functions
│   ├── token.js            # Token management utilities
│   └── errors.js           # Error handling (if needed)
└── constants.js            # API config, endpoints, routes
```

## Setup Steps

```bash
# 1. Run setup script
node setup-services.js

# 2. Install axios
npm install axios

# 3. Verify files created
# Check that all files exist in their locations

# 4. Test in app
# Use components as documented above
```

## Troubleshooting

**Issue:** Token not being sent with requests
- Check: localStorage has token
- Check: Interceptor is attached
- Check: Network tab shows Authorization header

**Issue:** 401 errors not redirecting
- Check: Interceptor response handler
- Check: window.location.href working
- Check: /auth/login route exists

**Issue:** User data not persisting
- Check: setCurrentUser is called
- Check: localStorage.user exists
- Check: JSON.parse not failing

**Issue:** Form errors not showing
- Check: validation function called
- Check: errors object updated
- Check: error JSX renders

## Summary

**Service Layer Benefits:**
- ✅ Centralized API calls
- ✅ Automatic token management
- ✅ Consistent error handling
- ✅ Single source of truth

**State Management Benefits:**
- ✅ Global auth state
- ✅ localStorage persistence
- ✅ Automatic 401 logout
- ✅ Easy component access via hooks

**Together they provide:**
- Secure authentication flow
- Clean separation of concerns
- Maintainable, testable code
- Consistent behavior across app
