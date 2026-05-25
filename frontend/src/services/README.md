# Service Layer & State Management Documentation

## Overview

The service layer handles all API communication, while the state management layer (Context API) handles global authentication state. Together, they provide a clean separation of concerns.

## 4-Part Architecture

```
┌─────────────────────────────────┐
│   API Service (api.js)          │
│   ├─ Axios configuration        │
│   ├─ Request interceptors       │
│   ├─ Response interceptors      │
│   └─ API methods                │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Utility Functions             │
│   ├─ Validation utilities       │
│   ├─ Token utilities            │
│   └─ Error handling             │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Custom Hooks                  │
│   ├─ useAuth()                  │
│   ├─ useAuthGuard()             │
│   └─ useForm()                  │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│   AuthContext (State)           │
│   ├─ Token state                │
│   ├─ User state                 │
│   └─ Auth methods               │
└─────────────────────────────────┘
```

## API Service (services/api.js)

### Configuration

```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Request Interceptor

Automatically attaches JWT token to all requests:

```javascript
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Feature:**
- Gets token from localStorage
- Adds to Authorization header as Bearer token
- Works for all subsequent API calls

### Response Interceptor

Handles errors, especially 401 (token expired):

```javascript
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)
```

**Features:**
- Detects 401 Unauthorized
- Clears token from localStorage
- Redirects to login page
- Auto-logout on expiration

## Authentication Service Methods

### 1. authService.register()

Register new user

```javascript
const response = await authService.register({
  username: 'john',
  email: 'john@example.com',
  password: 'password123'
})

// Returns: { token: "jwt...", user: { id, username, email } }
```

### 2. authService.login()

Login with email and password

```javascript
const response = await authService.login({
  email: 'john@example.com',
  password: 'password123'
})

// Returns: { token: "jwt...", user: { id, username, email } }
```

### 3. authService.logout()

Logout and blacklist token

```javascript
const response = await authService.logout()

// Returns: { success: true, message: "Logged out" }
```

### 4. authService.getMe()

Get current user profile

```javascript
const response = await authService.getMe()

// Returns: { user: { id, username, email } }
// Auto-includes: Authorization: Bearer {token}
```

## AuthContext & State Management

### Context Structure

```javascript
{
  // State
  token: "jwt...",              // JWT token
  user: {                       // Current user
    id: "user_id",
    username: "john",
    email: "john@example.com"
  },
  isLoading: false,             // Request loading state
  isInitialized: true,          // Context initialized
  isAuthenticated: true,        // Boolean convenience

  // Methods
  login(token),                 // Store token
  logout(),                     // Clear auth
  setCurrentUser(userData),     // Update user
  setIsLoading(boolean),        // Set loading state
}
```

### Usage

```javascript
import { useAuth } from './context/AuthContext'

function MyComponent() {
  const { token, user, login, logout, isAuthenticated } = useAuth()

  // Use auth state and methods
  if (!isAuthenticated) {
    return <div>Not logged in</div>
  }

  return <div>Welcome {user.username}</div>
}
```

### Initialization

On app load, AuthContext automatically:
1. Reads token from localStorage
2. Reads user data from localStorage
3. Sets both in state
4. Sets isInitialized to true

## Custom Hooks

### 1. useAuth()

Access authentication state

```javascript
const { token, user, login, logout } = useAuth()

// token: JWT string or null
// user: User object or null
// login(token): Store token
// logout(): Clear auth
```

### 2. useAuthGuard()

Protect page - redirect if not authenticated

```javascript
function ProtectedPage() {
  useAuthGuard() // Auto-redirects to login if no token

  return <div>Protected content</div>
}
```

### 3. useForm()

Manage form state, validation, errors

```javascript
const { formData, errors, handleChange, resetForm } = useForm({
  email: '',
  password: '',
})

// formData: { email: '...', password: '...' }
// errors: { email: 'error msg', password: '' }
// handleChange: Update formData
// resetForm: Clear all
```

## Utility Functions

### Validation Utilities (utils/validation.js)

```javascript
// Validate individual fields
validateEmail(email)                  // → error message or null
validatePassword(password)            // → error message or null
validateUsername(username)            // → error message or null
validatePasswordConfirmation(p, cp)   // → error message or null

// Validate entire forms
validateLoginForm({ email, password })        // → errors object
validateRegisterForm({ username, email, password, confirmPassword })

// Check errors
hasErrors(errorsObject)               // → boolean
```

### Token Utilities (utils/token.js)

```javascript
getToken()                    // Get token from localStorage
setToken(token)               // Store token
removeToken()                 // Delete token
hasValidToken()               // Check if token exists
getStoredUser()               // Get user from localStorage
setStoredUser(user)           // Store user
removeStoredUser()            // Delete user
clearAuthData()               // Clear all auth data
```

### Error Handling (services/api.js)

```javascript
import { getErrorMessage } from './services/api'

try {
  await authService.login(data)
} catch (error) {
  const message = getErrorMessage(error)
  // "Login failed" or specific API message
}
```

## Complete Login Flow

```javascript
import { useAuth } from './context/AuthContext'
import { authService, getErrorMessage } from './services/api'

function LoginPage() {
  const { login, setCurrentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Call API
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      })

      // 2. Extract token and user
      const { token, user } = response.data

      // 3. Update context
      login(token)              // Store token in localStorage & state
      setCurrentUser(user)      // Store user in localStorage & state

      // 4. Redirect
      navigate('/dashboard')
    } catch (err) {
      // Error handling
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form inputs */}
    </form>
  )
}
```

## Complete GetMe Flow

```javascript
import { useAuth } from './context/AuthContext'
import { authService } from './services/api'

function ProfilePage() {
  const { user: contextUser } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // API automatically includes Bearer token
        const response = await authService.getMe()
        setUser(response.data.user)
      } catch (error) {
        // 401 triggers auto-logout via interceptor
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
```

## File Structure

```
src/
├── services/
│   └── api.js                 # Axios + API methods
├── context/
│   └── AuthContext.jsx        # Global auth state
├── hooks/
│   ├── useAuthGuard.js        # Route protection
│   └── useForm.js             # Form management
├── utils/
│   ├── validation.js          # Form validation
│   ├── token.js               # Token management
│   └── errors.js              # Error handling
└── constants.js               # Constants & config
```

## Error Handling Strategy

```
API Call
  ↓
Success? → Return data ✅
  ↓
Error 401 (Unauthorized) → Auto-logout → Redirect to login ⚠️
  ↓
Error 400 (Bad Request) → Show user-friendly message ❌
  ↓
Error 500 (Server Error) → Show generic error ❌
  ↓
Network Error → Show connection error ❌
```

## Best Practices

1. **Always use authService** - Never make direct axios calls
2. **Check isAuthenticated** - Use context boolean, not just token
3. **Handle 401 gracefully** - Interceptor handles it automatically
4. **Validate before submit** - Use validation utilities
5. **Clear errors on input** - Better UX
6. **Use useAuthGuard** - Protect all pages that need auth
7. **Store sensitive data carefully** - Token in localStorage, not in state
8. **Handle loading states** - Always show feedback to user

## Migration Guide

### From Direct API to Service Layer

**Before:**
```javascript
const response = await axios.post(
  'http://localhost:3000/api/auth/login',
  data,
  { headers: { Authorization: `Bearer ${token}` } }
)
```

**After:**
```javascript
const response = await authService.login(data)
// Token automatically included! ✅
```

### From Manual Token Management to Context

**Before:**
```javascript
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))
// No automatic redirects ❌
```

**After:**
```javascript
login(token)
setCurrentUser(user)
// Auto-logout on 401 ✅
// Token always available via useAuth() ✅
```

## Troubleshooting

### Token not in requests
- Check localStorage has token
- Check Authorization header in Network tab
- Verify interceptor is running

### 401 errors not handled
- Check interceptor is attached
- Check window.location.href is working
- Check localStorage.removeToken() is called

### State not updating
- Ensure using useAuth() inside AuthProvider
- Check component is wrapped by provider
- Verify setters are called (login, logout, etc)

### Form not validating
- Import validation functions
- Call before submit
- Check hasErrors(errors) returns true/false

## Testing

```javascript
// Test login flow
test('login stores token and redirects', async () => {
  const { login } = useAuth()
  const response = await authService.login({ email, password })
  login(response.data.token)
  expect(localStorage.getItem('token')).toBe(response.data.token)
})

// Test protected route
test('unauthenticated user redirected', () => {
  // Clear token
  localStorage.removeItem('token')
  // Visit protected route
  // Should redirect to /auth/login
})
```

## Summary

- **Services** handle API communication
- **Context** manages global auth state
- **Hooks** provide convenient access
- **Utilities** handle validation and tokens
- **Interceptors** auto-attach tokens and handle 401

This architecture provides security, consistency, and maintainability! 🚀
