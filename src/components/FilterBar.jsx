import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, resetFilters } from '../features/events/eventsSlice'
import useDebounce from '../utils/useDebounce'
import './FilterBar.css'

export const CATEGORIES = ['Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous']

const COUNTRIES = [
  ['', 'All countries'], ['US', 'United States'], ['CA', 'Canada'], ['GB', 'United Kingdom'],
  ['IE', 'Ireland'], ['AU', 'Australia'], ['NZ', 'New Zealand'], ['DE', 'Germany'],
  ['FR', 'France'], ['ES', 'Spain'], ['NL', 'Netherlands'], ['MX', 'Mexico'], ['AE', 'UAE'],
]

const SORTS = [
  ['date,asc', 'Soonest first'],
  ['date,desc', 'Latest first'],
  ['name,asc', 'Name A-Z'],
  ['relevance,desc', 'Most relevant'],
]

// A text input that waits for the user to stop typing before updating Redux.
function DebouncedInput({ field, label, placeholder, type = 'search', initial }) {
  const dispatch = useDispatch()
  const [text, setText] = useState(initial)
  const debounced = useDebounce(text)

  useEffect(() => {
    if (debounced !== initial) dispatch(setFilters({ [field]: debounced }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return (
    <label className="filters__item">
      <span>{label}</span>
      <input
        type={type}
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
      />
    </label>
  )
}

export default function FilterBar() {
  const dispatch = useDispatch()
  const { filters, resetCount } = useSelector((s) => s.events)
  const set = (patch) => dispatch(setFilters(patch))
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time

  return (
    <section className="filters" aria-label="Search and filters">
      {/* key remounts the inputs when filters are cleared, so no stale text remains */}
      <div className="filters__row" key={resetCount}>
        <DebouncedInput field="keyword" label="Search" placeholder="Artist, team, show or venue" initial={filters.keyword} />
        <DebouncedInput field="city" label="City" placeholder="e.g. London" type="text" initial={filters.city} />
      </div>

      <div className="filters__row">
        <label className="filters__item">
          <span>Country</span>
          <select value={filters.countryCode} onChange={(e) => set({ countryCode: e.target.value })}>
            {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
        <label className="filters__item">
          <span>From</span>
          <input type="date" min={today} value={filters.dateFrom} onChange={(e) => set({ dateFrom: e.target.value })} />
        </label>
        <label className="filters__item">
          <span>To</span>
          <input type="date" min={filters.dateFrom || today} value={filters.dateTo} onChange={(e) => set({ dateTo: e.target.value })} />
        </label>
        <label className="filters__item">
          <span>Sort by</span>
          <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
            {SORTS.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
          </select>
        </label>
        <button className="btn btn--ghost filters__clear" onClick={() => dispatch(resetFilters())}>
          Clear filters
        </button>
      </div>

      <div className="chips" role="group" aria-label="Categories">
        <button
          className={`chip ${filters.category === '' ? 'chip--on' : ''}`}
          onClick={() => set({ category: '' })}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${filters.category === c ? 'chip--on' : ''}`}
            aria-pressed={filters.category === c}
            onClick={() => set({ category: c })}
          >
            {c}
          </button>
        ))}
      </div>
    </section>
  )
}
