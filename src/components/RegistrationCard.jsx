import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { cancelRegistration } from '../features/registrations/registrationsSlice'
import { notify } from '../features/notifications/notificationsSlice'
import { formatDate, formatTime, placeLine } from '../utils/dates'
import './RegistrationCard.css'

export default function RegistrationCard({ registration, completed }) {
  const { event, userId, eventId, registeredAt } = registration
  const dispatch = useDispatch()
  const [confirming, setConfirming] = useState(false)

  const cancel = () => {
    dispatch(cancelRegistration({ userId, eventId }))
    dispatch(notify(`Cancelled registration for ${event.name}`, 'info'))
  }

  return (
    <li className={`reg-card ${completed ? 'reg-card--done' : ''}`}>
      <Link to={`/events/${eventId}`} className="reg-card__img">
        {event.image ? <img src={event.image} alt="" loading="lazy" /> : <div />}
      </Link>

      <div className="reg-card__body">
        <span className={`reg-card__status ${completed ? '' : 'reg-card__status--up'}`}>
          {completed ? 'Completed' : 'Upcoming'}
        </span>
        <h3><Link to={`/events/${eventId}`}>{event.name}</Link></h3>
        <p>
          {formatDate(event.localDate)}
          {event.localTime && ` at ${formatTime(event.localDate, event.localTime)}`}
        </p>
        <p className="reg-card__dim">
          {[event.venue.name, placeLine(event.venue)].filter(Boolean).join(' - ') || 'Venue to be announced'}
        </p>
        <p className="reg-card__dim">Registered on {new Date(registeredAt).toLocaleDateString('en-GB')}</p>
      </div>

      <div className="reg-card__actions">
        <Link to={`/events/${eventId}`} className="btn btn--ghost btn--small">View</Link>
        {!completed &&
          (confirming ? (
            <>
              <button className="btn btn--danger btn--small" onClick={cancel}>Confirm cancel</button>
              <button className="btn btn--ghost btn--small" onClick={() => setConfirming(false)}>Keep</button>
            </>
          ) : (
            <button className="btn btn--danger btn--small" onClick={() => setConfirming(true)}>Cancel</button>
          ))}
      </div>
    </li>
  )
}
