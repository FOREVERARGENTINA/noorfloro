# Guia de Setup

## Desarrollo local
```bash
npm install
npm run dev
```
Abrir: http://localhost:3000

## Personalizacion rapida
- Textos y marca: `components/Header.js`, `components/Footer.js`, `app/layout.js`
- Colores: `tailwind.config.js`
- SEO: `app/layout.js`

## Productos
El catalogo se guarda en Firestore. Puedes:
- Cargar productos desde `/admin/productos`
- (Opcional) usar `scripts/migrate_products_to_firestore.js` para migrar desde `lib/products.js`

## Imagenes
Las imagenes se suben desde el admin y se guardan en Firebase Storage.

## Reglas de Firebase
Aplicar reglas desde:
- `firestore.rules`
- `storage.rules`

Para configurar Firebase y deploy ver `DEPLOYMENT.md`.
