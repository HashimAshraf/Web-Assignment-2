import { Link } from 'react-router-dom'
import { dayAndMonth, formatTime, formatPrice, placeLine } from '../utils/dates'
import './EventCard.css'

export default function EventCard({ event }) {
  const { day, month } = dayAndMonth(event.localDate)
  const price = formatPrice(event)
  const place = placeLine(event.venue)

  return (
    <Link to={`/events/${event.id}`} className="card">
      <div className="card__media">
        {event.image ? (
          <img src={event.image} alt={event.name} loading="lazy" />
        ) : (
          <div className="card__noimg">No image</div>
        )}
        <div className="card__date" aria-hidden="true">
          <strong>{day}</strong>
          <span>{month}</span>
        </div>
        {event.segment && <span className="card__badge">{event.segment}</span>}
      </div>
      <div className="card__body">
        <h3 className="card__title">{event.name}</h3>
        <p className="card__meta">{event.venue.name || 'Venue to be announced'}</p>
        <p className="card__meta card__meta--dim">
          {place}
          {event.localTime && ` · ${formatTime(event.localDate, event.localTime)}`}
        </p>
        <div className="card__foot">
          <span className="card__price">{price || 'See details'}</span>
          {event.status === 'cancelled' && <span className="card__flag">Cancelled</span>}
          {event.status === 'offsale' && <span className="card__flag">Off sale</span>}
        </div>
      </div>
    </Link>
  )
}
