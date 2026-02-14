# 🔧 Scripts de Encoding UTF-8

Scripts para detectar y corregir problemas de mojibake en tus proyectos.

---

## 📁 Archivos

- **`check-encoding.js`** - Detecta mojibakes
- **`fix-encoding.js`** - Corrige mojibakes automaticamente
- **`pre-build.js`** - Valida encoding antes de build (opcional)

---

## 🚀 Uso Basico

### 1. Copiar scripts al proyecto

```bash
# Copiar carpeta completa
cp -r scripts/ mi-proyecto/scripts/
```

### 2. Detectar mojibakes

```bash
node scripts/check-encoding.js
```

**Salida:**
```
========================================
   DETECTOR DE MOJIBAKES
========================================

Tipo de proyecto detectado: typeA
Directorios: public, .
Extensiones: .html, .css, .js, .json, .md

========================================
Archivos escaneados: 42

[MOJIBAKES] Archivos con problemas: 5

public/index.html
  - e con mojibake (28 ocurrencias) -> deberia ser: e
  - n con mojibake (4 ocurrencias) -> deberia ser: n

[TOTAL] 187 mojibakes en 5 archivos

[ACCION] Para corregir automaticamente:
  node scripts/fix-encoding.js          (preview)
  node scripts/fix-encoding.js --apply  (aplicar)
```

### 3. Corregir mojibakes

#### Preview (no modifica archivos)

```bash
node scripts/fix-encoding.js
```

#### Aplicar correcciones

```bash
node scripts/fix-encoding.js --apply
```

---

## 🎯 Auto-deteccion de Tipo de Proyecto

Los scripts detectan automaticamente el tipo de proyecto:

### Tipo A - Sitio Estatico
- **Detecta:** HTML puro, sin framework
- **Escanea:** `public/`, raiz
- **Extensiones:** `.html`, `.css`, `.js`, `.json`, `.md`

### Tipo B - SSG (Astro, 11ty, etc)
- **Detecta:** Presencia de `astro.config.js`
- **Escanea:** `src/`, `public/`
- **Extensiones:** `.js`, `.jsx`, `.astro`, `.css`, `.html`, `.md`

### Tipo C - Framework (Next.js, React, Vue)
- **Detecta:** Presencia de `next.config.js` o dependencia Next.js
- **Escanea:** `src/`, `app/`, `pages/`, `components/`
- **Extensiones:** `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.html`, `.md`

---

## 📦 Integracion con package.json

Agrega estos comandos a tu `package.json`:

```json
{
  "scripts": {
    "check:encoding": "node scripts/check-encoding.js",
    "fix:encoding": "node scripts/fix-encoding.js",
    "fix:encoding:apply": "node scripts/fix-encoding.js --apply",
    "prebuild": "node scripts/check-encoding.js"
  }
}
```

**Uso:**

```bash
npm run check:encoding        # Detectar mojibakes
npm run fix:encoding          # Preview correcciones
npm run fix:encoding:apply    # Aplicar correcciones
npm run build                 # Valida encoding antes de build
```

---

## 🔄 Workflow Recomendado

### Durante desarrollo:

1. **Detectar problemas:**
   ```bash
   npm run check:encoding
   ```

2. **Preview correcciones:**
   ```bash
   npm run fix:encoding
   ```

3. **Aplicar si todo OK:**
   ```bash
   npm run fix:encoding:apply
   ```

4. **Revisar cambios:**
   ```bash
   git diff
   ```

### Antes de deploy:

```bash
npm run check:encoding  # Valida que no haya mojibakes
npm run build           # Build solo si paso la validacion
```

---

## ⚙️ Pre-build Hook (Opcional)

Para validar encoding automaticamente antes de cada build:

### Opcion 1: npm prebuild script

Ya incluido si agregaste los scripts a `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/check-encoding.js",
    "build": "next build"  // o tu comando de build
  }
}
```

Ahora `npm run build` valida encoding automaticamente.

### Opcion 2: Husky pre-commit hook

```bash
npm install --save-dev husky
npx husky init
```

Editar `.husky/pre-commit`:

```bash
#!/bin/sh
node scripts/check-encoding.js || {
  echo "[ERROR] Mojibakes detectados. Ejecuta: npm run fix:encoding:apply"
  exit 1
}
```

---

## 🔍 Que Detecta

### Mojibakes comunes:

| Mojibake | Correcto | Ejemplo |
|----------|----------|---------|
| `\xC3\xA9` | e | cafe |
| `\xC3\xA1` | a | pagina |
| `\xC3\xB3` | o | funcion |
| `\xC3\xBA` | u | menu |
| `\xC3\xAD` | i | raiz |
| `\xC3\xB1` | n | nino |
| `\xC2\xBF` | signo interrogacion | Como? |
| `\xC2\xA1` | signo exclamacion | Hola! |

Y variantes en mayusculas.

---

## ❌ Que NO Hace

- ❌ No toca archivos en `node_modules/`
- ❌ No modifica archivos binarios
- ❌ No corre en modo `--apply` por defecto (requiere confirmacion)
- ❌ No modifica `.git/`, `dist/`, `build/`

---

## 🛡️ Seguridad

Los scripts:
- ✅ Siempre leen en UTF-8
- ✅ Escriben en UTF-8 sin BOM
- ✅ No tocan archivos fuera del proyecto
- ✅ Exit code 1 si encuentran problemas (para CI/CD)

---

## 🐛 Troubleshooting

### "No se encontraron mojibakes" pero veo caracteres raros

**Causa:** El archivo YA esta en UTF-8 correcto, pero tu editor lo muestra mal.

**Solucion:**
1. Configura tu editor para UTF-8
2. Verifica que `.editorconfig` este configurado

### "Error: Cannot find module"

**Causa:** Scripts usan ESM (import/export).

**Solucion:**
Asegurate que `package.json` tenga:
```json
{
  "type": "module"
}
```

O renombra los scripts a `.mjs`:
```bash
mv check-encoding.js check-encoding.mjs
mv fix-encoding.js fix-encoding.mjs
```

### Los scripts no detectan mi tipo de proyecto

**Solucion:** Edita manualmente la constante `projectType` en el script:

```javascript
// Forzar tipo manualmente
const projectType = 'typeB';  // typeA, typeB, o typeC
```

---

## 📋 Checklist de Instalacion

- [ ] Copiar carpeta `scripts/` al proyecto
- [ ] Agregar scripts a `package.json`
- [ ] Ejecutar `npm run check:encoding` para testear
- [ ] (Opcional) Configurar pre-build hook
- [ ] (Opcional) Configurar Husky pre-commit

---

## 💡 Tips

1. **Ejecuta check:encoding regularmente** durante desarrollo
2. **Integra en CI/CD** para bloquear PRs con mojibakes
3. **Configura .editorconfig** para prevenir futuros problemas
4. **Revisa git diff** despues de aplicar correcciones

---

**Version:** 1.0
**Compatibilidad:** Node.js 16+
**Licencia:** MIT
