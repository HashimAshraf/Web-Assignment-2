// Every call to the Ticketmaster Discovery API lives in this file.
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = import.meta.env.VITE_TM_API_KEY

// The API returns the literal string "Undefined" for unknown classifications.
const clean = (value) => (value && value !== 'Undefined' ? value : '')

async function request(path, params = {}, signal) {
  if (!API_KEY) {
    throw new Error('Missing API key. Add VITE_TM_API_KEY to your .env file and restart the dev server.')
  }
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('apikey', API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
  })

  let res
  try {
    res = await fetch(url, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Network error. Check your connection and try again.', { cause: err })
  }

  if (res.status === 401) throw new Error('The Ticketmaster API key was rejected (401). Check your .env file.')
  if (res.status === 429) throw new Error('Too many requests (429). Wait a moment and try again.')
  if (res.status === 404) throw new Error('Event not found.')
  if (!res.ok) throw new Error(`Ticketmaster returned an error (${res.status}).`)
  return res.json()
}

function pickImage(images = []) {
  const wide = images
    .filter((img) => img.ratio === '16_9')
    .sort((a, b) => b.width - a.width)
  const big = wide.find((img) => img.width >= 640 && img.width <= 1100) || wide[0]
  return big?.url || images[0]?.url || ''
}

// Shrink the huge API object to only what the UI needs.
export function normalizeEvent(raw) {
  const venue = raw._embedded?.venues?.[0]
  const cls = raw.classifications?.find((c) => c.primary) || raw.classifications?.[0]
  const price = raw.priceRanges?.[0]
  return {
    id: raw.id,
    name: raw.name,
    url: raw.url || '',
    image: pickImage(raw.images),
    dateTime: raw.dates?.start?.dateTime || null, // exact UTC instant
    localDate: raw.dates?.start?.localDate || '',
    localTime: raw.dates?.start?.localTime || '',
    timezone: raw.dates?.timezone || '',
    status: raw.dates?.status?.code || '',
    segment: clean(cls?.segment?.name),
    genre: clean(cls?.genre?.name),
    subGenre: clean(cls?.subGenre?.name),
    venue: {
      name: venue?.name || '',
      address: venue?.address?.line1 || '',
      city: venue?.city?.name || '',
      state: venue?.state?.stateCode || venue?.state?.name || '',
      country: venue?.country?.name || '',
      postalCode: venue?.postalCode || '',
      lat: venue?.location?.latitude || '',
      lng: venue?.location?.longitude || '',
    },
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency || '',
    info: raw.info || '',
    pleaseNote: raw.pleaseNote || '',
    seatmap: raw.seatmap?.staticUrl || '',
    attractions: (raw._embedded?.attractions || []).map((a) => a.name),
  }
}

export async function fetchEventsPage(params, signal) {
  const data = await request('/events.json', params, signal)
  const page = data.page || {}
  // The API refuses deep paging (size * page must stay below 1000).
  const maxPages = Math.floor(1000 / (page.size || 12))
  return {
    events: (data._embedded?.events || []).map(normalizeEvent),
    totalElements: page.totalElements || 0,
    totalPages: Math.min(page.totalPages || 0, maxPages),
  }
}

export async function fetchEventById(id, signal) {
  const raw = await request(`/events/${encodeURIComponent(id)}.json`, {}, signal)
  return normalizeEvent(raw)
}
