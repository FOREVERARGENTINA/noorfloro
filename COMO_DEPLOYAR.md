# Cómo Hacer Deploy - NOORFLORO

## El Proceso (3 pasos simples)

### 1. Haz tus cambios en el código
Edita lo que necesites: components, app, styles, etc.

### 2. Sube los cambios a GitHub
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### 3. Deploy automático
**GitHub Actions hace el deploy automáticamente** cuando haces `git push` a `main`.

- ✅ Ve el progreso en: https://github.com/FOREVERARGENTINA/noorfloro/actions
- ✅ Tarda 2-3 minutos
- ✅ Cuando termine, tus cambios están en vivo

## URL de Producción

**https://noorfloro.foreverargentina.workers.dev/**

## ¿Cómo Funciona?

1. Haces `git push` → GitHub recibe tus cambios
2. GitHub Actions ejecuta `.github/workflows/deploy.yml`
3. El workflow:
   - Instala dependencias (`npm ci`)
   - Hace build con OpenNext (`npm run pages:build`)
   - Despliega a Cloudflare Workers (`npx wrangler deploy`)
4. Tu sitio se actualiza automáticamente

## Deploy Manual (solo si es necesario)

```bash
npm run pages:build
npx wrangler deploy
```

## Importante

- ✅ Usamos **Cloudflare Workers** (NO Pages)
- ✅ Deploy automático desde GitHub (NO manual)
- ✅ Cada push a `main` = deploy automático
- ✅ Si no ves cambios, verifica que hiciste commit y push

## Troubleshooting

**No veo mis cambios en el sitio:**
```bash
# Verifica que commiteaste todo:
git status

# Si hay cambios sin commitear:
git add .
git commit -m "Mis cambios"
git push
```

**Ver logs del último deploy:**
- Ve a: https://github.com/FOREVERARGENTINA/noorfloro/actions
- Click en el último workflow
- Revisa los logs de cada paso
