import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventDetails } from '../features/events/eventsSlice'
import RegisterButton from '../components/RegisterButton'
import { ErrorMessage } from '../components/Feedback'
import { formatDate, formatTime, formatPrice, placeLine } from '../utils/dates'
import './EventDetails.css'

export default function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { detail: event, detailStatus, detailError } = useSelector((s) => s.events)

  useEffect(() => {
    const request = dispatch(fetchEventDetails(id))
    return () => request.abort()
  }, [dispatch, id])

  useEffect(() => {
    document.title = event && event.id === id ? `${event.name} - Eventide` : 'Eventide'
    return () => { document.title = 'Eventide' }
  }, [event, id])

  if (detailStatus === 'failed') {
    return (
      <div className="container">
        <ErrorMessage message={detailError} onRetry={() => dispatch(fetchEventDetails(id))} />
        <p className="detail__back"><Link to="/events">Back to events</Link></p>
      </div>
    )
  }

  if (detailStatus !== 'succeeded' || !event || event.id !== id) {
    return (
      <div className="container" aria-busy="true">
        <div className="detail__skeleton" />
      </div>
    )
  }

  const price = formatPrice(event)
  const place = placeLine(event.venue)
  const mapQuery = event.venue.lat
    ? `${event.venue.lat},${event.venue.lng}`
    : encodeURIComponent(`${event.venue.name} ${place}`)

  return (
    <article className="detail">
      <div className="detail__hero" style={event.image ? { backgroundImage: `url(${event.image})` } : undefined}>
        <div className="detail__shade" />
        <div className="container detail__heroin">
          <Link to="/events" className="detail__back">&larr; All events</Link>
          <div className="detail__tags">
            {[event.segment, event.genre, event.subGenre].filter(Boolean).map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
            {event.status === 'cancelled' && <span className="tag tag--warn">Cancelled</span>}
            {event.status === 'postponed' && <span className="tag tag--warn">Postponed</span>}
          </div>
          <h1>{event.name}</h1>
        </div>
      </div>

      <div className="container detail__grid">
        <div className="detail__main">
          <h2>About this event</h2>
          {event.info || event.pleaseNote ? (
            <>
              {event.info && <p>{event.info}</p>}
              {event.pleaseNote && <p className="detail__note"><strong>Please note:</strong> {event.pleaseNote}</p>}
            </>
          ) : (
            <p className="detail__muted">The organiser has not added a description for this event.</p>
          )}

          {event.attractions.length > 0 && (
            <>
              <h2>Featuring</h2>
              <ul className="detail__list">
                {event.attractions.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </>
          )}

          {event.seatmap && (
            <>
              <h2>Seat map</h2>
              <img className="detail__seatmap" src={event.seatmap} alt={`Seat map for ${event.venue.name}`} loading="lazy" />
            </>
          )}
        </div>

        <aside className="detail__side">
          <dl className="facts">
            <dt>Date</dt>
            <dd>{formatDate(event.localDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</dd>
            {event.localTime && (<><dt>Time</dt><dd>{formatTime(event.localDate, event.localTime)}</dd></>)}
            <dt>Venue</dt>
            <dd>{event.venue.name || 'To be announced'}</dd>
            <dt>Location</dt>
            <dd>
              {[event.venue.address, place, event.venue.postalCode].filter(Boolean).join(', ') || 'To be announced'}
              {(event.venue.lat || event.venue.name) && (
                <>
                  {' '}
                  <a className="detail__link" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">
                    Map
                  </a>
                </>
              )}
            </dd>
            <dt>Category</dt>
            <dd>{[event.segment, event.genre].filter(Boolean).join(' / ') || 'General'}</dd>
            {price && (<><dt>Price</dt><dd>{price}</dd></>)}
          </dl>

          <RegisterButton event={event} />

          {event.url && (
            <a className="btn btn--ghost detail__buy" href={event.url} target="_blank" rel="noreferrer">
              Buy tickets on Ticketmaster
            </a>
          )}
        </aside>
      </div>
    </article>
  )
}
