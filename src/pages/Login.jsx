import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearAuthError } from '../features/auth/authSlice'
import FormField from '../components/FormField'
import { validateEmail } from '../utils/validators'
import './Auth.css'
import useDocumentTitle from '../utils/useDocumentTitle'

export default function Login() {
  useDocumentTitle('Log in')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const redirectTo = location.state?.from || '/events'

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const found = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Password is required',
    }
    setErrors(found)
    if (Object.values(found).some(Boolean)) return
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={submit} noValidate>
        <h1>Welcome back</h1>
        <p className="auth__sub">Log in to register for events and manage your bookings.</p>
        {location.state?.from && <p className="auth__note">Please log in to continue.</p>}
        {error && <p className="auth__alert" role="alert">{error}</p>}
        <FormField label="Email" name="email" type="email" value={form.email} onChange={update} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={update} error={errors.password} autoComplete="current-password" />
        <button className="btn auth__submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Log in'}
        </button>
        <p className="auth__switch">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  )
}
