import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setFilters } from '../features/events/eventsSlice'
import { fetchEventsPage } from '../services/ticketmaster'
import { CATEGORIES } from '../components/FilterBar'
import EventCard from '../components/EventCard'
import EventCardSkeleton from '../components/EventCardSkeleton'
import { ErrorMessage } from '../components/Feedback'
import './Home.css'
import useDocumentTitle from '../utils/useDocumentTitle'

const ICONS = { Music: '♪', Sports: '⚽', 'Arts & Theatre': '🎭', Film: '🎬', Miscellaneous: '✦' }

export default function Home() {
  useDocumentTitle('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [soon, setSoon] = useState({ status: 'loading', events: [], error: '' })

  useEffect(() => {
    const controller = new AbortController()
    const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
    fetchEventsPage({ startDateTime: now, sort: 'date,asc', size: 4, countryCode: '' }, controller.signal)
      .then((r) => setSoon({ status: 'ok', events: r.events, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setSoon({ status: 'error', events: [], error: err.message })
      })
    return () => controller.abort()
  }, [])

  const browse = (category) => {
    dispatch(setFilters({ category }))
    navigate('/events')
  }

  return (
    <>
      <section className="hero">
        <div className="container hero__in">
          <p className="hero__eyebrow">Live events, one place</p>
          <h1>Find your next night out.</h1>
          <p className="hero__sub">
            Browse concerts, sports, theatre and more from the Ticketmaster catalogue, register in one click
            and keep every booking in My Events.
          </p>
          <div className="hero__cta">
            <Link to="/events" className="btn">Explore events</Link>
            <Link to="/register" className="btn btn--ghost">Create account</Link>
          </div>
        </div>
      </section>

      <section className="container home__section">
        <h2>Browse by category</h2>
        <div className="cats">
          {CATEGORIES.map((c) => (
            <button key={c} className="cat" onClick={() => browse(c)}>
              <span aria-hidden="true">{ICONS[c]}</span>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container home__section">
        <div className="home__row">
          <h2>Happening soon</h2>
          <Link to="/events" className="home__more">See all &rarr;</Link>
        </div>
        {soon.status === 'loading' && <EventCardSkeleton count={4} />}
        {soon.status === 'error' && <ErrorMessage message={soon.error} />}
        {soon.status === 'ok' && (
          <div className="grid">{soon.events.map((e) => <EventCard key={e.id} event={e} />)}</div>
        )}
      </section>
    </>
  )
}
