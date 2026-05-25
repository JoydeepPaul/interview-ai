const fs = require('fs');
const path = require('path');

const frontendDir = './frontend';
const srcDir = path.join(frontendDir, 'src');

// Create directories
const servicesDir = path.join(srcDir, 'services');
const contextDir = path.join(srcDir, 'context');
const hooksDir = path.join(srcDir, 'hooks');
const utilsDir = path.join(srcDir, 'utils');

[servicesDir, contextDir, hooksDir, utilsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. Create api.js - Axios configuration and API calls
const apiJs = `import axios from 'axios'

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

/**
 * RESPONSE INTERCEPTOR
 * Handles 401 errors (token expired) and other API errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Success response - just return it
    return response
  },
  (error) => {
    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401) {
      console.log('Token expired or invalid - logging out')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login
      window.location.href = '/auth/login'
    }

    // Handle other errors
    if (error.response?.status === 400) {
      console.error('Bad request:', error.response.data)
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  }
)

/**
 * AUTHENTICATION SERVICE
 * All auth-related API calls
 */
export const authService = {
  /**
   * Register new user
   * @param {Object} data - { username, email, password }
   * @returns {Promise<Object>} - { token, user }
   */
  register: (data) => {
    return apiClient.post('/auth/register', data)
  },

  /**
   * Login user
   * @param {Object} data - { email, password }
   * @returns {Promise<Object>} - { token, user }
   */
  login: (data) => {
    return apiClient.post('/auth/login', data)
  },

  /**
   * Logout user
   * @returns {Promise<Object>} - { success, message }
   */
  logout: () => {
    return apiClient.post('/auth/logout')
  },

  /**
   * Get current user profile (GetMe API)
   * @returns {Promise<Object>} - { user }
   */
  getMe: () => {
    return apiClient.get('/user/me')
  },
}

/**
 * USER SERVICE
 * All user-related API calls (can be extended)
 */
export const userService = {
  /**
   * Update user profile
   * @param {Object} data - Updated user data
   * @returns {Promise<Object>}
   */
  updateProfile: (data) => {
    return apiClient.put('/user/profile', data)
  },

  /**
   * Change password
   * @param {Object} data - { oldPassword, newPassword }
   * @returns {Promise<Object>}
   */
  changePassword: (data) => {
    return apiClient.post('/user/change-password', data)
  },

  /**
   * Delete account
   * @returns {Promise<Object>}
   */
  deleteAccount: () => {
    return apiClient.delete('/user/account')
  },
}

/**
 * Error handling utility
 * Extracts error message from API response
 */
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

export default apiClient
`;

fs.writeFileSync(path.join(servicesDir, 'api.js'), apiJs);
console.log('✅ Created services/api.js');

// 2. Create AuthContext.jsx - Global state management
const authContextJs = `import { createContext, useState, useContext, useEffect, useCallback } from 'react'

/**
 * AuthContext - Global authentication state
 * Stores token, user data, and provides auth methods
 */
const AuthContext = createContext(null)

/**
 * AuthProvider Component
 * Wraps entire app to provide auth state to all components
 */
export function AuthProvider({ children }) {
  // State variables
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  /**
   * Initialize auth state from localStorage on app load
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken) {
          setToken(storedToken)
        }

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch (e) {
            console.error('Failed to parse stored user:', e)
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  /**
   * Login - Store token and user in context and localStorage
   * @param {string} authToken - JWT token from API
   */
  const login = useCallback((authToken) => {
    setToken(authToken)
    localStorage.setItem('token', authToken)
  }, [])

  /**
   * Logout - Clear token and user from context and localStorage
   */
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  /**
   * Set current user data
   * @param {Object} userData - User object from API
   */
  const setCurrentUser = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = Boolean(token)

  /**
   * Context value object
   */
  const value = {
    // State
    token,
    user,
    isLoading,
    isInitialized,
    isAuthenticated,

    // Methods
    login,
    logout,
    setCurrentUser,
    setIsLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 * Use this hook in any component to access auth state and methods
 * Example: const { token, user, login, logout } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export default AuthContext
`;

fs.writeFileSync(path.join(contextDir, 'AuthContext.jsx'), authContextJs);
console.log('✅ Created context/AuthContext.jsx');

// 3. Create useAuthGuard.js hook
const useAuthGuardJs = `import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

/**
 * useAuthGuard Hook
 * Automatically redirect to login if not authenticated
 * Use in protected pages to ensure user is logged in
 *
 * Example:
 * function ProtectedPage() {
 *   useAuthGuard()
 *   return <div>Protected content</div>
 * }
 */
export function useAuthGuard() {
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/auth/login', { replace: true })
    }
  }, [token, navigate])

  return token
}

export default useAuthGuard
`;

fs.writeFileSync(path.join(hooksDir, 'useAuthGuard.js'), useAuthGuardJs);
console.log('✅ Created hooks/useAuthGuard.js');

// 4. Create useForm.js custom hook
const useFormJs = `import { useState, useCallback } from 'react'

/**
 * useForm Hook
 * Manages form state, validation, and error handling
 *
 * Usage:
 * const { formData, errors, handleChange, resetForm, setErrors } = useForm({
 *   email: '',
 *   password: '',
 * })
 */
export function useForm(initialValues = {}) {
  const [formData, setFormData] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }

    // Mark as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))
  }, [errors])

  /**
   * Handle blur - mark field as touched
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))
  }, [])

  /**
   * Set form errors
   */
  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors)
  }, [])

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setFormData(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  /**
   * Set form data programmatically
   */
  const setFormData_ = useCallback((data) => {
    setFormData(data)
  }, [])

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    setErrors: setFormErrors,
    resetForm,
    setFormData: setFormData_,
  }
}

export default useForm
`;

fs.writeFileSync(path.join(hooksDir, 'useForm.js'), useFormJs);
console.log('✅ Created hooks/useForm.js');

// 5. Create validation utilities
const validationJs = `/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/

/**
 * Validate email
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export function validateEmail(email) {
  if (!email.trim()) {
    return 'Email is required'
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

/**
 * Validate password
 * @param {string} password
 * @param {number} minLength
 * @returns {string|null} Error message or null if valid
 */
export function validatePassword(password, minLength = 6) {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < minLength) {
    return \`Password must be at least \${minLength} characters\`
  }
  return null
}

/**
 * Validate username
 * @param {string} username
 * @returns {string|null} Error message or null if valid
 */
export function validateUsername(username) {
  if (!username.trim()) {
    return 'Username is required'
  }
  if (username.trim().length < 3) {
    return 'Username must be at least 3 characters'
  }
  if (username.trim().length > 20) {
    return 'Username must not exceed 20 characters'
  }
  return null
}

/**
 * Validate password confirmation
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string|null} Error message or null if valid
 */
export function validatePasswordConfirmation(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Please confirm your password'
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return null
}

/**
 * Validate login form
 * @param {Object} data - { email, password }
 * @returns {Object} Errors object
 */
export function validateLoginForm(data) {
  const errors = {}

  const emailError = validateEmail(data.email || '')
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(data.password || '')
  if (passwordError) errors.password = passwordError

  return errors
}

/**
 * Validate register form
 * @param {Object} data - { username, email, password, confirmPassword }
 * @returns {Object} Errors object
 */
export function validateRegisterForm(data) {
  const errors = {}

  const usernameError = validateUsername(data.username || '')
  if (usernameError) errors.username = usernameError

  const emailError = validateEmail(data.email || '')
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(data.password || '')
  if (passwordError) errors.password = passwordError

  const confirmError = validatePasswordConfirmation(
    data.password || '',
    data.confirmPassword || ''
  )
  if (confirmError) errors.confirmPassword = confirmError

  return errors
}

/**
 * Check if form has any errors
 * @param {Object} errors
 * @returns {boolean}
 */
export function hasErrors(errors) {
  return Object.values(errors).some(error => error !== '' && error !== null)
}

export default {
  EMAIL_REGEX,
  validateEmail,
  validatePassword,
  validateUsername,
  validatePasswordConfirmation,
  validateLoginForm,
  validateRegisterForm,
  hasErrors,
}
`;

fs.writeFileSync(path.join(utilsDir, 'validation.js'), validationJs);
console.log('✅ Created utils/validation.js');

// 6. Create token utilities
const tokenJs = `/**
 * Get token from localStorage
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem('token')
}

/**
 * Set token in localStorage
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem('token', token)
}

/**
 * Remove token from localStorage
 */
export function removeToken() {
  localStorage.removeItem('token')
}

/**
 * Check if token exists and is valid
 * @returns {boolean}
 */
export function hasValidToken() {
  const token = getToken()
  return Boolean(token)
}

/**
 * Get user from localStorage
 * @returns {Object|null}
 */
export function getStoredUser() {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (e) {
    console.error('Failed to parse stored user:', e)
    return null
  }
}

/**
 * Set user in localStorage
 * @param {Object} user
 */
export function setStoredUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Remove user from localStorage
 */
export function removeStoredUser() {
  localStorage.removeItem('user')
}

/**
 * Clear all auth data
 */
export function clearAuthData() {
  removeToken()
  removeStoredUser()
}

export default {
  getToken,
  setToken,
  removeToken,
  hasValidToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  clearAuthData,
}
`;

fs.writeFileSync(path.join(utilsDir, 'token.js'), tokenJs);
console.log('✅ Created utils/token.js');

// 7. Create constants
const constantsJs = `/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
}

/**
 * Authentication endpoints
 */
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  GET_ME: '/user/me',
}

/**
 * User endpoints
 */
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  DELETE_ACCOUNT: '/user/account',
}

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_EXISTS: 'This email is already registered.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
}

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
}

/**
 * Route paths
 */
export const ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  HOME: '/',
}

export default {
  API_CONFIG,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
}
`;

fs.writeFileSync(path.join(srcDir, 'constants.js'), constantsJs);
console.log('✅ Created constants.js');

// 8. Create comprehensive documentation
const servicesReadme = `# Service Layer & State Management Documentation

## Overview

The service layer handles all API communication, while the state management layer (Context API) handles global authentication state. Together, they provide a clean separation of concerns.

## 4-Part Architecture

\`\`\`
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
\`\`\`

## API Service (services/api.js)

### Configuration

\`\`\`javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
\`\`\`

### Request Interceptor

Automatically attaches JWT token to all requests:

\`\`\`javascript
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})
\`\`\`

**Feature:**
- Gets token from localStorage
- Adds to Authorization header as Bearer token
- Works for all subsequent API calls

### Response Interceptor

Handles errors, especially 401 (token expired):

\`\`\`javascript
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
\`\`\`

**Features:**
- Detects 401 Unauthorized
- Clears token from localStorage
- Redirects to login page
- Auto-logout on expiration

## Authentication Service Methods

### 1. authService.register()

Register new user

\`\`\`javascript
const response = await authService.register({
  username: 'john',
  email: 'john@example.com',
  password: 'password123'
})

// Returns: { token: "jwt...", user: { id, username, email } }
\`\`\`

### 2. authService.login()

Login with email and password

\`\`\`javascript
const response = await authService.login({
  email: 'john@example.com',
  password: 'password123'
})

// Returns: { token: "jwt...", user: { id, username, email } }
\`\`\`

### 3. authService.logout()

Logout and blacklist token

\`\`\`javascript
const response = await authService.logout()

// Returns: { success: true, message: "Logged out" }
\`\`\`

### 4. authService.getMe()

Get current user profile

\`\`\`javascript
const response = await authService.getMe()

// Returns: { user: { id, username, email } }
// Auto-includes: Authorization: Bearer {token}
\`\`\`

## AuthContext & State Management

### Context Structure

\`\`\`javascript
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
\`\`\`

### Usage

\`\`\`javascript
import { useAuth } from './context/AuthContext'

function MyComponent() {
  const { token, user, login, logout, isAuthenticated } = useAuth()

  // Use auth state and methods
  if (!isAuthenticated) {
    return <div>Not logged in</div>
  }

  return <div>Welcome {user.username}</div>
}
\`\`\`

### Initialization

On app load, AuthContext automatically:
1. Reads token from localStorage
2. Reads user data from localStorage
3. Sets both in state
4. Sets isInitialized to true

## Custom Hooks

### 1. useAuth()

Access authentication state

\`\`\`javascript
const { token, user, login, logout } = useAuth()

// token: JWT string or null
// user: User object or null
// login(token): Store token
// logout(): Clear auth
\`\`\`

### 2. useAuthGuard()

Protect page - redirect if not authenticated

\`\`\`javascript
function ProtectedPage() {
  useAuthGuard() // Auto-redirects to login if no token

  return <div>Protected content</div>
}
\`\`\`

### 3. useForm()

Manage form state, validation, errors

\`\`\`javascript
const { formData, errors, handleChange, resetForm } = useForm({
  email: '',
  password: '',
})

// formData: { email: '...', password: '...' }
// errors: { email: 'error msg', password: '' }
// handleChange: Update formData
// resetForm: Clear all
\`\`\`

## Utility Functions

### Validation Utilities (utils/validation.js)

\`\`\`javascript
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
\`\`\`

### Token Utilities (utils/token.js)

\`\`\`javascript
getToken()                    // Get token from localStorage
setToken(token)               // Store token
removeToken()                 // Delete token
hasValidToken()               // Check if token exists
getStoredUser()               // Get user from localStorage
setStoredUser(user)           // Store user
removeStoredUser()            // Delete user
clearAuthData()               // Clear all auth data
\`\`\`

### Error Handling (services/api.js)

\`\`\`javascript
import { getErrorMessage } from './services/api'

try {
  await authService.login(data)
} catch (error) {
  const message = getErrorMessage(error)
  // "Login failed" or specific API message
}
\`\`\`

## Complete Login Flow

\`\`\`javascript
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
\`\`\`

## Complete GetMe Flow

\`\`\`javascript
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
\`\`\`

## File Structure

\`\`\`
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
\`\`\`

## Error Handling Strategy

\`\`\`
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
\`\`\`

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
\`\`\`javascript
const response = await axios.post(
  'http://localhost:3000/api/auth/login',
  data,
  { headers: { Authorization: \`Bearer \${token}\` } }
)
\`\`\`

**After:**
\`\`\`javascript
const response = await authService.login(data)
// Token automatically included! ✅
\`\`\`

### From Manual Token Management to Context

**Before:**
\`\`\`javascript
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))
// No automatic redirects ❌
\`\`\`

**After:**
\`\`\`javascript
login(token)
setCurrentUser(user)
// Auto-logout on 401 ✅
// Token always available via useAuth() ✅
\`\`\`

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

\`\`\`javascript
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
\`\`\`

## Summary

- **Services** handle API communication
- **Context** manages global auth state
- **Hooks** provide convenient access
- **Utilities** handle validation and tokens
- **Interceptors** auto-attach tokens and handle 401

This architecture provides security, consistency, and maintainability! 🚀
`;

fs.writeFileSync(path.join(servicesDir, 'README.md'), servicesReadme);
console.log('✅ Created services/README.md');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✅ SERVICE LAYER & STATE MANAGEMENT SETUP COMPLETE!           ║
╚════════════════════════════════════════════════════════════════╝

📦 Files Created:

SERVICE LAYER:
  ✅ services/api.js
     ├─ Axios instance
     ├─ Request interceptors (auto-token)
     ├─ Response interceptors (401 handling)
     ├─ authService methods
     └─ userService methods (extensible)

STATE MANAGEMENT:
  ✅ context/AuthContext.jsx
     ├─ Global auth state
     ├─ Token management
     ├─ User data storage
     ├─ Login/logout methods
     └─ useAuth() hook

CUSTOM HOOKS:
  ✅ hooks/useAuthGuard.js (Route protection)
  ✅ hooks/useForm.js (Form state management)

UTILITIES:
  ✅ utils/validation.js (Form validation)
  ✅ utils/token.js (Token management)
  ✅ constants.js (Configuration)

DOCUMENTATION:
  ✅ services/README.md (Complete guide)

🔌 API Methods:
  • authService.register()
  • authService.login()
  • authService.logout()
  • authService.getMe()
  • userService.updateProfile()
  • userService.changePassword()
  • userService.deleteAccount()

🎯 Key Features:
  ✅ Automatic token attachment to requests
  ✅ Auto-logout on 401 (token expired)
  ✅ Global state management with Context API
  ✅ Comprehensive validation utilities
  ✅ localStorage persistence
  ✅ Error handling & messages
  ✅ Loading state management
  ✅ Protected route hook

🚀 Usage Examples:

LOGIN:
  const { login, setCurrentUser } = useAuth()
  const response = await authService.login(data)
  login(response.data.token)
  setCurrentUser(response.data.user)

PROTECT PAGE:
  function ProtectedPage() {
    useAuthGuard()
    return <div>Protected</div>
  }

GET USER:
  const response = await authService.getMe()
  // Bearer token auto-included!

VALIDATE FORM:
  const errors = validateLoginForm(formData)
  if (hasErrors(errors)) return

✨ Architecture:
  Layer 1: Components (FormInput, Button, Alert)
  Layer 2: Pages (LoginPage, DashboardPage)
  Layer 3: Services (api.js, axios, interceptors)
  Layer 4: State (AuthContext, global state)

📁 Next Steps:
  1. Run setup-router.js & setup-ui.js (if not done)
  2. cd frontend && npm install axios
  3. npm run dev
  4. Test login flow
  5. Check Network tab for Bearer token

💡 Files Location:
  src/services/api.js
  src/context/AuthContext.jsx
  src/hooks/useAuthGuard.js
  src/hooks/useForm.js
  src/utils/validation.js
  src/utils/token.js
  src/constants.js
`);
