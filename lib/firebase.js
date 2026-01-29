'use client'

// Firebase initialization and helpers for Firestore, Auth, and Storage
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, getDocs, getDoc, addDoc, setDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
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

export async function getProducts() {
  const snap = await getDocs(productsCollection)
  return snap.docs.map(doc => sanitizeFirestoreData({ id: doc.id, ...doc.data() }))
}

export async function getProductById(id) {
  const d = await getDoc(doc(db, 'products', id))
  return d.exists() ? sanitizeFirestoreData({ id: d.id, ...d.data() }) : null
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

// Upload image to Storage under products/ and return public URL
export async function uploadProductImage(file, fileName) {
  const ref = storageRef(storage, `products/${fileName}`)
  const snapshot = await uploadBytes(ref, file)
  return await getDownloadURL(snapshot.ref)
}

// Example query helper
export async function getFeaturedProducts(limit = 10) {
  const q = query(productsCollection, where('featured', '==', true))
  const snap = await getDocs(q)
  return snap.docs
    .map(doc => sanitizeFirestoreData({ id: doc.id, ...doc.data() }))
    .slice(0, limit)
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
