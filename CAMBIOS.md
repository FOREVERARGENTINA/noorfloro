# Cambios

## 2026-09-11 — Compresión de subida a 1200px + auditoría del bucket

Se bajó `maxDimension` de 1600 a 1200 en `compressImage` (`lib/firebase.js`).
Afecta solo a **subidas nuevas**; las imágenes ya almacenadas no cambian.

**Por qué:** se midió el bucket `products/` antes de decidir. De 97 imágenes en
uso, 92 ya eran WebP comprimidas en el cliente (promedio 109 KB), pero 7 pasaban
los 300 KB (2,35 MB entre ellas) porque el límite de 1600px era generoso para el
ancho real de renderizado.

Anchos verificados con `sizes="(max-width:1024px) 100vw, 55vw"`: la galería pide
como máximo unos 1056 px CSS en viewport de 1920. 1200 cubre el uso normal. En el
zoom 1.5x de la galería se pierde algo de nitidez, y es el costo aceptado.

### Estado del bucket al 2026-09-11

| Concepto | Valor |
|---|---|
| Objetos totales | 137 (19,2 MB) |
| Referenciados por productos | 97 (10,29 MB) |
| Huérfanos | 40 (8,86 MB) |
| Productos en Firestore | 14 |

Ninguna imagen referenciada falta en Storage. La única colección que referencia
Storage es `products`.

### Borrado de 40 huérfanas (8,86 MB): EJECUTADO

Ejecutado el 2026-09-11 con `scripts/delete_orphan_images.js --apply`.
Borradas 40 de 40, 8,86 MB liberados.

**Verificación posterior** (consultando Storage y Firestore directamente, no la
salida del script):

| Chequeo | Resultado |
|---|---|
| Objetos en `products/` | 97 (antes 137) |
| Imágenes en uso | 97 |
| Huérfanas restantes | 0 |
| Imágenes en uso que falten | 0 |
| Portadas de producto que cargan | 14 de 14 |

Para volver a correrlo:

```bash
node scripts/delete_orphan_images.js            # dry-run, solo reporta
node scripts/delete_orphan_images.js --apply    # borra
```

El script re-verifica contra Firestore en el momento de correr y solo borra lo
que sigue sin estar referenciado, así que es seguro aunque pase tiempo.

**Respaldo previo:** las 40 se descargaron íntegras (8,86 MB verificados) a
`D:\Aideas\NOORFLORO-backups\storage-huerfanas-2026-09-11\`. El borrado es
reversible desde ahí.

Se re-verificó el estado justo antes: 14 productos, 137 objetos, 97 en uso,
cero conflictos, cero huérfanas nuevas. Doce comparten nombre base con una
imagen en uso, o sea son versiones viejas reemplazadas al reeditar un producto.

Se revisó `1788059828831-hero.webp` por ser la única reciente: la home usa
`public/images/hero.webp` (57,5 KB, local), no la copia de Storage. Es huérfana
real.

### Sobre `unoptimized: true` en `next.config.js`

Evaluado y **no aplicado**. Corta la cuota de Vercel Image Optimization, pero la
tabla del admin pinta miniaturas de 48 px y pasaría a descargar las portadas
completas (1,53 MB para 14 filas). Queda como decisión abierta.

---

## 2026-08-14 — Fix preventivo en `firebase.json`

Se agregó `"**/.*/**"` al array `ignore`.

**Por qué:** el patrón `"**/.*"` que ya estaba excluye *archivos* ocultos pero
**no el contenido de carpetas ocultas**, así que Firebase subía `.git/objects/…`
y el repositorio quedaba descargable por HTTP. Eso pasó en 6 sitios del grupo
(ver expediente).

**Este sitio no estaba expuesto** — se verificó. El cambio es preventivo y se
activa solo en el próximo deploy normal; no hace falta desplegar por esto.

---

Expediente completo:
`D:\Aideas\FRANDOWEB\BOOSTRAP\docs\incidente-git-expuesto.md`
