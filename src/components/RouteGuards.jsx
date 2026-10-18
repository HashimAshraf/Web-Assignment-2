import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'

// Only logged-in users may pass; others go to /login and are sent back afterwards.
export function ProtectedRoute() {
  const user = useSelector(selectCurrentUser)
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

// Login/Register are pointless once signed in.
export function GuestRoute() {
  const user = useSelector(selectCurrentUser)
  if (user) return <Navigate to="/events" replace />
  return <Outlet />
}
