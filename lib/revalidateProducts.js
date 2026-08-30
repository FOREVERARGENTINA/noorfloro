'use server'

import { revalidatePath } from 'next/cache'

/**
 * Publica los cambios del catalogo sin esperar la revalidacion de 1h.
 *
 * Una Server Action se compila a un endpoint HTTP invocable desde el
 * navegador: no alcanza con que solo la llame el admin, hay que verificar
 * el ID token contra el mismo custom claim que usan las reglas de Firestore.
 *
 * firebase-admin se carga aca dentro a proposito: solo corre al guardar en
 * el admin, nunca en el render publico del catalogo (que lee por REST).
 */
export async function revalidateProducts(idToken, slug) {
  if (!idToken) {
    return { ok: false, error: 'Falta el token de sesion' }
  }

  try {
    const { getApps, initializeApp, cert } = await import('firebase-admin/app')
    const { getAuth } = await import('firebase-admin/auth')

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    if (!serviceAccountJson) {
      return { ok: false, error: 'FIREBASE_SERVICE_ACCOUNT_JSON no configurado' }
    }

    const app = getApps().find(a => a.name === 'revalidate')
      || initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) }, 'revalidate')

    const decoded = await getAuth(app).verifyIdToken(idToken)
    const isAdmin = decoded.admin === true || decoded.role === 'admin'

    if (!isAdmin) {
      return { ok: false, error: 'No autorizado' }
    }
  } catch (error) {
    console.error('Error verificando el token en revalidateProducts:', error)
    return { ok: false, error: 'Token invalido' }
  }

  // El listado y el sitemap siempre: un producto nuevo no existe todavia
  // como ruta, y sin esto no aparece hasta la proxima revalidacion.
  revalidatePath('/productos')
  revalidatePath('/sitemap.xml')
  if (slug) {
    revalidatePath(`/producto/${slug}`)
  }

  return { ok: true }
}
