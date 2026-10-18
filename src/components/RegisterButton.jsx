import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import {
  registerForEvent,
  cancelRegistration,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice'
import { notify } from '../features/notifications/notificationsSlice'
import { isPast } from '../utils/dates'

export default function RegisterButton({ event }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(selectCurrentUser)
  const registered = useSelector(selectIsRegistered(event.id))
  const [confirming, setConfirming] = useState(false)

  if (isPast(event)) return <button className="btn" disabled>This event has ended</button>
  if (event.status === 'cancelled') return <button className="btn" disabled>Event cancelled</button>

  const register = () => {
    if (!user) {
      // Send guests to log in, then bring them back to this event.
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    dispatch(registerForEvent(user.id, event))
    dispatch(notify(`You're registered for ${event.name}`))
  }

  const cancel = () => {
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))
    dispatch(notify('Registration cancelled', 'info'))
    setConfirming(false)
  }

  if (!registered) {
    return <button className="btn" onClick={register}>{user ? 'Register for this event' : 'Log in to register'}</button>
  }

  return (
    <div className="reg">
      <p className="reg__ok">You are registered for this event.</p>
      {confirming ? (
        <div className="reg__confirm">
          <button className="btn btn--danger" onClick={cancel}>Yes, cancel it</button>
          <button className="btn btn--ghost" onClick={() => setConfirming(false)}>Keep</button>
        </div>
      ) : (
        <button className="btn btn--danger" onClick={() => setConfirming(true)}>Cancel registration</button>
      )}
    </div>
  )
}
