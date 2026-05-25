import { createContext, useState, useContext, useEffect, useCallback } from 'react'

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
    loading: !isInitialized, // For useEffect dependencies
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
