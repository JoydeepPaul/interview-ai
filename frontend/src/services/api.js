import axios from 'axios'

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
      config.headers.Authorization = `Bearer ${token}`
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
