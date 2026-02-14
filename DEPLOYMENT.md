# Guia de Deployment - Vercel + Firebase

Este proyecto usa Vercel para hosting y Firebase para datos e imagenes.

## 1) Firebase
1. Crear proyecto en Firebase.
2. Habilitar Firestore, Storage y Auth (email/password).
3. Aplicar reglas desde `firestore.rules` y `storage.rules`.

## 2) Variables de entorno
Configurar en Vercel:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_SITE_URL=https://noorfloro.com.ar
```

## 3) Deploy
Automático con git push:
- Ver `COMO_DEPLOYAR.md`

Manual (si es necesario):
```bash
npx vercel --prod
```
