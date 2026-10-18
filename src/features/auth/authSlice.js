import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { load } from '../../utils/storage'
import { hashPassword, makeSalt } from '../../utils/hash'

export const USERS_KEY = 'eventide_users'
export const SESSION_KEY = 'eventide_session'

const initialState = {
  users: load(USERS_KEY, []), // [{ id, name, email, salt, passwordHash }]
  currentUser: load(SESSION_KEY, null), // { id, name, email }
  status: 'idle', // idle | loading
  error: null,
}

const publicUser = ({ id, name, email }) => ({ id, name, email })

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { getState, rejectWithValue }) => {
    const normalized = email.trim().toLowerCase()
    if (getState().auth.users.some((u) => u.email === normalized)) {
      return rejectWithValue('An account with this email already exists')
    }
    const salt = makeSalt()
    return {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      salt,
      passwordHash: await hashPassword(password, salt),
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { getState, rejectWithValue }) => {
    const normalized = email.trim().toLowerCase()
    const user = getState().auth.users.find((u) => u.email === normalized)
    if (!user) return rejectWithValue('Invalid email or password')
    const hash = await hashPassword(password, user.salt)
    if (hash !== user.passwordHash) return rejectWithValue('Invalid email or password')
    return publicUser(user)
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(registerUser.fulfilled, (s, { payload }) => {
        s.status = 'idle'
        s.users.push(payload)
        s.currentUser = publicUser(payload) // sign in straight after sign up
      })
      .addCase(registerUser.rejected, (s, { payload }) => {
        s.status = 'idle'
        s.error = payload ?? 'Could not create account'
      })
      .addCase(loginUser.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.status = 'idle'
        s.currentUser = payload
      })
      .addCase(loginUser.rejected, (s, { payload }) => {
        s.status = 'idle'
        s.error = payload ?? 'Could not log in'
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export const selectCurrentUser = (state) => state.auth.currentUser
export default authSlice.reducer
