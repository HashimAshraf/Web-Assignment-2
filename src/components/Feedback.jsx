import './Feedback.css'

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <button className="btn btn--ghost" onClick={onRetry}>Try again</button>}
    </div>
  )
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="state">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}
