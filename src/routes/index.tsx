import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/layout/Layout'
import { LoginPage } from '../pages/auth/Login'
import { SignUpPage } from '../pages/auth/SignUp'
import { LeadsPage } from '../pages/leads/Leads'
import { DashboardPage } from '../pages/dashboard/Dashboard'
import { Loading } from '../components/common/Loading'

export function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/leads" />} />
      <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/leads" />} />
      
      {/* Protected Routes */}
      {user ? (
        <Route element={<Layout />}>
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}

      <Route path="*" element={<Navigate to={user ? "/leads" : "/login"} />} />
    </Routes>
  )
} 