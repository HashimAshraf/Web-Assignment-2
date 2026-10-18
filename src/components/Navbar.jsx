import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

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
          <NavLink to="/my-events" onClick={close}>My Events</NavLink>
          <NavLink to="/login" onClick={close}>Log in</NavLink>
          <NavLink to="/register" className="btn btn--small" onClick={close}>Sign up</NavLink>
        </nav>
      </div>
    </header>
  )
}
