import './EventCard.css'

export default function EventCardSkeleton({ count = 8 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading events">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton" key={i}>
          <div className="skeleton__img" />
          <div className="skeleton__body">
            <div className="skeleton__line" style={{ width: '85%' }} />
            <div className="skeleton__line" style={{ width: '60%' }} />
            <div className="skeleton__line" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
