# Comandos Rápidos

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# → Abrir http://localhost:3000

# Build para producción
npm run build

# Iniciar servidor de producción
npm run start

# Limpiar caché y reinstalar
rm -rf .next node_modules package-lock.json
npm install
```

## 📁 Estructura de Archivos

```
TIENDA/
├── app/                    # Páginas Next.js
│   ├── page.js            # Página de inicio
│   ├── productos/         # Catálogo
│   ├── carrito/           # Carrito de compras
│   ├── checkout/          # Proceso de pago
│   ├── layout.js          # Layout con SEO
│   └── globals.css        # Estilos globales
│
├── components/            # Componentes React
│   ├── Header.js         # Navegación
│   ├── Footer.js         # Pie de página
│   └── ProductCard.js    # Tarjeta de producto
│
├── lib/                   # Lógica de negocio
│   ├── products.js       # Productos y helpers
│   └── mercadopago.js    # Integración MP
│
├── public/               # Assets estáticos
│   ├── images/          # Imágenes
│   └── robots.txt       # SEO
│
└── datos/               # Documentación
    ├── guia.md         # Guía de desarrollo
    ├── LIBRERIAS.txt   # Comparativa librerías
    └── tienda2025.txt  # Stack técnico
```

## 🛠️ Comandos Git

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit: Tienda online completa"
git branch -M main

# Conectar a GitHub
git remote add origin https://github.com/tu-usuario/tienda.git
git push -u origin main

# Commits frecuentes
git add .
git commit -m "feat: descripción del cambio"
git push
```

## 🧪 Testing

```bash
# Lighthouse (performance)
npm run build
npm run start
# → Abrir DevTools > Lighthouse > Analizar

# Verificar build
npm run build
# → Debe completar sin errores

# Analizar bundle size
npm run build
# → Ver output en consola
```

## 📝 Editar Contenido

### Cambiar productos

Editar: `lib/products.js`

```javascript
{
  id: 7,
  name: 'Nuevo Producto',
  description: 'Descripción completa',
  price: 9999, // En centavos (99.99 ARS)
  stock: 10,
  category: 'tecnologia',
  images: ['https://url-de-imagen.jpg'],
  featured: true
}
```

### Cambiar colores

Editar: `tailwind.config.js`

```javascript
primary: {
  600: '#TU_COLOR',
  // ...
}
```

### Cambiar meta tags SEO

Editar: `app/layout.js`

```javascript
export const metadata = {
  title: 'Tu Título',
  description: 'Tu Descripción',
  // ...
}
```

## 🖼️ Imágenes

```bash
# Ubicación
public/images/

# Nombres esperados
product-1.jpg
product-2.jpg
...
og-image.jpg (1200x630px)

# Optimizar antes de subir
# Usar: squoosh.app o tinypng.com
# Target: < 100KB por imagen
# Formato: WebP o JPG
```

## 🔧 Troubleshooting

```bash
# Error: Module not found
rm -rf node_modules package-lock.json
npm install

# Error: Port 3000 in use
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Limpiar caché Next.js
rm -rf .next
npm run dev

# Ver versión de Node
node --version
# Debe ser >= 18

# Actualizar dependencias
npm update
```

## 📦 Deployment

### Render (Recomendado)

```bash
# 1. Push a Git
git push origin main

# 2. Conectar en Render Dashboard
# → New Static Site
# → Conectar repo
# → Build: npm run build
# → Publish: .next

# 3. Variables de entorno
NEXT_PUBLIC_API_URL=https://tu-api.onrender.com
NEXT_PUBLIC_MP_PUBLIC_KEY=tu_mp_key
```

Ver `DEPLOYMENT.md` para guía completa.

## 🔍 URLs del Sitio

```
Desarrollo:
http://localhost:3000          # Inicio
http://localhost:3000/productos    # Catálogo
http://localhost:3000/carrito      # Carrito
http://localhost:3000/checkout     # Checkout

Producción:
https://tutienda.onrender.com
```

## 📊 Scripts package.json

```json
{
  "dev": "next dev",           // Desarrollo
  "build": "next build",       // Build producción
  "start": "next start",       // Servidor producción
  "lint": "next lint"          // Linter
}
```

## 🎨 Personalización Rápida

```bash
# Nombre de la tienda
# Buscar y reemplazar "TiendaOnline" en:
components/Header.js
components/Footer.js
app/layout.js

# Logo
# Agregar tu logo SVG en:
components/Header.js (línea ~20)

# Favicon
# Agregar en:
app/favicon.ico
```

## 📈 Métricas de Performance

```bash
# Target scores (Lighthouse)
Performance:     > 90
Accessibility:   > 95
Best Practices:  > 95
SEO:             > 95

# Verificar
npm run build
npm run start
# DevTools > Lighthouse
```

## 🔐 Seguridad

```bash
# Nunca commitear
.env
.env.local
node_modules/

# Siempre en .gitignore
# Ya configurado en el proyecto

# Variables sensibles
# Usar variables de entorno
# Ver .env.example
```

## 📚 Documentación

```
README.md         → Documentación completa
SETUP.md          → Guía de inicio rápido
DEPLOYMENT.md     → Deploy a producción
COMANDOS.md       → Este archivo
datos/guia.md     → Mejores prácticas
```

## 🆘 Ayuda Rápida

```bash
# ¿El servidor no arranca?
npm install
rm -rf .next
npm run dev

# ¿Las imágenes no cargan?
# Verificar next.config.js
# Verificar rutas en lib/products.js

# ¿Error de hydration?
# Revisar 'use client' en componentes
# Ver app/carrito/page.js como ejemplo

# ¿Estilos no se aplican?
rm -rf .next
npm run dev
```

## ✅ Checklist Pre-Deploy

```bash
# Verificar antes de subir a producción
[ ] npm run build → Sin errores
[ ] Imágenes optimizadas (< 100KB)
[ ] Meta tags configurados
[ ] robots.txt actualizado
[ ] .env.example creado
[ ] .gitignore configurado
[ ] README.md actualizado
[ ] Productos reales agregados
[ ] Colores personalizados
[ ] Textos personalizados
[ ] Git commit realizado
```

---

**¿Primera vez?** → Leer `SETUP.md`
**¿Deploy?** → Leer `DEPLOYMENT.md`
**¿Problemas?** → Ver sección Troubleshooting arriba
