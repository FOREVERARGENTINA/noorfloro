import { getAuthInstance } from '@/lib/firebase'

export async function loginAdmin(email, password) {
  const { signInWithEmailAndPassword, signOut } = await import('firebase/auth')
  const auth = await getAuthInstance()
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const token = await credential.user.getIdTokenResult(true)
  const isAdmin = token.claims?.admin === true || token.claims?.role === 'admin'

  if (!isAdmin) {
    await signOut(auth)
    throw new Error('No autorizado: el usuario no tiene rol admin.')
  }

  return credential.user
}

export async function logoutAdmin() {
  const { signOut } = await import('firebase/auth')
  const auth = await getAuthInstance()
  await signOut(auth)
}

export function onAdminAuthChanged(callback) {
  let unsubscribed = false
  let unsubscribe = () => { unsubscribed = true }

  Promise.all([import('firebase/auth'), getAuthInstance()]).then(([{ onAuthStateChanged }, auth]) => {
    if (unsubscribed) return
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        callback(null, false)
        return
      }

      try {
        const token = await user.getIdTokenResult()
        const isAdmin = token.claims?.admin === true || token.claims?.role === 'admin'
        callback(user, isAdmin)
      } catch (error) {
        console.error('Error checking admin role:', error)
        callback(user, false)
      }
    })
  })

  return () => unsubscribe()
}
