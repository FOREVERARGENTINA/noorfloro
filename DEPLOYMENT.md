# Guia de Deployment - Cloudflare Workers + Firebase

Este proyecto usa Cloudflare Workers (OpenNext) y Firebase para datos e imagenes.

## 1) Firebase
1. Crear proyecto en Firebase.
2. Habilitar Firestore, Storage y Auth (email/password).
3. Aplicar reglas desde `firestore.rules` y `storage.rules`.

## 2) Variables de entorno
Configurar en Cloudflare (o en el CI):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_SITE_URL=https://tu-dominio
```

## 3) Deploy
Automatico:
- Ver `COMO_DEPLOYAR.md`

Manual:
```bash
npm run pages:build
npx wrangler deploy
```

Nota: este repo esta preparado para Workers (no Pages).
Ver `CLOUDFLARE_WORKERS_VS_PAGES.md`.
