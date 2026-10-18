import './Pagination.css'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  // Show a window of page numbers around the current page.
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const end = Math.min(totalPages, start + 4)
  const pages = []
  for (let p = start; p <= end; p++) pages.push(p)

  return (
    <nav className="pager" aria-label="Pagination">
      <button className="pager__btn" disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
      {start > 1 && <span className="pager__gap">...</span>}
      {pages.map((p) => (
        <button
          key={p}
          className={`pager__btn ${p === page ? 'pager__btn--on' : ''}`}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="pager__gap">...</span>}
      <button className="pager__btn" disabled={page === totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  )
}
