import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchEventsPage, fetchEventById } from '../../services/ticketmaster'

export const PAGE_SIZE = 12

// Only "now" in exact UTC, so events that already started elsewhere are hidden.
const nowUtc = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

export const fetchEvents = createAsyncThunk(
  'events/fetchList',
  async (_, { getState, signal, rejectWithValue }) => {
    const { page } = getState().events
    try {
      return await fetchEventsPage(
        {
          startDateTime: nowUtc(),
          sort: 'date,asc',
          size: PAGE_SIZE,
          page: page - 1,
        },
        signal,
      )
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

export const { setPage } = eventsSlice.actions
export default eventsSlice.reducer
