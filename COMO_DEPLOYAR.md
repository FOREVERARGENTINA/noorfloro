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

## Importante

- ✅ Usamos **Vercel** para hosting
- ✅ Deploy automático desde GitHub
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

**Deploy manual si es necesario:**
```bash
npx vercel --prod
```
