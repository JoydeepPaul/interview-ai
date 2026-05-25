const fs = require('fs');
const path = require('path');

const frontendDir = './frontend';
const srcDir = path.join(frontendDir, 'src');

// Create directories
[frontendDir, srcDir, path.join(srcDir, 'pages'), path.join(srcDir, 'styles')].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create package.json
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
console.log('✅ Created package.json');

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

// Create index.html
const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GenAI Frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(frontendDir, 'index.html'), indexHtml);
console.log('✅ Created index.html');

// Create src/main.jsx
const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

fs.writeFileSync(path.join(srcDir, 'main.jsx'), mainJsx);
console.log('✅ Created main.jsx');

// Create src/App.jsx
const appJsx = `import { useState, useEffect } from 'react'
import './App.css'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

  return (
    <div className="app">
      {token ? (
        <ProfilePage token={token} setToken={setToken} />
      ) : (
        <AuthPage setToken={setToken} />
      )}
    </div>
  )
}

export default App
`;

fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsx);
console.log('✅ Created App.jsx');

// Create src/index.css
const indexCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
}

.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

fs.writeFileSync(path.join(srcDir, 'index.css'), indexCss);
console.log('✅ Created index.css');

// Create src/App.css
const appCss = `/* App styles */
`;

fs.writeFileSync(path.join(srcDir, 'App.css'), appCss);
console.log('✅ Created App.css');

// Create src/pages/AuthPage.jsx
const authPageJsx = `import { useState } from 'react'
import axios from 'axios'
import '../styles/AuthPage.css'

function AuthPage({ setToken }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await axios.post(endpoint, formData)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        setToken(response.data.token)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
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
              required
              placeholder="Enter password"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin)
              setFormData({ username: '', email: '', password: '' })
              setError('')
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthPage
`;

fs.writeFileSync(path.join(srcDir, 'pages', 'AuthPage.jsx'), authPageJsx);
console.log('✅ Created AuthPage.jsx');

// Create src/pages/ProfilePage.jsx
const profilePageJsx = `import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/ProfilePage.css'

function ProfilePage({ token, setToken }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user/me', {
        headers: {
          'Authorization': \`Bearer \${token}\`
        }
      })
      setUser(response.data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Welcome, {user?.username}!</h1>
        
        <div className="user-info">
          <div className="info-item">
            <label>Username:</label>
            <p>{user?.username}</p>
          </div>
          
          <div className="info-item">
            <label>Email:</label>
            <p>{user?.email}</p>
          </div>
          
          <div className="info-item">
            <label>User ID:</label>
            <p>{user?.id}</p>
          </div>
        </div>
        
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
`;

fs.writeFileSync(path.join(srcDir, 'pages', 'ProfilePage.jsx'), profilePageJsx);
console.log('✅ Created ProfilePage.jsx');

// Create src/styles/AuthPage.css
const authPageCss = `.auth-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

form button {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

form button:hover:not(:disabled) {
  background: #45a049;
}

form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.toggle-auth {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.toggle-auth button {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}
`;

fs.writeFileSync(path.join(srcDir, 'styles', 'AuthPage.css'), authPageCss);
console.log('✅ Created AuthPage.css');

// Create src/styles/ProfilePage.css
const profilePageCss = `.profile-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.profile-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.profile-card h1 {
  color: #333;
  margin-bottom: 30px;
}

.user-info {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;
}

.info-item {
  margin-bottom: 20px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item label {
  display: block;
  color: #666;
  font-weight: 600;
  margin-bottom: 5px;
}

.info-item p {
  color: #333;
  font-size: 16px;
  word-break: break-all;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #da190b;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error {
  color: #d32f2f;
}
`;

fs.writeFileSync(path.join(srcDir, 'styles', 'ProfilePage.css'), profilePageCss);
console.log('✅ Created ProfilePage.css');

// Create .gitignore
const gitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

fs.writeFileSync(path.join(frontendDir, '.gitignore'), gitignore);
console.log('✅ Created .gitignore');

// Create .env.example
const envExample = `VITE_API_URL=http://localhost:3000/api
`;

fs.writeFileSync(path.join(frontendDir, '.env.example'), envExample);
console.log('✅ Created .env.example');

const setupLog = `
✅ Vite React frontend scaffolding complete!

📁 Created directory structure:
   frontend/
   ├── package.json
   ├── vite.config.js
   ├── index.html
   ├── .gitignore
   ├── .env.example
   └── src/
       ├── main.jsx
       ├── App.jsx
       ├── App.css
       ├── index.css
       ├── pages/
       │   ├── AuthPage.jsx
       │   └── ProfilePage.jsx
       └── styles/
           ├── AuthPage.css
           └── ProfilePage.css

🚀 Next steps:
   1. cd frontend
   2. npm install
   3. npm run dev

📝 Features included:
   ✓ Register/Login page
   ✓ GetMe profile page
   ✓ Token-based authentication
   ✓ API proxy to backend (http://localhost:3000)
   ✓ Responsive design
   ✓ Error handling
   ✓ Loading states
`;

console.log(setupLog);
