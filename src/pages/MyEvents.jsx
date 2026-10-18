import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserRegistrations } from '../features/registrations/registrationsSlice'
import RegistrationCard from '../components/RegistrationCard'
import { EmptyState } from '../components/Feedback'
import { isPast } from '../utils/dates'
import './MyEvents.css'
import useDocumentTitle from '../utils/useDocumentTitle'

const sortKey = (r) => r.event.dateTime || `${r.event.localDate}T00:00:00`

export default function MyEvents() {
  useDocumentTitle('My events')
  const registrations = useSelector(selectUserRegistrations)
  const [tab, setTab] = useState('upcoming')

  const { upcoming, completed } = useMemo(() => {
    const up = []
    const done = []
    registrations.forEach((r) => (isPast(r.event) ? done : up).push(r))
    up.sort((a, b) => sortKey(a).localeCompare(sortKey(b))) // soonest first
    done.sort((a, b) => sortKey(b).localeCompare(sortKey(a))) // most recent first
    return { upcoming: up, completed: done }
  }, [registrations])

  const shown = tab === 'upcoming' ? upcoming : completed

  return (
    <div className="container">
      <h1 className="mine__title">My events</h1>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'upcoming'} className={`tab ${tab === 'upcoming' ? 'tab--on' : ''}`} onClick={() => setTab('upcoming')}>
          Upcoming <span>{upcoming.length}</span>
        </button>
        <button role="tab" aria-selected={tab === 'completed'} className={`tab ${tab === 'completed' ? 'tab--on' : ''}`} onClick={() => setTab('completed')}>
          Completed <span>{completed.length}</span>
        </button>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={tab === 'upcoming' ? 'No upcoming events' : 'No completed events yet'}
          text={tab === 'upcoming' ? 'Find something you like and register.' : 'Events you attended will show up here.'}
          action={tab === 'upcoming' ? <Link to="/events" className="btn">Explore events</Link> : null}
        />
      ) : (
        <ul className="mine__list">
          {shown.map((r) => (
            <RegistrationCard key={r.id} registration={r} completed={tab === 'completed'} />
          ))}
        </ul>
      )}
    </div>
  )
}
