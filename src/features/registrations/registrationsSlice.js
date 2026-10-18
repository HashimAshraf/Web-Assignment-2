import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import { load } from '../../utils/storage'

export const REGISTRATIONS_KEY = 'eventide_registrations'

// Each registration: { id, userId, eventId, event (snapshot), registeredAt }
// The event snapshot lets My Events render without calling the API again.
const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { items: load(REGISTRATIONS_KEY, []) },
  reducers: {
    registerForEvent: {
      reducer(state, { payload }) {
        const duplicate = state.items.some(
          (r) => r.userId === payload.userId && r.eventId === payload.eventId,
        )
        if (!duplicate) state.items.push(payload)
      },
      prepare(userId, event) {
        return {
          payload: {
            id: nanoid(),
            userId,
            eventId: event.id,
            event,
            registeredAt: new Date().toISOString(),
          },
        }
      },
    },
    cancelRegistration(state, { payload }) {
      state.items = state.items.filter(
        (r) => !(r.userId === payload.userId && r.eventId === payload.eventId),
      )
    },
  },
})

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions

const selectAll = (state) => state.registrations.items
const selectUserId = (state) => state.auth.currentUser?.id

// Only the logged-in user's registrations, newest event first handled by the page.
export const selectUserRegistrations = createSelector([selectAll, selectUserId], (items, userId) =>
  userId ? items.filter((r) => r.userId === userId) : [],
)

export const selectIsRegistered = (eventId) => (state) =>
  selectUserRegistrations(state).some((r) => r.eventId === eventId)

export default registrationsSlice.reducer
