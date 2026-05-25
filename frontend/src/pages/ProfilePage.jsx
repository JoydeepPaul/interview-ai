import { useState, useEffect } from 'react'
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
          'Authorization': `Bearer ${token}`
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
