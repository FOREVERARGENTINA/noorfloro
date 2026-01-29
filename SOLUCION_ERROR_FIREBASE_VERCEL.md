# Solución al Error de Firebase en Vercel (/admin subir producto)

## Problema
Al intentar subir productos en `/admin/productos` en Vercel, aparecen errores de conexión a Firebase Firestore con estado "(blocked:other)".

## Causas Posibles
1. Variables de entorno de Firebase no configuradas en Vercel
2. Dominio de Vercel no autorizado en Firebase Console
3. Reglas de seguridad de Firestore bloqueando las peticiones

## Solución Paso a Paso

### 1. Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel y agrega las siguientes variables de entorno:

**Dashboard de Vercel → Tu Proyecto → Settings → Environment Variables**

Agrega las siguientes variables (valores del archivo `.env.local`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAefSTD8mgGkJ9u9tVmXqGlHknwGJEPNQM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=noorfloro-1da42.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=noorfloro-1da42
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=noorfloro-1da42.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=655101381776
NEXT_PUBLIC_FIREBASE_APP_ID=1:655101381776:web:7e6b9e043171603421dc15
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-SPY6DL688C
```

**IMPORTANTE:** Aplica estas variables a todos los entornos (Production, Preview, Development).

Después de agregar las variables:
1. Guarda los cambios
2. Re-deploya el proyecto desde Vercel Dashboard

### 2. Autorizar Dominios en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto: **noorfloro-1da42**
3. Ve a **Authentication** → **Settings** → **Authorized domains**
4. Agrega estos dominios (reemplaza con tu dominio de Vercel):
   - `tu-proyecto.vercel.app`
   - `*.vercel.app` (si tienes preview deployments)
   - Tu dominio personalizado si tienes uno

### 3. Verificar Reglas de Firestore

1. Ve a **Firestore Database** → **Rules** en Firebase Console
2. Verifica que las reglas permitan lectura/escritura para usuarios autenticados:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de productos
    match /products/{productId} {
      allow read: true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Otras colecciones requieren autenticación
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Publica las reglas** después de editarlas.

### 4. Verificar Storage Rules

1. Ve a **Storage** → **Rules** en Firebase Console
2. Verifica que las reglas permitan upload para usuarios autenticados:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      // Permitir lectura pública
      allow read: true;
      // Solo admins autenticados pueden escribir
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 5. Redeploy en Vercel

Después de hacer estos cambios:

1. En Vercel Dashboard, ve a tu proyecto
2. Haz clic en **Deployments**
3. En el último deployment, haz clic en el menú (tres puntos) → **Redeploy**
4. Selecciona **Use existing Build Cache** (opcional) → **Redeploy**

## Verificación

Después de aplicar los cambios:

1. Accede a tu sitio en Vercel: `https://tu-proyecto.vercel.app/admin`
2. Inicia sesión como admin
3. Intenta cargar la página de productos
4. Abre DevTools (F12) → **Console** y **Network**
5. Verifica que no aparezcan errores de Firebase

## Solución Rápida para Testing

Si solo quieres probar rápidamente, puedes establecer reglas permisivas TEMPORALMENTE (NO PARA PRODUCCIÓN):

**Firestore Rules (solo testing):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: true;  // ¡PELIGRO! Solo para testing
    }
  }
}
```

**Storage Rules (solo testing):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: true;  // ¡PELIGRO! Solo para testing
    }
  }
}
```

**⚠️ ADVERTENCIA:** Estas reglas permiten acceso público total. Úsalas SOLO para testing y cámbialas inmediatamente después.

## Comandos Útiles

### Verificar variables localmente
```bash
# Ver variables configuradas
cat .env.local
```

### Ver logs de Vercel
```bash
# Si tienes Vercel CLI instalado
vercel logs tu-proyecto
```

## Recursos Adicionales

- [Firebase Console](https://console.firebase.google.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authorized Domains](https://firebase.google.com/docs/auth/web/redirect-best-practices#trusted-domains)

## Checklist de Verificación

- [ ] Variables de entorno configuradas en Vercel (Production, Preview, Development)
- [ ] Dominio de Vercel agregado a "Authorized domains" en Firebase
- [ ] Reglas de Firestore configuradas correctamente
- [ ] Reglas de Storage configuradas correctamente
- [ ] Re-deploy realizado en Vercel
- [ ] Sin errores en Console de navegador
- [ ] Conexión a Firestore funcionando (Network tab)
