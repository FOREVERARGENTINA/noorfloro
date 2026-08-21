'use client'

// Firebase initialization and helpers for admin writes, Auth, and Storage.
import { initializeApp, getApps, getApp } from 'firebase/app'
export { getProducts, getProductById, getFeaturedProducts } from '@/lib/publicProducts'

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

let _db, _auth, _storage

async function getDb() {
  if (!_db) {
    const { getFirestore } = await import('firebase/firestore')
    _db = getFirestore(app)
  }
  return _db
}

export async function getAuthInstance() {
  if (!_auth) {
    const { getAuth } = await import('firebase/auth')
    _auth = getAuth(app)
  }
  return _auth
}

async function getStorageInstance() {
  if (!_storage) {
    const { getStorage } = await import('firebase/storage')
    _storage = getStorage(app)
  }
  return _storage
}

export async function addProduct(product) {
  const { collection, addDoc } = await import('firebase/firestore')
  const db = await getDb()
  const ref = await addDoc(collection(db, 'products'), product)
  return ref.id
}

export async function updateProduct(id, data) {
  const { doc, updateDoc } = await import('firebase/firestore')
  const db = await getDb()
  await updateDoc(doc(db, 'products', id), data)
}

export async function setProduct(id, data) {
  const { doc, setDoc } = await import('firebase/firestore')
  const db = await getDb()
  await setDoc(doc(db, 'products', id), data)
}

export async function deleteProduct(id) {
  const { doc, deleteDoc } = await import('firebase/firestore')
  const db = await getDb()
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
  const { ref: storageRef, uploadBytes, getDownloadURL } = await import('firebase/storage')
  const storage = await getStorageInstance()
  const compressed = await compressImage(file)
  const isWebp = compressed.type === 'image/webp'
  const finalName = isWebp ? fileName.replace(/\.[^.]+$/, '') + '.webp' : fileName
  const ref = storageRef(storage, `products/${finalName}`)
  const snapshot = await uploadBytes(ref, compressed, { contentType: compressed.type })
  return await getDownloadURL(snapshot.ref)
}

export default app
