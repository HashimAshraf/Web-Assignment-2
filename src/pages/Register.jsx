import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearAuthError } from '../features/auth/authSlice'
import FormField from '../components/FormField'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirm,
} from '../utils/validators'
import './Auth.css'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const found = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
    }
    setErrors(found)
    if (Object.values(found).some(Boolean)) return
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) navigate('/events')
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={submit} noValidate>
        <h1>Create your account</h1>
        <p className="auth__sub">Register for events and keep track of them in one place.</p>
        {error && <p className="auth__alert" role="alert">{error}</p>}
        <FormField label="Full name" name="name" value={form.name} onChange={update} error={errors.name} autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={update} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={update} error={errors.password} hint="At least 8 characters, with a letter and a number" autoComplete="new-password" />
        <FormField label="Confirm password" name="confirm" type="password" value={form.confirm} onChange={update} error={errors.confirm} autoComplete="new-password" />
        <button className="btn auth__submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account...' : 'Sign up'}
        </button>
        <p className="auth__switch">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  )
}
