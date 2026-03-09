#!/usr/bin/env node
/*
  scripts/migrate_categories.js

  Migra los campos `category` de los productos en Firestore a los nuevos IDs unificados:

    pisos-flotante-7mm       → pisos-flotantes
    pisos-flotante-8mm       → pisos-flotantes
    cesped-sintetico-10mm    → cesped-sintetico
    cesped-sintetico-20mm    → cesped-sintetico
    cesped-sintetico-30mm    → cesped-sintetico
    felpudos-coco-60x90-lisos → felpudos-coco
    felpudos-coco-40x60-lisos → felpudos-coco
    felpudos-coco-40x60-dibujo → felpudos-coco

  Uso:
    node scripts/migrate_categories.js

  Requiere:
    - Node >= 18
    - npm install firebase-admin  (ya instalado si usaste migrate_products_to_firestore.js)
    - serviceAccountKey.json en la raíz del proyecto
*/

import fs from 'fs'
import path from 'path'
import process from 'process'
import admin from 'firebase-admin'

const CATEGORY_MAP = {
  'pisos-flotante-7mm': 'pisos-flotantes',
  'pisos-flotante-8mm': 'pisos-flotantes',
  'cesped-sintetico-10mm': 'cesped-sintetico',
  'cesped-sintetico-20mm': 'cesped-sintetico',
  'cesped-sintetico-30mm': 'cesped-sintetico',
  'felpudos-coco-60x90-lisos': 'felpudos-coco',
  'felpudos-coco-40x60-lisos': 'felpudos-coco',
  'felpudos-coco-40x60-dibujo': 'felpudos-coco',
}

async function main() {
  // Inicializar Firebase Admin
  const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json')
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('serviceAccountKey.json not found in project root.')
    process.exit(1)
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  const db = admin.firestore()
  const productsRef = db.collection('products')

  console.log('Buscando productos con categorías viejas...\n')

  const oldCategoryIds = Object.keys(CATEGORY_MAP)
  let totalUpdated = 0

  for (const oldId of oldCategoryIds) {
    const newId = CATEGORY_MAP[oldId]
    const snapshot = await productsRef.where('category', '==', oldId).get()

    if (snapshot.empty) {
      console.log(`  [${oldId}] → sin productos, se omite.`)
      continue
    }

    const batch = db.batch()
    snapshot.forEach(doc => {
      console.log(`  [${oldId}] → [${newId}]  doc: ${doc.id}`)
      batch.update(doc.ref, { category: newId })
    })
    await batch.commit()
    totalUpdated += snapshot.size
    console.log(`  ✓ ${snapshot.size} producto(s) actualizado(s)\n`)
  }

  console.log(`\nMigración completa. Total actualizados: ${totalUpdated}`)
  process.exit(0)
}

main().catch(err => {
  console.error('Error en la migración:', err)
  process.exit(1)
})
