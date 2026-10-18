// Show the event in the venue's own local date/time, exactly as Ticketmaster lists it.
function toLocal(localDate, localTime) {
  if (!localDate) return null
  return new Date(`${localDate}T${localTime || '00:00:00'}`)
}

export function formatDate(localDate, options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) {
  const d = toLocal(localDate)
  return d ? d.toLocaleDateString('en-GB', options) : 'Date to be announced'
}

export function formatTime(localDate, localTime) {
  if (!localTime) return ''
  return toLocal(localDate, localTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function dayAndMonth(localDate) {
  const d = toLocal(localDate)
  if (!d) return { day: '--', month: 'TBA' }
  return {
    day: d.toLocaleDateString('en-GB', { day: 'numeric' }),
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
  }
}

// True once the event's start instant has passed.
export function isPast(event) {
  if (event.dateTime) return Date.parse(event.dateTime) < Date.now()
  const d = toLocal(event.localDate)
  if (!d) return false
  d.setHours(23, 59, 59)
  return d.getTime() < Date.now()
}

export function formatPrice(event) {
  if (event.priceMin == null) return ''
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: event.currency || 'USD', maximumFractionDigits: 0 }).format(n)
  return event.priceMax && event.priceMax !== event.priceMin
    ? `${fmt(event.priceMin)} - ${fmt(event.priceMax)}`
    : fmt(event.priceMin)
}

export function placeLine(venue) {
  return [venue.city, venue.state, venue.country].filter(Boolean).join(', ')
}
