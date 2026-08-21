# Cómo Hacer Deploy - NOORFLORO

## El Proceso (2 pasos simples)

### 1. Haz tus cambios en el código
Edita lo que necesites: components, app, styles, etc.

### 2. Sube los cambios a GitHub
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Deploy automático
**Vercel hace el deploy automáticamente** cuando haces `git push` a `main`.

- ✅ Tarda 1-2 minutos
- ✅ Cuando termine, tus cambios están en vivo

## ¿Cómo Funciona?

1. Haces `git push` → GitHub recibe tus cambios
2. Vercel detecta el push automáticamente
3. Vercel:
   - Instala dependencias
   - Hace build (`npm run build`)
   - Despliega a producción
4. Tu sitio se actualiza automáticamente

## Deploy Manual (solo si es necesario)

Si Vercel no está configurado para deploy automático:
```bash
npx vercel --prod
```

Si el CLI responde `Error: Not authorized` o `Could not retrieve Project Settings`,
la sesión local no está logueada. Solucionalo con:
```bash
npx vercel login
```
Esto abre el navegador para autenticar. Confirmá la sesión con `npx vercel whoami`
y volvé a correr `npx vercel --prod`.

## Importante

- ✅ Usamos **Vercel** para hosting
- ✅ Deploy automático desde GitHub (cuando la integración Git está conectada)
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

Si ya hiciste push pero el sitio sigue sin actualizarse, puede ser que el
deploy automático dejó de dispararse (pasó en agosto 2026: no había deploys
nuevos desde julio pese a varios pushes). Revisá en
https://vercel.com/hernans-projects-e0114adb/noorfloro (pestaña Deployments)
si aparece un deploy reciente para tu último commit. Si no aparece, la
integración Git puede haberse desconectado — como paso intermedio hacé un
deploy manual:
```bash
npx vercel --prod
```
y por separado revisá/reconectá la integración de GitHub en el dashboard
de Vercel (Project Settings → Git).

**Deploy manual si es necesario:**
```bash
npx vercel --prod
```
