#!/usr/bin/env node
/*
  scripts/migrate_products_to_firestore.js

  - Usage:
      node scripts/migrate_products_to_firestore.js

  - Requirements:
    * Node >= 18
    * npm install firebase-admin
    * Provide a Firebase service account via:
        - GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
      OR
        - FIREBASE_SERVICE_ACCOUNT_BASE64 (base64 encoded JSON)

  This script uploads products from `lib/products.js` into Firestore's `products` collection.
  It uses a slug derived from the product name as the document id (idempotent).
*/

import fs from 'fs'
import path from 'path'
import process from 'process'
import admin from 'firebase-admin'

async function main() {
  // load products from lib
  const productsModulePath = path.resolve(process.cwd(), 'lib', 'products.js')
  if (!fs.existsSync(productsModulePath)) {
    console.error('lib/products.js not found. Make sure you run this script from project root.')
    process.exit(1)
  }

  const { products } = await import('file://' + productsModulePath)
  if (!products || !products.length) {
    console.error('No products found in lib/products.js')
    process.exit(1)
  }

  // Initialize admin SDK
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
      const serviceAccount = JSON.parse(json)
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      admin.initializeApp({ credential: admin.credential.applicationDefault() })
    } else {
      console.error('\nFirebase service account not found. Provide one of:\n - GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json\n - FIREBASE_SERVICE_ACCOUNT_BASE64=<base64-json>\n')
      process.exit(1)
    }
  }

  const db = admin.firestore()
  const coll = db.collection('products')

  let created = 0
  let updated = 0

  for (const p of products) {
    // make simple slug-based id to be stable across runs
    const slug = (p.name || '').toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')

    const docRef = coll.doc(slug)
    const snapshot = await docRef.get()

    const payload = {
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      images: p.images || [],
      featured: !!p.featured,
      source_id: p.id || null,
      migratedAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    if (snapshot.exists) {
      await docRef.update(payload)
      updated++
      console.log(`Updated: ${slug}`)
    } else {
      await docRef.set(payload)
      created++
      console.log(`Created: ${slug}`)
    }
  }

  console.log(`\nDone. Created: ${created}  Updated: ${updated}`)
  process.exit(0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
