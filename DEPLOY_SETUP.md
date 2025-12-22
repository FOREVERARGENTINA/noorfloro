# GitHub Auto-Deploy Setup

## Paso 1: Crear Cloudflare API Token

1. Ve a: https://dash.cloudflare.com/profile/api-tokens
2. Click en **"Create Token"**
3. Usa la plantilla **"Edit Cloudflare Workers"**
4. **Permissions:** Asegúrate de tener:
   - Account → Workers Scripts → Edit
   - Account → Account Settings → Read
5. Click **"Continue to summary"**
6. Click **"Create Token"**
7. **COPIA EL TOKEN** (solo se muestra una vez)

## Paso 2: Configurar GitHub Secrets

1. Ve a tu repositorio en GitHub: https://github.com/FOREVERARGENTINA/noorfloro
2. Click en **Settings** (pestaña superior)
3. En el menú lateral izquierdo: **Secrets and variables** → **Actions**
4. Click en **"New repository secret"**

### Agregar Secret 1:
- **Name:** `CLOUDFLARE_API_TOKEN`
- **Value:** [Pega el token que copiaste]
- Click **"Add secret"**

### Agregar Secret 2:
- **Name:** `CLOUDFLARE_ACCOUNT_ID`
- **Value:** `df184896be146d6f9dbb801fe0eabca1`
- Click **"Add secret"**

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
