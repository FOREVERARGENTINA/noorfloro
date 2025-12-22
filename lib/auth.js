// Simple authentication system for admin
// In production, use Supabase Auth or similar

const ADMIN_CREDENTIALS = {
  email: 'admin@tutienda.com',
  password: 'admin123', // CAMBIAR EN PRODUCCIÓN
}

export function validateAdminCredentials(email, password) {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password
}

export function setAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminSession', JSON.stringify({
      authenticated: true,
      timestamp: Date.now(),
    }))
  }
}

export function getAdminSession() {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('adminSession')
    if (!session) return null

    const parsed = JSON.parse(session)

    // Session expires after 24 hours
    const expirationTime = 24 * 60 * 60 * 1000 // 24 hours
    if (Date.now() - parsed.timestamp > expirationTime) {
      clearAdminSession()
      return null
    }

    return parsed
  }
  return null
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminSession')
  }
}

export function isAdminAuthenticated() {
  const session = getAdminSession()
  return session && session.authenticated
}
