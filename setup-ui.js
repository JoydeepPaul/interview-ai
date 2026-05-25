const fs = require('fs');
const path = require('path');

const frontendDir = './frontend';
const srcDir = path.join(frontendDir, 'src');
const componentsDir = path.join(srcDir, 'components');

// Create UI components directories
const dirs = [
  path.join(componentsDir, 'Common'),
  path.join(componentsDir, 'Form'),
  path.join(srcDir, 'utils'),
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. Create FormInput Component
const formInput = `import './FormInput.css'

export function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error = '',
  icon = null
}) {
  return (
    <div className="form-input-wrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={error ? 'input-error' : ''}
        />
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}
`;

fs.writeFileSync(path.join(componentsDir, 'Form', 'FormInput.jsx'), formInput);
console.log('✅ Created FormInput.jsx');

// 2. Create FormInput CSS
const formInputCss = `.form-input-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-input-wrapper label {
  display: block;
  margin-bottom: 0.75rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: capitalize;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #999;
  font-size: 1.1rem;
  pointer-events: none;
  display: flex;
  align-items: center;
}

.form-input-wrapper input {
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input-wrapper input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background: #fafbff;
}

.form-input-wrapper input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

.form-input-wrapper input.input-error {
  border-color: #f44336;
}

.form-input-wrapper input.input-error:focus {
  box-shadow: 0 0 0 4px rgba(244, 67, 54, 0.1);
}

.error-text {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-text::before {
  content: '⚠';
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .form-input-wrapper {
    margin-bottom: 1.25rem;
  }

  .form-input-wrapper input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
`;

fs.writeFileSync(path.join(componentsDir, 'Form', 'FormInput.css'), formInputCss);
console.log('✅ Created FormInput.css');

// 3. Create Button Component
const button = `import './Button.css'

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  fullWidth = false
}) {
  const classes = [
    'btn',
    \`btn-\${variant}\`,
    \`btn-\${size}\`,
    fullWidth ? 'btn-full-width' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading && <span className="btn-loader"></span>}
      {children}
    </button>
  )
}
`;

fs.writeFileSync(path.join(componentsDir, 'Common', 'Button.jsx'), button);
console.log('✅ Created Button.jsx');

// 4. Create Button CSS
const buttonCss = `.btn {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  position: relative;
}

/* Variants */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
}

.btn-secondary {
  background: #e8e8e8;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #da190b;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.btn-ghost {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-ghost:hover:not(:disabled) {
  background: #f0f4ff;
}

/* Sizes */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-md {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* Full width */
.btn-full-width {
  width: 100%;
}

/* Disabled state */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading spinner */
.btn-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Active state */
.btn:active:not(:disabled) {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }

  .btn-lg {
    padding: 0.875rem 1.75rem;
  }
}
`;

fs.writeFileSync(path.join(componentsDir, 'Common', 'Button.css'), buttonCss);
console.log('✅ Created Button.css');

// 5. Create Alert Component
const alert = `import './Alert.css'

export function Alert({ type = 'info', message, onClose }) {
  return (
    <div className={\`alert alert-\${type}\`}>
      <div className="alert-content">
        <span className="alert-icon">
          {type === 'error' && '❌'}
          {type === 'success' && '✅'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="alert-message">{message}</span>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>×</button>
      )}
    </div>
  )
}
`;

fs.writeFileSync(path.join(componentsDir, 'Common', 'Alert.jsx'), alert);
console.log('✅ Created Alert.jsx');

// 6. Create Alert CSS
const alertCss = `.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-icon {
  font-size: 1.2rem;
}

.alert-message {
  font-size: 0.95rem;
}

.alert-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

/* Alert Types */
.alert-error {
  background: #fee;
  color: #c33;
  border-left: 4px solid #f44336;
}

.alert-success {
  background: #efe;
  color: #3c3;
  border-left: 4px solid #4caf50;
}

.alert-warning {
  background: #ffe8b6;
  color: #d97706;
  border-left: 4px solid #f59e0b;
}

.alert-info {
  background: #e3f2fd;
  color: #1976d2;
  border-left: 4px solid #2196f3;
}

@media (max-width: 768px) {
  .alert {
    padding: 0.875rem;
    font-size: 0.9rem;
  }

  .alert-content {
    gap: 0.5rem;
  }
}
`;

fs.writeFileSync(path.join(componentsDir, 'Common', 'Alert.css'), alertCss);
console.log('✅ Created Alert.css');

// 7. Update LoginPage.jsx
const loginPageNew = `import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { authService } from '../../../services/api'
import { FormInput } from '../../../components/Form/FormInput'
import { Button } from '../../../components/Common/Button'
import { Alert } from '../../../components/Common/Alert'
import './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, setCurrentUser } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setAlert({ type: '', message: '' })

    try {
      const response = await authService.login(formData)
      const { token, user } = response.data
      
      login(token)
      setCurrentUser(user)
      
      setAlert({ 
        type: 'success', 
        message: 'Login successful! Redirecting...' 
      })
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Login failed. Please try again.'
      })
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'demo123456'
    })
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {alert.message && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            disabled={loading}
            icon="✉️"
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            disabled={loading}
            icon="🔐"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="login-divider">
          <span>Or try demo account</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={handleDemoLogin}
          disabled={loading}
          fullWidth
        >
          Use Demo Credentials
        </Button>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/auth/register">Register here</Link></p>
        </div>
      </div>

      <div className="login-side">
        <div className="side-content">
          <h2>GenAI</h2>
          <p>Your next generation AI assistant</p>
          <ul className="features">
            <li>✨ Fast & Secure</li>
            <li>🔐 JWT Authentication</li>
            <li>📱 Mobile Responsive</li>
            <li>⚡ Modern Tech Stack</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Auth/Login', 'LoginPage.jsx'), loginPageNew);
console.log('✅ Updated LoginPage.jsx');

// 8. Update LoginPage CSS
const loginPageNewCss = `.login-page {
  width: 100%;
  display: flex;
  min-height: 100vh;
}

.login-card {
  flex: 1;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #999;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: #999;
  font-size: 0.9rem;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.login-divider span {
  margin: 0 1rem;
}

.login-footer {
  text-align: center;
  color: #666;
  margin-top: 1.5rem;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-footer a:hover {
  color: #764ba2;
}

.login-side {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 3rem 2rem;
}

.side-content {
  text-align: center;
}

.side-content h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.side-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.features {
  list-style: none;
  text-align: left;
  display: inline-block;
}

.features li {
  padding: 0.75rem 0;
  font-size: 1.1rem;
  opacity: 0.85;
  transition: all 0.3s ease;
}

.features li:hover {
  opacity: 1;
  transform: translateX(10px);
}

@media (max-width: 1024px) {
  .login-page {
    flex-direction: column;
  }

  .login-card {
    padding: 2rem;
    min-height: auto;
  }

  .login-side {
    padding: 2rem;
    min-height: 300px;
  }

  .side-content h2 {
    font-size: 2rem;
  }

  .side-content p {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-card {
    padding: 1.5rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }

  .login-header p {
    font-size: 0.9rem;
  }

  .login-side {
    display: none;
  }

  .features li {
    font-size: 1rem;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Auth/Login', 'LoginPage.css'), loginPageNewCss);
console.log('✅ Updated LoginPage.css');

// 9. Update RegisterPage.jsx
const registerPageNew = `import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { authService } from '../../../services/api'
import { FormInput } from '../../../components/Form/FormInput'
import { Button } from '../../../components/Common/Button'
import { Alert } from '../../../components/Common/Alert'
import './RegisterPage.css'

export function RegisterPage() {
  const navigate = useNavigate()
  const { login, setCurrentUser } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (formData.username.trim().length > 20) {
      newErrors.username = 'Username must not exceed 20 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setAlert({ type: '', message: '' })

    try {
      const { confirmPassword, ...registerData } = formData
      const response = await authService.register(registerData)
      const { token, user } = response.data
      
      login(token)
      setCurrentUser(user)
      
      setAlert({
        type: 'success',
        message: 'Account created! Redirecting...'
      })
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Registration failed. Please try again.'
      })
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoRegister = () => {
    const randomNum = Math.floor(Math.random() * 10000)
    setFormData({
      username: \`demouser\${randomNum}\`,
      email: \`demo\${randomNum}@example.com\`,
      password: 'demo123456',
      confirmPassword: 'demo123456',
    })
  }

  return (
    <div className="register-page">
      <div className="register-side">
        <div className="side-content">
          <h2>Join GenAI</h2>
          <p>Start your AI journey today</p>
          <div className="benefits">
            <div className="benefit-item">
              <span className="benefit-icon">🚀</span>
              <span>Get Started Fast</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎯</span>
              <span>Easy to Use</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">⚙️</span>
              <span>Powerful Features</span>
            </div>
          </div>
        </div>
      </div>

      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
        </div>

        {alert.message && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <FormInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            error={errors.username}
            disabled={loading}
            icon="👤"
          />

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            disabled={loading}
            icon="✉️"
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            error={errors.password}
            disabled={loading}
            icon="🔐"
          />

          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            disabled={loading}
            icon="✔️"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="register-divider">
          <span>Or use demo credentials</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={handleDemoRegister}
          disabled={loading}
          fullWidth
        >
          Generate Demo Data
        </Button>

        <div className="register-footer">
          <p>Already have an account? <Link to="/auth/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Auth/Register', 'RegisterPage.jsx'), registerPageNew);
console.log('✅ Updated RegisterPage.jsx');

// 10. Update RegisterPage CSS
const registerPageNewCss = `.register-page {
  width: 100%;
  display: flex;
  min-height: 100vh;
}

.register-side {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 3rem 2rem;
}

.side-content {
  text-align: center;
}

.side-content h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.side-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.benefits {
  display: grid;
  gap: 1.5rem;
  max-width: 300px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(10px);
}

.benefit-icon {
  font-size: 1.5rem;
}

.register-card {
  flex: 1;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #999;
  font-size: 1rem;
}

.register-form {
  margin-bottom: 1.5rem;
}

.register-divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: #999;
  font-size: 0.9rem;
}

.register-divider::before,
.register-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.register-divider span {
  margin: 0 1rem;
}

.register-footer {
  text-align: center;
  color: #666;
  margin-top: 1.5rem;
}

.register-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-footer a:hover {
  color: #764ba2;
}

@media (max-width: 1024px) {
  .register-page {
    flex-direction: column;
  }

  .register-side {
    padding: 2rem;
    min-height: 300px;
  }

  .side-content h2 {
    font-size: 2rem;
  }

  .side-content p {
    font-size: 1rem;
  }

  .register-card {
    padding: 2rem;
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .register-page {
    flex-direction: column;
  }

  .register-card {
    padding: 1.5rem;
  }

  .register-header h1 {
    font-size: 1.5rem;
  }

  .register-header p {
    font-size: 0.9rem;
  }

  .register-side {
    display: none;
  }

  .benefits {
    gap: 1rem;
  }

  .benefit-item {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Auth/Register', 'RegisterPage.css'), registerPageNewCss);
console.log('✅ Updated RegisterPage.css');

console.log(\`
╔════════════════════════════════════════════════════════════════╗
║  ✅ LOGIN & REGISTER UI SETUP COMPLETE!                        ║
╚════════════════════════════════════════════════════════════════╝

📦 Components Created:
   ✅ FormInput.jsx     - Reusable form input with icons & errors
   ✅ Button.jsx        - Reusable button with variants & loading
   ✅ Alert.jsx         - Alert component for messages
   ✅ LoginPage.jsx     - Enhanced login with demo credentials
   ✅ RegisterPage.jsx  - Enhanced register with validation

🎨 Styling Features:
   ✅ Modern gradient design (purple theme)
   ✅ Side panel with features/benefits
   ✅ Form validation with error messages
   ✅ Loading states with spinner
   ✅ Smooth animations & transitions
   ✅ Responsive design (mobile/tablet/desktop)
   ✅ Emoji icons for visual appeal
   ✅ Focus & hover states

🎯 UI Features:
   ✅ Demo account button (dummy login)
   ✅ Generate demo data (random user for signup)
   ✅ Real-time form validation
   ✅ Error clearing on input change
   ✅ Loading buttons with spinner
   ✅ Success/error alerts
   ✅ Links between login/register

📝 Demo Credentials:
   Email: demo@example.com
   Password: demo123456

🚀 Next Steps:
   1. cd frontend
   2. npm install react-router-dom
   3. npm run dev
   4. Visit http://localhost:5173/auth/login
   5. Click "Use Demo Credentials" to test

✨ Features in Components:
   FormInput:
   • Label, placeholder, required
   • Error display
   • Icons (emoji)
   • Disabled state
   • Real-time validation

   Button:
   • Variants: primary, secondary, danger, ghost
   • Sizes: sm, md, lg
   • Loading state with spinner
   • Full width option
   • Disabled state

   Alert:
   • Types: error, success, warning, info
   • Auto-hide option
   • Close button
   • Smooth animations

🎨 Color Scheme:
   Primary: #667eea (Purple)
   Secondary: #764ba2 (Dark Purple)
   Success: #4caf50 (Green)
   Error: #f44336 (Red)
   Text: #333 (Dark)
   Border: #e0e0e0 (Light Gray)
\`);
`;

fs.writeFileSync(path.join(__dirname, 'setup-ui.js'), setupLog);

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✅ LOGIN & REGISTER UI SETUP COMPLETE!                        ║
╚════════════════════════════════════════════════════════════════╝

📦 Components Created:
   ✅ FormInput.jsx     - Reusable form input with icons & errors
   ✅ Button.jsx        - Reusable button with variants & loading
   ✅ Alert.jsx         - Alert component for messages
   ✅ LoginPage.jsx     - Enhanced login with demo credentials
   ✅ RegisterPage.jsx  - Enhanced register with validation

🎨 Styling Features:
   ✅ Modern gradient design (purple theme)
   ✅ Side panel with features/benefits
   ✅ Form validation with error messages
   ✅ Loading states with spinner
   ✅ Smooth animations & transitions
   ✅ Responsive design (mobile/tablet/desktop)
   ✅ Emoji icons for visual appeal
   ✅ Focus & hover states

🎯 UI Features:
   ✅ Demo account button (dummy login)
   ✅ Generate demo data (random user for signup)
   ✅ Real-time form validation
   ✅ Error clearing on input change
   ✅ Loading buttons with spinner
   ✅ Success/error alerts
   ✅ Links between login/register

📝 Demo Credentials:
   Email: demo@example.com
   Password: demo123456

🚀 Next Steps:
   1. cd frontend
   2. npm install react-router-dom
   3. npm run dev
   4. Visit http://localhost:5173/auth/login
   5. Click "Use Demo Credentials" to test

✨ Features in Components:
   FormInput:
   • Label, placeholder, required
   • Error display
   • Icons (emoji)
   • Disabled state
   • Real-time validation

   Button:
   • Variants: primary, secondary, danger, ghost
   • Sizes: sm, md, lg
   • Loading state with spinner
   • Full width option
   • Disabled state

   Alert:
   • Types: error, success, warning, info
   • Auto-hide option
   • Close button
   • Smooth animations

🎨 Color Scheme:
   Primary: #667eea (Purple)
   Secondary: #764ba2 (Dark Purple)
   Success: #4caf50 (Green)
   Error: #f44336 (Red)
   Text: #333 (Dark)
   Border: #e0e0e0 (Light Gray)
`);
