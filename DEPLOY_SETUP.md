# GitHub Auto-Deploy Setup

## Paso 1: Crear Cloudflare API Token con Permisos Correctos

1. Ve a: https://dash.cloudflare.com/profile/api-tokens
2. Click en **"Create Token"**
3. Usa la plantilla **"Edit Cloudflare Workers"**
4. **IMPORTANTE - Verifica estos permisos:**
   - ✅ Account → Workers Scripts → Edit
   - ✅ Account → Workers Routes → Edit (si usas rutas)
   - ✅ Account → Account Settings → Read
   - ✅ User → User Details → Read (para evitar warnings)
5. Click **"Continue to summary"**
6. Click **"Create Token"**
7. **COPIA EL TOKEN** (solo se muestra una vez)

## Paso 2: Actualizar GitHub Secrets

1. Ve a tu repositorio en GitHub: https://github.com/FOREVERARGENTINA/noorfloro
2. Click en **Settings** (pestaña superior)
3. En el menú lateral izquierdo: **Secrets and variables** → **Actions**

### Actualizar/Crear Secret 1:
- **Name:** `CF_API_TOKEN`
- **Value:** [Pega el token que copiaste con los permisos correctos]
- Si ya existe: Click en el secret → **Update** → Pega el nuevo token
- Si no existe: Click **"New repository secret"** → Crea el secret

### Verificar Secret 2:
- **Name:** `CF_ACCOUNT_ID`
- **Value:** `df184896be146d6f9dbb801fe0eabca1`
- Este debería estar correcto, pero verifícalo

## Paso 3: ¡Listo!

Ahora cada vez que hagas `git push` a la rama `main`, GitHub automáticamente:
1. Instala dependencias
2. Hace build con OpenNext
3. Despliega a Cloudflare Workers

## Verificar el deployment:

- Ve a: **Actions** en tu repo de GitHub
- Verás el workflow corriendo cada vez que hagas push
- URL del sitio: https://noorfloro.foreverargentina.workers.dev

## Comandos útiles:

```bash
# Deploy manual (si lo necesitas):
npm run pages:build
npx wrangler deploy

# Ver logs en tiempo real:
npx wrangler tail
```
