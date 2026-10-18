import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dismiss } from '../features/notifications/notificationsSlice'
import './Toaster.css'

function Toast({ toast }) {
  const dispatch = useDispatch()
  useEffect(() => {
    const t = setTimeout(() => dispatch(dismiss(toast.id)), 3500)
    return () => clearTimeout(t)
  }, [dispatch, toast.id])

  return (
    <div className={`toast toast--${toast.type}`} role="status">
      <span>{toast.message}</span>
      <button aria-label="Dismiss" onClick={() => dispatch(dismiss(toast.id))}>&times;</button>
    </div>
  )
}

export default function Toaster() {
  const items = useSelector((s) => s.notifications.items)
  return (
    <div className="toaster" aria-live="polite">
      {items.map((t) => <Toast key={t.id} toast={t} />)}
    </div>
  )
}
