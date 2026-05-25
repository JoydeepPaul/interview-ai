/**
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
