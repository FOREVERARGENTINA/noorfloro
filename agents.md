🧠 Guía para Agentes de IA — NOORFLORO (E-commerce de Pisos y Revestimientos)

Naturaleza: Reglas de decisión para asistente técnico
Principio: Delimitar, no confiar en criterio
Estado: 🚧 En construcción iterativa

🚦 Defaults Mínimos (Aplican si algo no está definido)

Hasta que este documento se complete explícitamente, el agente debe asumir:

Seguridad > todo

No tocar producción

No ejecutar deploys

No modificar datos persistentes

Ante cualquier duda → preguntar

Estos defaults no se anulan salvo que una sección posterior lo indique explícitamente.

⚖️ Jerarquía de Resolución de Conflictos

Cuando hay conflicto entre principios, el orden es:

[PRIORIDAD 1] > todo lo demás
Ej.: Seguridad de usuarios, cumplimiento legal

[PRIORIDAD 2] > [PRIORIDAD 3]
Ej.: Reglas de negocio > reglas técnicas

[PRIORIDAD 3] > [PRIORIDAD 4]
Ej.: Seguridad > velocidad

[PRIORIDAD 4] > [PRIORIDAD 5]
Ej.: Costo operativo > optimización prematura

[PRIORIDAD 5] > arquitectura sofisticada
Ej.: Simplicidad

Ejemplos de aplicación
⏳ PENDIENTE: Agregar ejemplos reales cuando aparezcan conflictos

Conflicto: [Describir caso]
Resolución: [Qué principio gana según jerarquía]

🛑 Zonas Rojas (Frenado Automático)

El agente SIEMPRE frena y consulta en estos casos.

1. [ZONA ROJA 1 – Migración de datos]
❌ Prohibido sin aprobación:
- Modificar datos existentes
- Cambiar estructuras persistentes
- Eliminar o renombrar campos

✅ Debe hacer:
1. Detener
2. Documentar el cambio propuesto
3. Explicar impacto
4. Solicitar aprobación explícita

2. [ZONA ROJA 2 – Datos sensibles]
❌ Prohibido:
- Exponer datos sensibles
- Loguear información privada

✅ Debe hacer:
1. Detener
2. Aplicar principio de mínimo acceso

3. [ZONA ROJA 3 – Impacto en costo]
❌ Prohibido sin análisis:
- Crear loops de lectura/escritura a Firestore
- Subir imágenes >5MB sin compresión
- Queries sin límite (usar .limit())
- Bulk operations sin batch

✅ Debe hacer:
1. Estimar operaciones por request
2. Firebase Free Tier: 50K reads/day, 20K writes/day
3. Si supera 10K ops/día → consultar

4. [ZONA ROJA 4 – Permisos / Auth]
❌ Prohibido:
- Exponer rutas /admin sin auth check
- Modificar firestore.rules sin revisión
- Permitir escritura pública en products
- Dar permisos admin a múltiples usuarios sin acordar

✅ Debe hacer:
1. Verificar que /admin requiera login
2. Solo 1 usuario admin (la dueña)
3. Lectura pública solo en /products
4. Escritura solo con admin claim

5. [ZONA ROJA 5 – Legal / Compliance]
❌ Prohibido opinar sobre:
- Temas legales
- Retención de datos
- Cumplimiento normativo

✅ Debe hacer:
1. Detener inmediatamente
2. Flaggear como "requiere asesoría legal"
3. No sugerir workarounds

6. [ZONA ROJA 6 – Compatibilidad de Plataforma]
❌ Prohibido sin verificar:
- Cambiar de plataforma de hosting (Vercel → otra)
- Usar Firebase SDK en entornos edge/Workers que no lo soporten
- Migrar a serverless platforms sin confirmar compatibilidad de librerías

✅ Debe hacer:
1. Verificar compatibilidad de Firebase SDK con runtime target
2. Si Firebase Client SDK: requiere Node.js runtime o browser (✅ Vercel, ❌ Cloudflare Workers)
3. Documentar limitaciones conocidas antes de proponer migración

**Lección aprendida (2026-01-29):**
- Firebase Client SDK usa eval() internamente
- Cloudflare Workers bloquea eval() por seguridad
- Vercel soporta Firebase SDK sin modificaciones
- Antes de migrar: confirmar compatibilidad de SDKs con runtime

⚠️ Regla de Incompletitud Crítica

Si una sección marcada con ⏳ afecta directamente una decisión actual, el agente debe:

Detener la acción

Explicitar qué información falta

Solicitar definición antes de continuar

El agente no debe completar vacíos críticos por inferencia.

💰 Criterios de Costo Operativo

## Firebase (Spark Plan - Gratis)
- 50K lecturas/día → ~1,600 visitas/día al catálogo
- 20K escrituras/día → Sobra para admin
- 5GB almacenamiento → Miles de imágenes
- 10GB transfer/mes

## Vercel (Hobby Plan - Gratis)
- 100GB bandwidth/mes
- Unlimited requests
- 100 deployments/día
- Serverless Functions: 100GB-Hrs compute time
- Edge Network global
- Automatic SSL

**Límites relevantes:**
- Serverless Function timeout: 10s (suficiente para este proyecto)
- Max file size: 50MB (más que suficiente)
- Build time: 45 min (Next.js build toma ~1 min)

## Antes de agregar funcionalidad nueva:
1. ¿Cuántas lecturas/escritas a Firestore genera por usuario?
2. ¿Se puede cachear en client-side?
3. ¿Vale la pena para el negocio?
4. ¿El tiempo de ejecución excede 10s? (poco probable)

Si agrega >1,000 ops/día a Firestore → consultar primero

🎯 Rol y Límites del Agente
Puede hacer (sin confirmar)

Generar código siguiendo patrones existentes

Explicar el sistema

Debuggear errores

Proponer refactors

Sugerir tests

Requiere confirmación

Cambiar configuraciones críticas

Crear entidades centrales del dominio

Instalar dependencias

Modificar permisos o roles

Cualquier acción en Zonas Rojas

Prohibido (nunca automático)

Ejecutar deploys

Tocar datos de producción

Eliminar datos persistentes

Ejecutar migraciones

🔒 Seguridad y Privacidad

## NO loguear nunca
- Información de contacto de clientes
- Mensajes de WhatsApp
- API keys de Firebase
- Datos personales
- Credenciales

## NO agregar al repositorio
- .env.local (gitignored)
- service-account.json
- FIREBASE_SERVICE_ACCOUNT_BASE64
- API keys
- Tokens

## SÍ agregar
- .env.example (template sin valores)
- firestore.rules (seguridad pública)

📦 Stack Técnico

| Capa      | Tecnología                    | Estado | Notas                          |
|-----------|-------------------------------|--------|--------------------------------|
| Frontend  | Next.js 15 + React 18         | ✅     | App Router, Client Components  |
| Estilos   | Tailwind CSS 4.x              | ✅     | Configuración personalizada    |
| Backend   | Firebase (serverless)         | ✅     | Sin backend custom             |
| DB        | Firestore                     | ✅     | Colección: products            |
| Storage   | Firebase Storage              | ✅     | Imágenes bajo /products/       |
| Auth      | Firebase Auth                 | ✅     | Login admin implementado       |
| Hosting   | Vercel                        | ✅     | Edge Network, SSR automático   |
| Deploy    | Vercel CLI                    | ✅     | npx vercel --prod              |
👥 Roles y Permisos

| Rol       | Lectura     | Escritura   | Admin Panel | Deploy     |
|-----------|-------------|-------------|-------------|------------|
| Público   | ✅ products | ❌          | ❌          | ❌         |
| Admin     | ✅ todo     | ✅ products | ✅          | ⚠️ Manual  |

**Usuario Admin:**
- Email: [email de la dueña - completar cuando se cree]
- UID: [completar cuando se cree en Firebase Auth]
- Custom claim: `admin: true` en Firestore Rules
🗄️ Modelo de Datos

## Colección: products

| Campo       | Tipo      | Descripción                           | Requerido |
|-------------|-----------|---------------------------------------|-----------|
| id          | string    | ID del documento (auto o slug)        | ✅        |
| slug        | string    | Slug opcional para URL                 | ❌        |
| name        | string    | Nombre del producto                   | ✅        |
| description | string    | Descripción larga                     | ✅        |
| price       | number    | Precio en ARS (nullable = Consultar)  | ❌        |
| stock       | number    | Cantidad disponible                   | ✅        |
| category    | string    | Categoría (ej: pisos-flotante-7mm)    | ✅        |
| images      | array     | URLs de Firebase Storage              | ✅        |
| featured    | boolean   | Mostrar en home                       | ✅        |
| createdAt   | timestamp | Fecha de creación                     | ✅        |
| updatedAt   | timestamp | Última modificación                   | ✅        |

**Reglas:**
- slug debe ser único e inmutable
- images debe tener al menos 1 URL
- stock no puede ser negativo
- category debe existir en lib/products.js

🗂️ Estructura del Proyecto

```
NOORFLORO/
├── app/
│   ├── page.js              # Home (catálogo)
│   ├── productos/page.js    # Listado completo
│   ├── producto/[id]/       # Detalle de producto
│   └── admin/
│       └── productos/       # CRUD admin (REQUIERE AUTH)
├── components/
│   ├── Header.js
│   ├── Footer.js
│   └── ProductCard.js
├── lib/
│   ├── firebase.js          # Config + helpers de Firebase
│   └── products.js          # Categorías + helpers
├── scripts/
│   └── migrate_products_to_firestore.js
├── firestore.rules          # Reglas de seguridad
└── next.config.js           # Configuración Next.js
```

🚀 Comandos Críticos

El agente prepara, el humano ejecuta

## Desarrollo
```bash
npm run dev                  # Servidor local :3000
```

## Build & Deploy a Vercel
```bash
npm run build               # Build Next.js local
npx vercel                  # Deploy a preview (staging)
npx vercel --prod           # Deploy a producción
```

## Vercel - Gestión de Variables de Entorno
```bash
npx vercel env ls                                    # Listar variables
echo "valor" | npx vercel env add VARIABLE production # Agregar variable
npx vercel env pull                                   # Descargar .env.local
```

## Firebase
```bash
npm run migrate:products    # Migrar productos a Firestore
firebase deploy --only firestore:rules  # Actualizar reglas
```

⚠️ IMPORTANTE: El agente NUNCA ejecuta deploy automáticamente

## Nota sobre Cloudflare Workers
El proyecto fue migrado de Cloudflare Workers a Vercel el 2026-01-29 debido a incompatibilidad del Firebase SDK con el runtime de Workers (error eval()). Los comandos `npm run pages:build` y `npm run pages:deploy` ya no se usan.

🎯 Contexto de Dominio

## Glosario

**Producto:** Piso, revestimiento o césped sintético que se vende por m² o caja.

**Slug:** URL amigable generada del nombre (ej: "Pisos 7mm" → /producto/pisos-7mm)

**Stock:** Cantidad disponible. Si stock=0 → no se puede consultar por WhatsApp.

**Featured:** Productos destacados que aparecen en la página principal.

**Categorías:** Agrupación de productos (ver lib/products.js). NO crear categorías nuevas sin aprobar.

**m²:** Unidad de medida principal. Precio se muestra en ARS por m² o por caja.

**Consultar:** Cuando price es null, mostrar "Consultar" en lugar de monto.

✅ Checklist Pre-Deploy

Antes de `npx vercel --prod`:

☐ npm run build ejecutado sin errores
☐ Firestore rules actualizadas si cambiaron
☐ Sin console.log en producción
☐ Imágenes optimizadas (<500KB cada una)
☐ Variables de entorno configuradas en Vercel (npx vercel env ls)
☐ Probado en local con npm run dev
☐ URLs de Firebase Storage permitidas en next.config.js
☐ Probado en preview con `npx vercel` antes de producción
☐ Aprobación del dueño del proyecto

📝 Cómo usar este template

Al iniciar un proyecto

Completar defaults

Definir 1–2 zonas rojas

Esbozar jerarquía de conflictos

A medida que el proyecto evoluciona

Cada conflicto real → se documenta

Cada riesgo → se vuelve Zona Roja

Cada decisión → se fija como regla

🎓 Principios de Documentación

Este documento NO es Un README Un tutorial Documentación exhaustiva Este documento ES Un sistema de control de decisiones Un límite explícito al comportamiento del agente

Regla de oro:
Si algo no cambia decisiones del agente, no va acá.

Última actualización: 2026-01-29
Versión: v1.1 (migración a Vercel completada)
Estado: ✅ Operativo y actualizado

## Changelog
- **v1.1 (2026-01-29):** Migración exitosa de Cloudflare Workers a Vercel. Actualizado stack técnico, comandos de deploy, y agregada ZONA ROJA 6 sobre compatibilidad de plataforma.
- **v1.0 (2026-01-28):** Versión inicial completada para NOORFLORO.
