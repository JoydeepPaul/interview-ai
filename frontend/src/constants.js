/**
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
