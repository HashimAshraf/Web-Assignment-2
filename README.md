# Eventide - Event Management System

A React single-page app for exploring live events, registering for them and managing your bookings.
Built for Web Programming Assignment 2 with **React, Redux Toolkit, React Router** and the
**Ticketmaster Discovery API**.

## Features

- **Authentication (frontend simulation)** - register, log in, log out. Passwords are salted and hashed
  with SHA-256 (Web Crypto) before being stored. The session survives a page refresh via `localStorage`.
- **Explore events** - live data from Ticketmaster with debounced keyword search, city and country filters,
  date range, sorting, category chips and pagination. Upcoming events are shown by default.
- **Event details** - image, date and time, venue, address with map link, category, price range, notes,
  featured artists, seat map and a link to buy tickets.
- **Registration** - register, duplicate registration is prevented, toast feedback, cancel with confirmation.
  Registrations belong to the logged-in user.
- **My Events** - your registrations split into Upcoming and Completed; upcoming ones can be cancelled.
- **Protected routes** - My Events needs a login; Login/Register are hidden once signed in. Guests who try to
  register are sent to Login and returned to the event afterwards.
- **UI** - responsive layout, reusable components, skeleton loaders, error states with retry, empty states
  and form validation.

## Tech stack

React 18, Vite, Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`, `createSelector`),
React Redux, React Router 6, plain CSS.

## Getting started

1. Get a free Consumer Key at https://developer.ticketmaster.com/
2. Install and configure:

   ```bash
   git clone <this-repository-url>
   cd <folder>
   npm install
   cp .env.example .env
   ```

3. Put your key in `.env`:

   ```
   VITE_TM_API_KEY=your_ticketmaster_consumer_key
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

   Open the URL printed in the terminal (usually http://localhost:5173).

Other scripts: `npm run build` (production build), `npm run preview` (serve the build).

> `.env` is git-ignored. Never commit your API key. Restart the dev server after editing `.env`.

## Project structure

```
src/
  app/store.js                   configureStore + localStorage persistence
  features/
    auth/authSlice.js            users, session, register/login thunks
    events/eventsSlice.js        list, filters, pagination, details
    registrations/               per-user registrations, duplicate guard, selectors
    notifications/               toast messages
  services/ticketmaster.js       all API calls and response normalisation
  components/                    Navbar, EventCard, FilterBar, Pagination, RegisterButton, ...
  pages/                         Home, Events, EventDetails, MyEvents, Login, Register, NotFound
  utils/                         validators, dates, hash, storage, useDebounce
```

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home | public |
| `/events` | Explore, search, filter | public |
| `/events/:id` | Event details, register/cancel | public (registering needs login) |
| `/my-events` | Your registrations | logged-in only |
| `/login`, `/register` | Auth forms | logged-out only |
| `*` | 404 | public |

## Design notes

- **Stale responses**: each list request stores its `requestId`; the reducer ignores any response that is not
  from the latest request, and in-flight requests are aborted when inputs change.
- **Rate limit**: the API allows 2 requests/second, so search and city inputs are debounced (450 ms).
- **Date handling**: "upcoming" uses the exact UTC `startDateTime`; a picked date range uses venue-local
  `localStartDateTime`, so events are not shifted by time zone and long-running old events do not leak in.
- **Event snapshot**: a registration stores a snapshot of the event so My Events works without refetching.
- **Limitation**: authentication is simulated in the browser (no server), so it is not real security.
