import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ color: '#7F77DD', fontSize: 14 }}>Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />

  return children
}
