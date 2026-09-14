import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-ink text-chalkdim font-display text-xl">
        Loading GymUp…
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
