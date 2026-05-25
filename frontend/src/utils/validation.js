/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
    return `Password must be at least ${minLength} characters`
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
