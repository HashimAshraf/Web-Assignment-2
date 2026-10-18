// Salted SHA-256 so plain passwords are never stored. Frontend simulation only.
export async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function makeSalt() {
  return crypto.randomUUID().replace(/-/g, '')
}
