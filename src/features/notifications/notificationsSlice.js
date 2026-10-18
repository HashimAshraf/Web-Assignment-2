import { createSlice, nanoid } from '@reduxjs/toolkit'

// Short-lived toast messages shown after actions like registering.
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {
    notify: {
      reducer(state, { payload }) {
        state.items.push(payload)
      },
      prepare(message, type = 'success') {
        return { payload: { id: nanoid(), message, type } }
      },
    },
    dismiss(state, { payload }) {
      state.items = state.items.filter((n) => n.id !== payload)
    },
  },
})

export const { notify, dismiss } = notificationsSlice.actions
export default notificationsSlice.reducer
