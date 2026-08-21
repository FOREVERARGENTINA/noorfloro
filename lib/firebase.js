'use client'

// Firebase initialization and helpers for Firestore, Auth, and Storage
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

// Require env vars to avoid accidentally pointing to the wrong project.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
}

const missingEnv = [
  ['NEXT_PUBLIC_FIREBASE_API_KEY', firebaseConfig.apiKey],
  ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain],
  ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', firebaseConfig.projectId],
  ['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket],
  ['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId],
  ['NEXT_PUBLIC_FIREBASE_APP_ID', firebaseConfig.appId],
].filter(([, value]) => !value)

if (missingEnv.length > 0) {
  const missingNames = missingEnv.map(([name]) => name).join(', ')
  throw new Error(`Missing required env var(s): ${missingNames}`)
}

// Initialize (named) app to avoid collisions if the main project has multiple sites
let app
try {
  // Try to get the named app first
  app = getApp('noorfloro')
} catch (err) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig, 'noorfloro')
  } else {
    // If other apps exist, initialize a named instance
    app = initializeApp(firebaseConfig, 'noorfloro')
  }
}

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Basic Firestore helpers for products
const productsCollection = collection(db, 'products')
const firestoreRestBase = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`
const firestoreRestKey = firebaseConfig.apiKey ? `key=${encodeURIComponent(firebaseConfig.apiKey)}` : ''

export async function getProducts() {
  const documents = []
  let pageToken = ''

  do {
    const params = new URLSearchParams({
      pageSize: '300',
      ...(pageToken ? { pageToken } : {}),
    })

    const data = await fetchFirestoreRest(`products?${params.toString()}`)
    documents.push(...(data.documents || []))
    pageToken = data.nextPageToken || ''
  } while (pageToken)

  return documents.map(firestoreRestDocumentToProduct)
}

export async function getProductById(id) {
  try {
    const data = await fetchFirestoreRest(`products/${encodeURIComponent(id)}`)
    return firestoreRestDocumentToProduct(data)
  } catch (error) {
    if (error?.status !== 404) {
      throw error
    }
  }

  const matches = await queryProductsByField('slug', id, 1)
  return matches[0] || null
}

export async function addProduct(product) {
  const ref = await addDoc(productsCollection, product)
  return ref.id
}

export async function updateProduct(id, data) {
  const d = doc(db, 'products', id)
  await updateDoc(d, data)
}

export async function setProduct(id, data) {
  const d = doc(db, 'products', id)
  await setDoc(d, data)
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id))
}

// Downscale + re-encode as WebP client-side so product photos aren't uploaded at full camera resolution.
async function compressImage(file, maxDimension = 1600, quality = 0.82) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality))
  return blob || file
}

// Upload image to Storage under products/ and return public URL
export async function uploadProductImage(file, fileName) {
  const compressed = await compressImage(file)
  const isWebp = compressed.type === 'image/webp'
  const finalName = isWebp ? fileName.replace(/\.[^.]+$/, '') + '.webp' : fileName
  const ref = storageRef(storage, `products/${finalName}`)
  const snapshot = await uploadBytes(ref, compressed, { contentType: compressed.type })
  return await getDownloadURL(snapshot.ref)
}

// Example query helper
export async function getFeaturedProducts(limit = 10) {
  return queryProductsByField('featured', true, limit)
}

export default app

function sanitizeFirestoreData(value) {
  if (value === null || value === undefined) return value

  if (Array.isArray(value)) {
    return value.map(item => sanitizeFirestoreData(item))
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'object') {
    if (typeof value.toMillis === 'function') {
      return value.toMillis()
    }

    const output = {}
    for (const [key, val] of Object.entries(value)) {
      output[key] = sanitizeFirestoreData(val)
    }
    return output
  }

  return value
}

async function fetchFirestoreRest(path, options = {}) {
  const separator = path.includes('?') ? '&' : '?'
  const pathPrefix = path.startsWith(':') ? '' : '/'
  const url = `${firestoreRestBase}${pathPrefix}${path}${firestoreRestKey ? `${separator}${firestoreRestKey}` : ''}`
  const response = await fetch(url, options)

  if (!response.ok) {
    const error = new Error(`Firestore REST request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.json()
}

async function queryProductsByField(field, value, resultLimit) {
  const body = {
    structuredQuery: {
      from: [{ collectionId: 'products' }],
      where: {
        fieldFilter: {
          field: { fieldPath: field },
          op: 'EQUAL',
          value: jsToFirestoreRestValue(value),
        },
      },
      limit: resultLimit,
    },
  }

  const data = await fetchFirestoreRest(':runQuery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  return data
    .map(result => result.document)
    .filter(Boolean)
    .map(firestoreRestDocumentToProduct)
}

function firestoreRestDocumentToProduct(documentData) {
  const id = decodeURIComponent(documentData.name.split('/').pop())
  return sanitizeFirestoreData({
    id,
    ...firestoreRestFieldsToJs(documentData.fields || {}),
  })
}

function firestoreRestFieldsToJs(fields) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, firestoreRestValueToJs(value)])
  )
}

function firestoreRestValueToJs(value) {
  if ('nullValue' in value) return null
  if ('booleanValue' in value) return value.booleanValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return value.doubleValue
  if ('timestampValue' in value) return value.timestampValue
  if ('stringValue' in value) return value.stringValue
  if ('bytesValue' in value) return value.bytesValue
  if ('referenceValue' in value) return value.referenceValue
  if ('geoPointValue' in value) return value.geoPointValue
  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map(item => firestoreRestValueToJs(item))
  }
  if ('mapValue' in value) {
    return firestoreRestFieldsToJs(value.mapValue.fields || {})
  }
  return undefined
}

function jsToFirestoreRestValue(value) {
  if (value === null) return { nullValue: null }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (Number.isInteger(value)) return { integerValue: value }
  if (typeof value === 'number') return { doubleValue: value }
  return { stringValue: String(value) }
}
