import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents, setPage, resetFilters } from '../features/events/eventsSlice'
import FilterBar from '../components/FilterBar'
import EventCard from '../components/EventCard'
import EventCardSkeleton from '../components/EventCardSkeleton'
import Pagination from '../components/Pagination'
import { ErrorMessage, EmptyState } from '../components/Feedback'
import './Events.css'

export default function Events() {
  const dispatch = useDispatch()
  const { items, status, error, page, totalPages, totalElements, filters } = useSelector((s) => s.events)

  const load = useCallback(() => dispatch(fetchEvents()), [dispatch])

  useEffect(() => {
    const request = load()
    return () => request.abort() // cancel the in-flight request when inputs change
  }, [load, page, filters])

  const changePage = (p) => {
    dispatch(setPage(p))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container">
      <header className="events__head">
        <h1>Explore events</h1>
        {status === 'succeeded' && (
          <p className="events__count">{totalElements.toLocaleString()} events found</p>
        )}
      </header>

      <FilterBar />

      {status === 'loading' && <EventCardSkeleton />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={load} />}
      {status === 'succeeded' && items.length === 0 && (
        <EmptyState
          title="No events found"
          text="Try a different search or loosen your filters."
          action={<button className="btn btn--ghost" onClick={() => dispatch(resetFilters())}>Clear filters</button>}
        />
      )}
      {status === 'succeeded' && items.length > 0 && (
        <>
          <div className="grid">
            {items.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={changePage} />
        </>
      )}
    </div>
  )
}
