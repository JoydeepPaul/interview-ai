const fs = require('fs');
const path = require('path');

const frontendDir = './frontend';
const srcDir = path.join(frontendDir, 'src');

// Create all directories
const directories = [
  srcDir,
  path.join(srcDir, 'pages'),
  path.join(srcDir, 'components'),
  path.join(srcDir, 'components/Layout'),
  path.join(srcDir, 'components/ProtectedRoute'),
  path.join(srcDir, 'hooks'),
  path.join(srcDir, 'context'),
  path.join(srcDir, 'utils'),
  path.join(srcDir, 'styles'),
  path.join(srcDir, 'services'),
  path.join(srcDir, 'pages/Auth'),
  path.join(srcDir, 'pages/Auth/Login'),
  path.join(srcDir, 'pages/Auth/Register'),
  path.join(srcDir, 'pages/Dashboard'),
  path.join(srcDir, 'pages/Profile'),
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
});

// Update package.json
const packageJson = {
  "name": "frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.3"
  }
};

fs.writeFileSync(path.join(frontendDir, 'package.json'), JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json with React Router');

// Create context/AuthContext.jsx
const authContext = `import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const login = (authToken) => {
    localStorage.setItem('token', authToken)
    setToken(authToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const setCurrentUser = (userData) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ token, user, setCurrentUser, login, logout, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
`;

fs.writeFileSync(path.join(srcDir, 'context', 'AuthContext.jsx'), authContext);
console.log('✅ Created AuthContext.jsx');

// Create hooks/useAuthGuard.js
const useAuthGuard = `import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

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
`;

fs.writeFileSync(path.join(srcDir, 'hooks', 'useAuthGuard.js'), useAuthGuard);
console.log('✅ Created useAuthGuard.js');

// Create services/api.js
const api = `import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle responses
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

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/user/me'),
}

export default apiClient
`;

fs.writeFileSync(path.join(srcDir, 'services', 'api.js'), api);
console.log('✅ Created api.js');

// Create components/ProtectedRoute/ProtectedRoute.jsx
const protectedRoute = `import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}
`;

fs.writeFileSync(path.join(srcDir, 'components/ProtectedRoute', 'ProtectedRoute.jsx'), protectedRoute);
console.log('✅ Created ProtectedRoute.jsx');

// Create components/Layout/MainLayout.jsx
const mainLayout = `import { Outlet } from 'react-router-dom'
import './MainLayout.css'

export function MainLayout() {
  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="navbar-brand">GenAI</div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/Layout', 'MainLayout.jsx'), mainLayout);
console.log('✅ Created MainLayout.jsx');

// Create components/Layout/AuthLayout.jsx
const authLayout = `import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'components/Layout', 'AuthLayout.jsx'), authLayout);
console.log('✅ Created AuthLayout.jsx');

// Create components/Layout/MainLayout.css
const mainLayoutCss = `.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .main-content {
    padding: 1rem;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'components/Layout', 'MainLayout.css'), mainLayoutCss);
console.log('✅ Created MainLayout.css');

// Create components/Layout/AuthLayout.css
const authLayoutCss = `.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

@media (max-width: 768px) {
  .auth-layout {
    padding: 1rem;
  }

  .auth-container {
    max-width: 100%;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'components/Layout', 'AuthLayout.css'), authLayoutCss);
console.log('✅ Created AuthLayout.css');

// Create pages/Auth/Login/LoginPage.jsx
const loginPage = `import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { authService } from '../../../services/api'
import './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, setCurrentUser } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(formData)
      const { token, user } = response.data
      
      login(token)
      setCurrentUser(user)
      setSuccess('Login successful! Redirecting...')
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your account</p>

        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-alert">{success}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="form-footer">
          <p>Don't have an account? <Link to="/auth/register">Register here</Link></p>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Auth/Login', 'LoginPage.jsx'), loginPage);
console.log('✅ Created LoginPage.jsx');

// Create pages/Auth/Login/LoginPage.css
const loginPageCss = `.login-page {
  width: 100%;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.btn-submit {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-alert {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #c33;
}

.success-alert {
  background: #efe;
  color: #3c3;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #3c3;
}

.form-footer {
  text-align: center;
  color: #666;
}

.form-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.form-footer a:hover {
  color: #764ba2;
}

@media (max-width: 768px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-card h1 {
    font-size: 1.5rem;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Auth/Login', 'LoginPage.css'), loginPageCss);
console.log('✅ Created LoginPage.css');

// Create pages/Auth/Register/RegisterPage.jsx
const registerPage = `import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { authService } from '../../../services/api'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required')
      return false
    }
    if (formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      const response = await authService.register(registerData)
      const { token, user } = response.data
      
      login(token)
      setCurrentUser(user)
      setSuccess('Registration successful! Redirecting...')
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>
        <p className="subtitle">Sign up to get started</p>

        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-alert">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="form-footer">
          <p>Already have an account? <Link to="/auth/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Auth/Register', 'RegisterPage.jsx'), registerPage);
console.log('✅ Created RegisterPage.jsx');

// Create pages/Auth/Register/RegisterPage.css
const registerPageCss = `.register-page {
  width: 100%;
}

.register-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-card h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.register-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.btn-submit {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-alert {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #c33;
}

.success-alert {
  background: #efe;
  color: #3c3;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #3c3;
}

.form-footer {
  text-align: center;
  color: #666;
}

.form-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.form-footer a:hover {
  color: #764ba2;
}

@media (max-width: 768px) {
  .register-card {
    padding: 1.5rem;
  }

  .register-card h1 {
    font-size: 1.5rem;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Auth/Register', 'RegisterPage.css'), registerPageCss);
console.log('✅ Created RegisterPage.css');

// Create pages/Dashboard/DashboardPage.jsx
const dashboardPage = `import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './DashboardPage.css'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.username || 'User'}!</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Quick Links</h2>
          <button onClick={() => navigate('/profile')} className="btn-link">
            View Profile
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Account Info</h2>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Dashboard', 'DashboardPage.jsx'), dashboardPage);
console.log('✅ Created DashboardPage.jsx');

// Create pages/Dashboard/DashboardPage.css
const dashboardPageCss = `.dashboard-page {
  width: 100%;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.dashboard-header p {
  color: #666;
  font-size: 1.1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.dashboard-card h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.dashboard-card p {
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.btn-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Dashboard', 'DashboardPage.css'), dashboardPageCss);
console.log('✅ Created DashboardPage.css');

// Create pages/Profile/ProfilePage.jsx
const profilePage = `import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/api'
import './ProfilePage.css'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await authService.getMe()
      setProfileData(response.data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile')
      console.error('Profile error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      logout()
      navigate('/auth/login')
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="profile-card">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="profile-info-grid">
            <div className="info-item">
              <label>User ID</label>
              <p className="info-value">{profileData?.id}</p>
            </div>
            <div className="info-item">
              <label>Username</label>
              <p className="info-value">{profileData?.username}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p className="info-value">{profileData?.email}</p>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Profile', 'ProfilePage.jsx'), profilePage);
console.log('✅ Created ProfilePage.jsx');

// Create pages/Profile/ProfilePage.css
const profilePageCss = `.profile-page {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  color: #333;
  font-size: 2rem;
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-section {
  margin-bottom: 2rem;
}

.profile-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f0f0;
}

.profile-info-grid {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #333;
  font-size: 1.1rem;
  word-break: break-all;
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.btn-secondary,
.btn-logout {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #e8e8e8;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn-logout {
  background: #f44336;
  color: white;
}

.btn-logout:hover {
  background: #da190b;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.error-alert {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #c33;
}

@media (max-width: 768px) {
  .profile-card {
    padding: 1.5rem;
  }

  .profile-actions {
    flex-direction: column;
  }

  .btn-secondary,
  .btn-logout {
    width: 100%;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/Profile', 'ProfilePage.css'), profilePageCss);
console.log('✅ Created ProfilePage.css');

// Create styles/App.css
const appCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
  color: #333;
}

#root {
  min-height: 100vh;
}

/* Global Button Styles */
button {
  font-family: inherit;
}

/* Global Link Styles */
a {
  text-decoration: none;
  color: inherit;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive Typography */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}
`;

fs.writeFileSync(path.join(srcDir, 'styles', 'App.css'), appCss);
console.log('✅ Created App.css');

// Create main router configuration - App.jsx
const appJsx = `import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { MainLayout } from './components/Layout/MainLayout'
import { AuthLayout } from './components/Layout/AuthLayout'
import { LoginPage } from './pages/Auth/Login/LoginPage'
import { RegisterPage } from './pages/Auth/Register/RegisterPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { ProfilePage } from './pages/Profile/ProfilePage'
import './styles/App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all - 404 redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
`;

fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsx);
console.log('✅ Created App.jsx with routing');

// Create main.jsx
const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

fs.writeFileSync(path.join(srcDir, 'main.jsx'), mainJsx);
console.log('✅ Created main.jsx');

// Create vite.config.js
const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
`;

fs.writeFileSync(path.join(frontendDir, 'vite.config.js'), viteConfig);
console.log('✅ Created vite.config.js');

// Create .env.example
const envExample = `VITE_API_URL=http://localhost:3000/api
`;

fs.writeFileSync(path.join(frontendDir, '.env.example'), envExample);
console.log('✅ Created .env.example');

// Create README
const readme = `# GenAI Frontend - React Router Setup

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── App.jsx                 # Main router configuration
│   ├── main.jsx               # React entry point
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── LoginPage.css
│   │   │   └── Register/
│   │   │       ├── RegisterPage.jsx
│   │   │       └── RegisterPage.css
│   │   ├── Dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── DashboardPage.css
│   │   └── Profile/
│   │       ├── ProfilePage.jsx
│   │       └── ProfilePage.css
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── MainLayout.css
│   │   │   ├── AuthLayout.jsx
│   │   │   └── AuthLayout.css
│   │   └── ProtectedRoute/
│   │       └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── hooks/
│   │   └── useAuthGuard.js     # Protected route hook
│   ├── services/
│   │   └── api.js              # Axios API configuration
│   ├── styles/
│   │   └── App.css             # Global styles
│   └── utils/
├── index.html
├── package.json
└── vite.config.js
\`\`\`

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Frontend: \`http://localhost:5173\`
Backend: \`http://localhost:3000\`

### 3. Build for Production
\`\`\`bash
npm run build
\`\`\`

## Routes

### Public Routes
- \`/auth/login\` - User login page
- \`/auth/register\` - User registration page

### Protected Routes (Require Authentication)
- \`/dashboard\` - Dashboard home page
- \`/profile\` - User profile page (GetMe API)

### Redirects
- \`/\` → \`/dashboard\` (or login if not authenticated)
- Unknown routes → \`/dashboard\` or login

## Authentication Flow

1. **Registration** → User submits form → API returns JWT token → Stored in localStorage
2. **Login** → User submits credentials → API returns JWT token → Stored in localStorage
3. **Auto-redirect** → After auth, redirects to \`/dashboard\`
4. **Protected Routes** → \`<ProtectedRoute>\` component checks token before rendering
5. **Logout** → Token cleared from localStorage → Redirected to \`/auth/login\`

## Key Features

### Context API (AuthContext.jsx)
- Global authentication state management
- Token management
- User information storage
- Login/logout functionality

### Protected Routes
- \`<ProtectedRoute>\` wrapper component
- Redirects unauthenticated users to login
- Works with React Router v6

### API Integration
- Axios interceptors for automatic token attachment
- Automatic 401 redirect for expired tokens
- Centralized API service (\`services/api.js\`)

### Layouts
- **AuthLayout**: Used for login/register pages
- **MainLayout**: Used for protected pages with navbar

## Environment Variables

Create \`.env\` file:
\`\`\`
VITE_API_URL=http://localhost:3000/api
\`\`\`

## Page Descriptions

### Login Page (/auth/login)
- Email and password input
- Sign-in button with loading state
- Link to registration page
- Error/success messages
- Auto-redirect on successful login

### Register Page (/auth/register)
- Username, email, and password input
- Password confirmation
- Form validation
- Error handling
- Auto-login after registration

### Dashboard Page (/dashboard)
- Welcome message with username
- Quick links to profile
- User account info display
- Central hub for authenticated users

### Profile Page (/profile)
- Displays GetMe API data
- Shows user ID, username, email
- Logout button
- Back to dashboard link

## Error Handling

- Form validation with user-friendly messages
- API error responses displayed to user
- Auto-logout on token expiration (401 errors)
- Graceful fallbacks for failed requests

## Styling

- Modern gradient design (purple theme)
- Responsive design for mobile/tablet/desktop
- Smooth animations and transitions
- Accessible color contrasts
- Focus states for form inputs

## API Endpoints Used

\`\`\`
POST   /api/auth/register       # User registration
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
GET    /api/user/me             # Get current user (protected)
\`\`\`

## Authentication Tokens

- JWT tokens sent in \`Authorization: Bearer <token>\` header
- Token stored in localStorage
- Automatically included in all API requests via Axios interceptor
- Token cleared on logout or expiration
`;

fs.writeFileSync(path.join(frontendDir, 'README.md'), readme);
console.log('✅ Created README.md');

console.log(\`
╔════════════════════════════════════════════════════════════════╗
║  ✅ REACT ROUTER SETUP COMPLETE!                               ║
╚════════════════════════════════════════════════════════════════╝

📁 Project Structure Created:
   ✓ Auth context for state management
   ✓ Protected route component
   ✓ Layout components (Auth & Main)
   ✓ Auth pages (Login & Register)
   ✓ Dashboard page
   ✓ Profile page (GetMe API)
   ✓ API service with interceptors
   ✓ Global styles

🚀 Routes:
   Public:
   • /auth/login       - Login page
   • /auth/register    - Register page

   Protected:
   • /dashboard        - Dashboard home
   • /profile          - User profile
   • /                 - Redirects to /dashboard

📦 Next Steps:
   1. cd frontend
   2. npm install react-router-dom
   3. npm run dev

🔗 URLs:
   Frontend: http://localhost:5173
   Backend:  http://localhost:3000

📝 Features:
   ✓ JWT authentication flow
   ✓ Protected routes with redirects
   ✓ Global auth context
   ✓ Automatic token attachment to requests
   ✓ Form validation
   ✓ Error handling
   ✓ Responsive design
   ✓ Modern UI with gradients

💡 For more details, see frontend/README.md
\`);
`;

fs.writeFileSync(path.join(__dirname, 'setup-router.js'), setupLog);
console.log('✅ Created setup-router.js');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✅ REACT ROUTER SETUP COMPLETE!                               ║
╚════════════════════════════════════════════════════════════════╝

📁 Project Structure Created:
   ✓ Auth context for state management
   ✓ Protected route component
   ✓ Layout components (Auth & Main)
   ✓ Auth pages (Login & Register)
   ✓ Dashboard page
   ✓ Profile page (GetMe API)
   ✓ API service with interceptors
   ✓ Global styles

🚀 Routes:
   Public:
   • /auth/login       - Login page
   • /auth/register    - Register page

   Protected:
   • /dashboard        - Dashboard home
   • /profile          - User profile
   • /                 - Redirects to /dashboard

📦 Next Steps:
   1. cd frontend
   2. npm install react-router-dom
   3. npm run dev

🔗 URLs:
   Frontend: http://localhost:5173
   Backend:  http://localhost:3000

📝 Features:
   ✓ JWT authentication flow
   ✓ Protected routes with redirects
   ✓ Global auth context
   ✓ Automatic token attachment to requests
   ✓ Form validation
   ✓ Error handling
   ✓ Responsive design
   ✓ Modern UI with gradients

💡 For more details, see frontend/README.md
`);
