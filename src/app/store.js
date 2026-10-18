import { configureStore } from '@reduxjs/toolkit'
import authReducer, { USERS_KEY, SESSION_KEY } from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import { save } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
})

// Persist auth to localStorage whenever the relevant slices change.
let prev = store.getState()
store.subscribe(() => {
  const next = store.getState()
  if (next.auth.users !== prev.auth.users) save(USERS_KEY, next.auth.users)
  if (next.auth.currentUser !== prev.auth.currentUser) save(SESSION_KEY, next.auth.currentUser)
  prev = next
})
