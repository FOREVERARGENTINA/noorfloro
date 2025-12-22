// Firebase initialization and helpers for Firestore, Auth, and Storage
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, getDocs, getDoc, addDoc, setDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

// Use env vars when available; fallback to the provided config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCuQXi0LS6TJ1UN2-sprZWbYliX72grg-Y',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'frandoweb-4c2c7.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'frandoweb-4c2c7',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'frandoweb-4c2c7.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '227831202965',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:227831202965:web:e69821d4543f1911f7c79c',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-8H7TLZVBST',
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
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function getProductById(id) {
  const d = await getDoc(doc(db, 'products', id))
  return d.exists() ? { id: d.id, ...d.data() } : null
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
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, limit)
}

export default app
