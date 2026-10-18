const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateName(name) {
  const v = name.trim()
  if (!v) return 'Name is required'
  if (v.length < 2) return 'Name must be at least 2 characters'
  return ''
}

export function validateEmail(email) {
  const v = email.trim()
  if (!v) return 'Email is required'
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Use at least one letter and one number'
  }
  return ''
}

export function validateConfirm(password, confirm) {
  if (!confirm) return 'Please confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return ''
}
