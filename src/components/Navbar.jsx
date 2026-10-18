import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const close = () => setOpen(false)

  const handleLogout = () => {
    dispatch(logout())
    close()
    navigate('/')
  }

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand" onClick={close}>
          <span className="nav__logo" aria-hidden="true" />
          Eventide
        </Link>

        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          <NavLink to="/events" onClick={close}>Explore</NavLink>
          {user ? (
            <>
              <NavLink to="/my-events" onClick={close}>My Events</NavLink>
              <span className="nav__user">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn--ghost btn--small" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Log in</NavLink>
              <NavLink to="/register" className="btn btn--small" onClick={close}>Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
