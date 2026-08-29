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
inicial. Tras editar productos en `/admin`, los cambios se publican en la
siguiente revalidacion.

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
