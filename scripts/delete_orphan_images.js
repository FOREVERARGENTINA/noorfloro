#!/usr/bin/env node
/*
  scripts/delete_orphan_images.js

  Borra de Storage las imágenes bajo products/ que ningún documento de
  Firestore referencia (huérfanas: quedan al reemplazar fotos de un producto).

  Re-verifica contra Firestore en el momento de correr: solo borra lo que
  sigue sin estar referenciado. Nunca borra algo que esté en uso.

  Uso:
    node scripts/delete_orphan_images.js             # solo reporta (dry-run)
    node scripts/delete_orphan_images.js --apply     # borra de verdad

  Requiere:
    - serviceAccountKey.json en la raíz del proyecto
*/

import fs from 'fs'
import path from 'path'
import process from 'process'
import admin from 'firebase-admin'

const APPLY = process.argv.includes('--apply')

function storagePathFromUrl(url) {
  const m = /\/o\/([^?]+)/.exec(url || '')
  return m ? decodeURIComponent(m[1]) : null
}

const kib = (bytes) => `${(bytes / 1024).toFixed(0)} KB`

async function main() {
  const keyPath = path.join(process.cwd(), 'serviceAccountKey.json')
  if (!fs.existsSync(keyPath)) {
    console.error('Falta serviceAccountKey.json en la raíz del proyecto.')
    process.exit(1)
  }
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'noorfloro-1da42.firebasestorage.app',
  })

  const db = admin.firestore()
  const bucket = admin.storage().bucket()

  // 1. Qué imágenes están realmente en uso, ahora mismo.
  const snapshot = await db.collection('products').get()
  const used = new Set()
  for (const doc of snapshot.docs) {
    for (const url of doc.data().images || []) {
      const p = storagePathFromUrl(url)
      if (p) used.add(p)
    }
  }

  // 2. Qué hay en el bucket.
  const [files] = await bucket.getFiles({ prefix: 'products/' })

  const orphans = files.filter((f) => !used.has(f.name))
  const bytes = orphans.reduce((n, f) => n + Number(f.metadata.size || 0), 0)

  console.log(`Productos: ${snapshot.size}   imágenes en uso: ${used.size}`)
  console.log(`Objetos en products/: ${files.length}`)
  console.log(`Huérfanas: ${orphans.length}  (${(bytes / 1048576).toFixed(2)} MB)`)
  console.log(APPLY ? '\nBORRANDO...\n' : '\n(dry-run: no se borra nada; usá --apply)\n')

  let deleted = 0
  for (const f of orphans) {
    console.log(`  ${APPLY ? 'borrar' : 'borraría'}  ${kib(Number(f.metadata.size || 0))}  ${f.name}`)
    if (APPLY) {
      await f.delete()
      deleted++
    }
  }

  if (APPLY) {
    console.log(`\nBorradas ${deleted} de ${orphans.length}  (${(bytes / 1048576).toFixed(2)} MB liberados)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
