#!/usr/bin/env node
/*
  scripts/recompress_product_images.js

  Recomprime retroactivamente las fotos de producto ya subidas a Storage
  (products/*): las descarga, redimensiona a máx. 1600px y reencoda a WebP
  calidad 82 con sharp, las resube, actualiza la URL en el doc de Firestore,
  y borra el archivo original si el nombre cambió.

  Uso:
    node scripts/recompress_product_images.js         # aplica los cambios
    node scripts/recompress_product_images.js --dry-run # solo reporta qué haría

  Requiere:
    - serviceAccountKey.json en la raíz del proyecto
*/

import fs from 'fs'
import path from 'path'
import process from 'process'
import admin from 'firebase-admin'
import sharp from 'sharp'

const DRY_RUN = process.argv.includes('--dry-run')
const MAX_DIMENSION = 1600
const QUALITY = 82

async function main() {
  const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json')
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('serviceAccountKey.json not found in project root.')
    process.exit(1)
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'noorfloro-1da42.firebasestorage.app',
  })

  const db = admin.firestore()
  const bucket = admin.storage().bucket()
  const productsRef = db.collection('products')

  const snapshot = await productsRef.get()
  console.log(`Productos encontrados: ${snapshot.size}${DRY_RUN ? '  (dry-run, no se aplican cambios)' : ''}\n`)

  let totalImages = 0
  let totalRecompressed = 0
  let totalSkipped = 0
  let totalBytesBefore = 0
  let totalBytesAfter = 0

  for (const doc of snapshot.docs) {
    const data = doc.data()
    const images = Array.isArray(data.images) ? data.images : []
    if (images.length === 0) continue

    const newImages = []
    let changed = false

    for (const url of images) {
      totalImages++
      const filePath = storagePathFromUrl(url)

      if (!filePath || !filePath.startsWith('products/')) {
        // No es una URL de nuestro bucket (ej. placeholder externo): dejar igual.
        newImages.push(url)
        continue
      }

      if (filePath.endsWith('.webp')) {
        totalSkipped++
        newImages.push(url)
        continue
      }

      try {
        const file = bucket.file(filePath)
        const [buffer] = await file.download()

        const compressed = await sharp(buffer)
          .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toBuffer()

        if (compressed.length >= buffer.length) {
          console.log(`  [${doc.id}] ${filePath} (${kib(buffer.length)}) → sin mejora (${kib(compressed.length)}), se omite`)
          totalSkipped++
          newImages.push(url)
          continue
        }

        totalBytesBefore += buffer.length
        totalBytesAfter += compressed.length

        const newPath = filePath.replace(/\.[^./]+$/, '') + '.webp'
        console.log(`  [${doc.id}] ${filePath} (${kib(buffer.length)}) → ${newPath} (${kib(compressed.length)})`)

        if (!DRY_RUN) {
          const newFile = bucket.file(newPath)
          await newFile.save(compressed, { contentType: 'image/webp' })
          await newFile.makePublic()
          await file.delete().catch(() => {})
        }

        const newUrl = publicUrl(bucket.name, newPath)
        newImages.push(newUrl)
        changed = true
        totalRecompressed++
      } catch (err) {
        console.error(`  [${doc.id}] error con ${filePath}: ${err.message}`)
        newImages.push(url)
      }
    }

    if (changed && !DRY_RUN) {
      await doc.ref.update({ images: newImages })
    }
  }

  console.log(`\nTotal imágenes: ${totalImages}`)
  console.log(`Recomprimidas: ${totalRecompressed}`)
  console.log(`Ya en WebP (omitidas): ${totalSkipped}`)
  if (totalRecompressed > 0) {
    console.log(`Peso antes: ${kib(totalBytesBefore)}  →  después: ${kib(totalBytesAfter)}  (ahorro ${kib(totalBytesBefore - totalBytesAfter)})`)
  }
  process.exit(0)
}

function kib(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`
}

function storagePathFromUrl(url) {
  try {
    const u = new URL(url)
    const match = u.pathname.match(/\/o\/(.+)$/)
    if (!match) return null
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

function publicUrl(bucketName, filePath) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`
}

main().catch(err => {
  console.error('Error en la migración:', err)
  process.exit(1)
})
