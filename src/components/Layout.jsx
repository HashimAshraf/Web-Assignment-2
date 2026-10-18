import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Toaster from './Toaster'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Eventide - live events powered by the Ticketmaster Discovery API</p>
      </footer>
      <Toaster />
    </>
  )
}
