import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchEventsPage, fetchEventById } from '../../services/ticketmaster'

export const PAGE_SIZE = 12

// Only "now" in exact UTC, so events that already started elsewhere are hidden.
const nowUtc = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

export const defaultFilters = {
  keyword: '',
  category: '',
  countryCode: '',
  city: '',
  dateFrom: '', // YYYY-MM-DD
  dateTo: '',
  sort: 'date,asc',
}

// Translate the UI filters into Ticketmaster query parameters.
export function buildParams(filters, page) {
  const params = {
    keyword: filters.keyword.trim(),
    classificationName: filters.category,
    countryCode: filters.countryCode,
    city: filters.city.trim(),
    sort: filters.sort,
    size: PAGE_SIZE,
    page: page - 1,
  }
  if (filters.dateFrom || filters.dateTo) {
    // Venue-local range. Using startDateTime/endDateTime here also returns
    // long-running events that started years ago, so localStartDateTime is used.
    // Always send both bounds (open-ended '*' ranges are less reliable).
    const today = new Date().toLocaleDateString('en-CA')
    const from = `${filters.dateFrom || today}T00:00:00`
    const to = `${filters.dateTo || '2099-12-31'}T23:59:59`
    params.localStartDateTime = `${from},${to}`
  } else {
    params.startDateTime = nowUtc()
  }
  return params
}

export const fetchEvents = createAsyncThunk(
  'events/fetchList',
  async (_, { getState, signal, rejectWithValue }) => {
    const { page, filters } = getState().events
    try {
      return await fetchEventsPage(buildParams(filters, page), signal)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
)

export const fetchEventDetails = createAsyncThunk(
  'events/fetchOne',
  async (id, { signal, rejectWithValue }) => {
    try {
      return await fetchEventById(id, signal)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
)

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  page: 1,
  filters: defaultFilters,
  resetCount: 0, // bumped by resetFilters so uncontrolled inputs remount
  totalPages: 0,
  totalElements: 0,
  currentRequestId: null,
  detail: null,
  detailStatus: 'idle',
  detailError: null,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setPage(state, { payload }) {
      state.page = payload
    },
    setFilters(state, { payload }) {
      state.filters = { ...state.filters, ...payload }
      state.page = 1 // any filter change starts again from page 1
    },
    resetFilters(state) {
      state.filters = defaultFilters
      state.page = 1
      state.resetCount += 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, { meta }) => {
        state.status = 'loading'
        state.error = null
        state.currentRequestId = meta.requestId
      })
      .addCase(fetchEvents.fulfilled, (state, { payload, meta }) => {
        // Ignore a slow response that belongs to an older request.
        if (meta.requestId !== state.currentRequestId) return
        state.status = 'succeeded'
        state.items = payload.events
        state.totalPages = payload.totalPages
        state.totalElements = payload.totalElements
      })
      .addCase(fetchEvents.rejected, (state, { payload, meta, error }) => {
        if (meta.requestId !== state.currentRequestId || error.name === 'AbortError') return
        state.status = 'failed'
        state.error = payload ?? error.message
      })
      .addCase(fetchEventDetails.pending, (state) => {
        state.detailStatus = 'loading'
        state.detailError = null
        state.detail = null
      })
      .addCase(fetchEventDetails.fulfilled, (state, { payload }) => {
        state.detailStatus = 'succeeded'
        state.detail = payload
      })
      .addCase(fetchEventDetails.rejected, (state, { payload, error }) => {
        if (error.name === 'AbortError') return
        state.detailStatus = 'failed'
        state.detailError = payload ?? error.message
      })
  },
})

export const { setPage, setFilters, resetFilters } = eventsSlice.actions
export default eventsSlice.reducer
