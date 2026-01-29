import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export async function loginAdmin(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const token = await credential.user.getIdTokenResult(true)
  const isAdmin = token.claims?.role === 'admin'

  if (!isAdmin) {
    await signOut(auth)
    throw new Error('No autorizado: el usuario no tiene rol admin.')
  }

  return credential.user
}

export async function logoutAdmin() {
  await signOut(auth)
}

export function onAdminAuthChanged(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, false)
      return
    }

    try {
      const token = await user.getIdTokenResult()
      const isAdmin = token.claims?.role === 'admin'
      callback(user, isAdmin)
    } catch (error) {
      console.error('Error checking admin role:', error)
      callback(user, false)
    }
  })
}
