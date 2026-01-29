# Project Summary

## Objetivo
Catalogo online con panel /admin para cargar productos e imagenes.
Sin carrito ni pasarela de pagos.

## Stack
- Next.js 15 + React 18 + Tailwind CSS 4
- Hosting: Cloudflare Workers (OpenNext)
- Datos: Firebase Firestore
- Imagenes: Firebase Storage
- Auth: Firebase Auth (admin)

## Estructura clave
- `app/` paginas publicas y admin
- `components/` componentes UI
- `lib/firebase.js` helpers Firestore/Storage
- `storage.rules` y `firestore.rules` reglas

## Docs
- `README.md`
- `START_HERE.md`
- `SETUP.md`
- `DEPLOYMENT.md`
