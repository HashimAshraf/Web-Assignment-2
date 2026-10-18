import { useId } from 'react'
import './FormField.css'

export default function FormField({ label, error, hint, ...inputProps }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={error ? 'field__input field__input--error' : 'field__input'}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        {...inputProps}
      />
      {error ? (
        <p className="field__error" id={`${id}-err`} role="alert">{error}</p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </div>
  )
}
