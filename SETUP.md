# Guía de Setup Rápido

## Inicio Rápido (5 minutos)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Agregar imágenes de productos

Las imágenes están referenciadas en `lib/products.js`. Puedes:

**Opción A: Usar placeholders temporales**

Por ahora los productos usan rutas como `/images/product-1.jpg`. Puedes:
1. Agregar tus propias imágenes JPG en `public/images/`
2. Nombrarlas: `product-1.jpg`, `product-2.jpg`, etc.

**Opción B: Usar URLs externas temporalmente**

Editar `lib/products.js` y cambiar las rutas a:
```javascript
images: ['https://via.placeholder.com/400x400/0ea5e9/ffffff?text=Producto+1']
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## ✅ Verificación Rápida

Si ves esto, todo funciona:
- ✅ Página de inicio con hero section
- ✅ Header con carrito
- ✅ Productos destacados (aunque las imágenes fallen)
- ✅ Navegación funcional

## 🖼️ Agregar Imágenes Reales

### Optimizar imágenes antes de subir:

1. **Herramientas recomendadas:**
   - [Squoosh.app](https://squoosh.app) - Online, gratis
   - [TinyPNG](https://tinypng.com) - Online, gratis
   - ImageOptim (Mac) / FileOptimizer (Windows)

2. **Especificaciones:**
   - Formato: WebP (ideal) o JPG
   - Tamaño: 400x400px para productos, 1920x1080px para hero
   - Peso: < 100KB por imagen

3. **Ubicación:**
   ```
   public/images/
   ├── product-1.jpg
   ├── product-2.jpg
   ├── product-3.jpg
   ├── product-4.jpg
   ├── product-5.jpg
   ├── product-6.jpg
   └── og-image.jpg (1200x630px para Open Graph)
   ```

## 🎨 Personalizar

### Cambiar colores del tema

Editar `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#tu-color-principal',
    600: '#tu-color-principal-oscuro',
    // ...
  },
}
```

### Cambiar nombre de la tienda

Buscar y reemplazar "TiendaOnline" en:
- `components/Header.js`
- `components/Footer.js`
- `app/layout.js`
- `README.md`

### Agregar más productos

Editar `lib/products.js`:

```javascript
{
  id: 7,
  name: 'Tu Producto',
  description: 'Descripción completa',
  price: 9999,  // Precio en centavos (99.99 ARS)
  stock: 25,
  category: 'tecnologia', // o 'hogar'
  images: ['/images/tu-producto.jpg'],
  featured: false, // true para mostrar en página de inicio
}
```

### Agregar nuevas categorías

En `lib/products.js`, agregar a array `categories`:

```javascript
{ id: 'ropa', name: 'Ropa', slug: 'ropa' }
```

## 🧪 Testing Local

### Probar el carrito:

1. Ir a [http://localhost:3000/productos](http://localhost:3000/productos)
2. Agregar productos al carrito
3. Ir a [http://localhost:3000/carrito](http://localhost:3000/carrito)
4. Verificar cantidades y total
5. Ir a [http://localhost:3000/checkout](http://localhost:3000/checkout)
6. Completar formulario (simulación)

### Probar accesibilidad:

1. Instalar [axe DevTools](https://www.deque.com/axe/devtools/) (extensión Chrome/Firefox)
2. Abrir DevTools → axe DevTools → Scan
3. Verificar 0 errores críticos

### Probar responsive:

1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Probar diferentes tamaños:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

### Performance:

```bash
npm run build
npm run start
```

Abrir DevTools → Lighthouse → Analizar

Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

## 🚀 Próximos Pasos

Una vez que funcione localmente:

1. **Agregar imágenes reales** de tus productos
2. **Editar productos** en `lib/products.js` con tu catálogo
3. **Personalizar colores y textos** según tu marca
4. **Optimizar imágenes** (WebP, < 100KB)
5. **Crear repositorio Git** y hacer commit
6. **Seguir DEPLOYMENT.md** para subir a producción

---

## 🔌 Integración con Firebase (opcional)

Si quieres migrar el catálogo a Firestore y usar Firebase Storage para imágenes, sigue estos pasos:

1. Genera una cuenta de servicio en Firebase Console (IAM & Admin → Service accounts → Create private key) y descarga el JSON.
2. Localmente, crea un archivo `.env.local` (no lo subas a git) con las siguientes variables (puedes usar `.env.local.example` como referencia):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
FIREBASE_SERVICE_ACCOUNT_BASE64=... # base64 del json de la cuenta de servicio (opcional)
```

3. Instala la dependencia necesaria para correr el script de migración:

```bash
npm install firebase-admin
```

4. Ejecuta el script de migración para subir los productos desde `lib/products.js` a Firestore (idempotente, usa un slug como id):

```bash
node scripts/migrate_products_to_firestore.js
```

5. (Opcional) Si quieres subir imágenes a Storage y reemplazar las URLs, prepara un script similar que use `admin.storage()` y actualice los documentos.

6. Revisa reglas de seguridad de Firestore/Storage antes de exponer la app en producción (ejemplos y recomendaciones en `DEPLOYMENT.md`).

---


## 🐛 Problemas Comunes

### Error: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Imágenes no cargan

- Verificar que existen en `public/images/`
- Verificar nombres exactos en `lib/products.js`
- Usar rutas relativas: `/images/product.jpg` (no `./images/`)

### Estilos no se aplican

```bash
# Limpiar caché de Tailwind
rm -rf .next
npm run dev
```

### "localStorage is not defined"

- Normal en servidor Next.js
- Solo usar localStorage en componentes con `'use client'`
- Ver `components/Header.js` y `app/carrito/page.js` como ejemplos

## 📚 Documentación Adicional

- **README.md**: Documentación completa del proyecto
- **DEPLOYMENT.md**: Guía paso a paso para producción
- **datos/guia.md**: Mejores prácticas de desarrollo
- **lib/firebase.js**: Cliente Firebase con helpers documentados
- **lib/mercadopago.js**: Comentarios detallados de integración MP

## 🆘 Soporte

Si tienes problemas:

1. Verificar que Node.js >= 18
2. Verificar que todas las dependencias instalaron: `npm list`
3. Limpiar caché: `rm -rf .next node_modules && npm install`
4. Revisar console del navegador (F12) para errores JavaScript
5. Revisar terminal donde corre `npm run dev` para errores de servidor

## ✨ Características Implementadas

- ✅ Next.js 16 con App Router
- ✅ Tailwind CSS 4 mobile-first
- ✅ Sistema de carrito con localStorage
- ✅ Checkout con validación completa
- ✅ Preparado para Mercado Pago
- ✅ Accesibilidad WCAG 2.1 AA
- ✅ SEO optimizado con meta tags
- ✅ Lazy loading de imágenes
- ✅ Responsive design
- ✅ Touch-friendly (44px tap targets)
- ✅ Navegación por teclado
- ✅ Focus visible para accesibilidad
- ✅ ARIA labels descriptivos
- ✅ HTML semántico completo

---

**¡Tu tienda está lista para desarrollar!** 🎉

Sigue los pasos anteriores y en menos de 30 minutos tendrás una tienda completamente funcional.
