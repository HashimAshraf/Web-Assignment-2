import { configureStore } from '@reduxjs/toolkit'
import authReducer, { USERS_KEY, SESSION_KEY } from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import registrationsReducer, { REGISTRATIONS_KEY } from '../features/registrations/registrationsSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import { save } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    notifications: notificationsReducer,
  },
})

// Persist auth and registrations to localStorage whenever they change.
let prev = store.getState()
store.subscribe(() => {
  const next = store.getState()
  if (next.auth.users !== prev.auth.users) save(USERS_KEY, next.auth.users)
  if (next.auth.currentUser !== prev.auth.currentUser) save(SESSION_KEY, next.auth.currentUser)
  if (next.registrations.items !== prev.registrations.items) {
    save(REGISTRATIONS_KEY, next.registrations.items)
  }
  prev = next
})
