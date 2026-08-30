# NOORFLORO

Catalogo online con panel /admin para cargar productos e imagenes.
Sin carrito ni pagos.

## Stack
- Next.js 15 + React 18 + Tailwind CSS 4
- Hosting: Vercel
- Database: Firebase Firestore (lectura publica via REST)
- Storage: Firebase Storage
- Auth: Firebase Auth (admin)

## Renderizado
Las paginas publicas de catalogo son Server Components con ISR (revalidate 1h):
- `/productos` es estatico; el filtro por categoria corre en el cliente.
- `/producto/[id]` es SSG via `generateStaticParams`.

El contenido indexable (nombre, descripcion, precio, stock) viaja en el HTML
inicial. Al guardar en `/admin` los cambios se publican al instante mediante
una Server Action que valida el claim de admin y revalida `/productos`,
`/sitemap.xml` y la ficha afectada. Requiere `FIREBASE_SERVICE_ACCOUNT_JSON`;
sin esa variable el catalogo se actualiza igual en la revalidacion de 1h.

## Desarrollo local
```bash
npm install
npm run dev
```
Abrir: http://localhost:3000

## Deploy
- Ver `COMO_DEPLOYAR.md` (deploy automático con git push)
- Ver `DEPLOYMENT.md` (setup Firebase + variables)

## Docs utiles
- `START_HERE.md`
- `SETUP.md`
- `LEEME_PRIMERO.md`
