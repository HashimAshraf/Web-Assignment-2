import { useEffect, useState } from 'react'

// The API allows 2 requests/second, so typing must not fire one per keystroke.
export default function useDebounce(value, delay = 450) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
