import { useEffect } from 'react'
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
