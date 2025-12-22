# 🚀 Guía de Deployment - Cloudflare Pages + Firebase

Guía de deployment para Cloudflare Pages y Firebase.

## 📋 Stack Tecnológico

- **Frontend**: Cloudflare Pages (Next.js)
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth
- **Storage**: Firebase Storage
- **Serverless Functions**: Firebase Functions
- **Pagos**: Mercado Pago
- **Emails**: Resend (opcional)

## 💰 Costos

### Gratis Permanente (Plan Spark de Firebase)

```
Cloudflare Pages:    $0  (500 builds/mes, bandwidth ilimitado)
Firebase (Firestore + Auth + Storage):  $0 (Plan Spark con cuotas gratuitas generosas)
Resend:              $0  (3,000 emails/mes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:               $0/mes
```

### Upgrade Path

```
Al superar límites gratuitos:
├─ Firebase Blaze Plan: Pay-as-you-go (ver precios en la web de Firebase)
└─ Cloudflare Workers (si se usan): $5/mes (10M requests)
```

---

## 🗄️ PASO 1: Configurar Firebase

### 1.1 Crear Proyecto en Firebase

1.  Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2.  Haz clic en "Agregar proyecto" y sigue los pasos.
3.  Una vez creado, en el panel de control, haz clic en el ícono web (`</>`) para registrar una nueva aplicación web.
4.  Dale un apodo (ej. "Tienda Web") y copia las credenciales que se muestran.

### 1.2 Habilitar Servicios

En el menú de la izquierda de tu proyecto de Firebase:

1.  **Firestore Database**:
    -   Ve a "Firestore Database" → "Crear base de datos".
    -   Inicia en **modo de producción**.
    -   Elige una ubicación para tus datos (ej. `us-central`).
    -   Ve a la pestaña **Reglas** y pega el contenido de `firestore.rules` del repositorio. Publica los cambios.

2.  **Storage**:
    -   Ve a "Storage" → "Comenzar".
    -   Sigue los pasos para crear un bucket de almacenamiento.
    -   Ve a la pestaña **Reglas** y pega el contenido de `storage.rules` del repositorio. Publica los cambios.

3.  **Authentication**:
    -   Ve a "Authentication" → "Comenzar".
    -   En la pestaña "Sign-in method", habilita el proveedor **Email/Contraseña**.

### 1.3 Migrar Datos (Opcional)

Puedes usar el script `scripts/migrate_products_to_firestore.js` para migrar el catálogo de productos desde `lib/products.js` a tu nueva base de datos de Firestore.

### 1.4 Obtener Credenciales

1.  En la configuración de tu proyecto de Firebase (`Project Settings` ⚙️) → `Your apps` → `SDK setup and configuration`, copia el objeto `firebaseConfig`.
2.  Pega estos valores en tu archivo `.env.local` para desarrollo local:
    -   `NEXT_PUBLIC_FIREBASE_API_KEY`
    -   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    -   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    -   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
3.  Para operaciones de servidor (como en las Firebase Functions), necesitarás una **cuenta de servicio**:
    -   Ve a `Project Settings` ⚙️ → `Service accounts`.
    -   Haz clic en "Generar nueva clave privada". Se descargará un archivo JSON.
    -   **¡TRATA ESTE ARCHIVO COMO UNA CONTRASEÑA!** No lo subas a tu repositorio de Git.

### 1.5 Crear Usuario Admin

1.  Ve a **Authentication** → **Users** → **Add user**.
2.  Ingresa el email (ej. `admin@tutienda.com`) y una contraseña segura.
3.  Este será el usuario para acceder al panel de administración.

---

## 🌐 PASO 2: Configurar Cloudflare Pages

### 2.1 Preparar Repositorio Git

```bash
# Si aún no lo hiciste
git init
git add .
git commit -m "feat: migración a Cloudflare + Firebase"

# Crear repo en GitHub
git remote add origin https://github.com/tu-usuario/tienda.git
git branch -M main
git push -u origin main
```

### 2.2 Conectar a Cloudflare Pages

1.  Ir a [https://dash.cloudflare.com](https://dash.cloudflare.com)
2.  Click "Workers & Pages" en el sidebar
3.  Click "Create application" → "Pages" → "Connect to Git"
4.  Autorizar GitHub
5.  Seleccionar repositorio: `tu-usuario/tienda`
6.  Configuración de build:
    -   **Production branch**: `main`
    -   **Framework preset**: `Next.js`
    -   **Build command**: `npm run build`
    -   **Build output directory**: `.next`

### 2.3 Configurar Variables de Entorno

En Cloudflare Pages → **Settings** → **Environment variables** (si usás Cloudflare Pages), o configura las mismas variables en tu CI si vas a desplegar con Firebase Hosting:

**Producción (Cloudflare Pages):**

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_de_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain_de_firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id_de_firebase
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_de_firebase
NEXT_PUBLIC_ADMIN_EMAIL=admin@tutienda.com
NEXT_PUBLIC_MP_PUBLIC_KEY=tu_mercado_pago_public_key
NEXT_PUBLIC_MP_SANDBOX=false
NEXT_PUBLIC_SITE_URL=https://tutienda.pages.dev
```

**Producción (Firebase Hosting):**

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_de_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain_de_firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=frandoweb-4c2c7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=frandoweb-4c2c7.appspot.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@tutienda.com
NEXT_PUBLIC_MP_PUBLIC_KEY=tu_mercado_pago_public_key
NEXT_PUBLIC_MP_SANDBOX=false
NEXT_PUBLIC_SITE_URL=https://noorfloro.web.app
```

**Preview (opcional, para testing):**

Mismas variables pero con `NEXT_PUBLIC_MP_SANDBOX=true`

### 2.4 Crear Hosting site (Firebase)

Si vas a usar Firebase Hosting (en lugar de Cloudflare Pages) — crear el sitio y asociarlo al proyecto:

```bash
# Crear el site (solo necesita ejecutarse una vez)
firebase hosting:sites:create noorfloro --project frandoweb-4c2c7

# Verifica el site creado (regresa la URL)
# Actualiza `NEXT_PUBLIC_SITE_URL` en tu CI/.env.local con la URL devuelta (ej: https://noorfloro.web.app)

# Deploy hosting
firebase deploy --only hosting --project frandoweb-4c2c7
```


### 2.4 Deploy

1.  Click "Save and Deploy"
2.  Esperar ~3-5 minutos
3.  Tu sitio estará en: `https://tienda-XXXX.pages.dev`

### 2.5 Dominio Custom (Opcional)

1.  En Cloudflare Pages → **Custom domains**
2.  Click "Set up a custom domain"
3.  Ingresar: `tutienda.com`
4.  Cloudflare configura DNS automáticamente. SSL gratis incluido.

---

## ⚡ PASO 3: Configurar Firebase Function (Webhook Mercado Pago)

Para manejar los webhooks de Mercado Pago de forma segura, usaremos una Firebase Function.

### 3.1 Inicializar Firebase Functions

En la raíz de tu proyecto:

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Iniciar sesión en Firebase
firebase login

# Inicializar Firebase en el proyecto
firebase init functions

# Selecciona las siguientes opciones:
# - Usar un proyecto existente
# - Selecciona tu proyecto de Firebase
# - Lenguaje: JavaScript
# - Usar ESLint: Sí
# - Instalar dependencias: Sí
```

Esto creará una carpeta `functions` en tu proyecto.

### 3.2 Crear la Función de Webhook

Reemplaza el contenido de `functions/index.js` con el siguiente código:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// URL: https://<region>-<project-id>.cloudfunctions.net/handleMercadoPagoWebhook
exports.handleMercadoPagoWebhook = functions
  .region("us-central1") // Elige tu región
  .https.onRequest(async (request, response) => {
    // Solo aceptar POST
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const body = request.body;

      // Validar que sea un evento de payment
      if (body.type !== "payment") {
        response.status(200).send("OK, event ignored.");
        return;
      }

      const paymentId = body.data.id;
      const mpAccessToken = functions.config().mercadopago.access_token;

      // Consultar detalles del pago en Mercado Pago
      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            "Authorization": `Bearer ${mpAccessToken}`,
          },
        },
      );
      const payment = await mpResponse.json();

      // Si el pago fue aprobado, actualizar orden en Firestore
      if (payment.status === "approved") {
        const orderId = payment.external_reference;

        const db = admin.firestore();
        const orderRef = db.collection("orders").doc(orderId);

        await orderRef.update({
          status: "paid",
          paymentId: paymentId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Opcional: Disparar un email de confirmación
        // (ver PASO 5)
      }

      response.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      response.status(500).send("Error processing webhook");
    }
  });
```

### 3.3 Configurar y Desplegar la Función

1.  **Configurar el Access Token de Mercado Pago como secreto:**

    ```bash
    firebase functions:config:set mercadopago.access_token="TU_MP_ACCESS_TOKEN"
    ```

2.  **Desplegar la función:**

    ```bash
    firebase deploy --only functions
    ```

3.  Una vez desplegada, Firebase CLI te dará la URL de la función. Cópiala.

URL final del webhook: `https://<region>-<project-id>.cloudfunctions.net/handleMercadoPagoWebhook`

**Nota (Service Account / Secrets):** Si tus funciones requieren privilegios administrativos o quieres cargar la clave de servicio explícitamente en el entorno de ejecución, guarda la JSON de la Service Account codificada en base64 en una variable de entorno segura (ej: `FIREBASE_SERVICE_ACCOUNT_BASE64`) y/o usa secretos del proveedor de CI. También asegurate de configurar `mercadopago.access_token` como se indica arriba.

---

## 💳 PASO 4: Configurar Mercado Pago

### 4.1 Obtener Credenciales

1.  Ir a [https://www.mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2.  **Tus integraciones** → **Crear aplicación**
3.  Copiar:
    -   **Public Key** (para frontend)
    -   **Access Token** (para backend/webhook, lo usaste en el paso anterior)

### 4.2 Configurar Webhooks

1.  En tu aplicación de MP → **Webhooks**
2.  **URL de producción**: Pega la URL de tu Firebase Function del paso 3.3.
3.  **Eventos**: Marcar "Pagos".
4.  Guardar.

### 4.3 Testing con Sandbox

1.  Usar **Credenciales de prueba** para desarrollo.
2.  Crear **usuarios de prueba** en el Dashboard de MP.
3.  En `.env.local`, asegúrate que `NEXT_PUBLIC_MP_SANDBOX=true`.
---

## 🚀 Cloudflare Pages CI (opcional, recomendado)

Puedes desplegar automáticamente con GitHub Actions. Añadí una plantilla en `.github/workflows/cloudflare-pages.yml` que:
- Instala dependencias, ejecuta `npm run build`, y publica con `cloudflare/pages-action`.

Secrets que debes crear en GitHub (Repository → Settings → Secrets):
- `CF_ACCOUNT_ID` → tu Cloudflare Account ID
- `CF_API_TOKEN` → token con permisos `Pages:Edit` y `Account:Read`
- `CF_PAGES_PROJECT_NAME` → nombre del proyecto en Pages (ej. `noorfloro`)
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_MP_PUBLIC_KEY`, `NEXT_PUBLIC_MP_SANDBOX`

> Nota: si preferís conectar el repo desde la UI de Cloudflare Pages (más simple), no es obligatorio usar el workflow; lo dejé como opción para CI/CD.

---

## 📧 PASO 5: Configurar Emails (Opcional - Resend)

Puedes usar una Firebase Function para enviar emails de confirmación de pedido.

### 5.1 Crear cuenta Resend

1.  Ir a [https://resend.com](https://resend.com) y registrarse.
2.  Verificar tu dominio para enviar emails desde tu propia URL.
3.  Obtener tu **API Key**.

### 5.2 Crear la Función de Email

Agrega el siguiente código a tu archivo `functions/index.js`:

```javascript
const RESEND_API_KEY = functions.config().resend.api_key;

// Se puede llamar a esta función desde la función del webhook
// o hacer que se dispare automáticamente cuando una orden se actualiza.
exports.sendOrderEmail = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    // Enviar email solo si el estado cambió a "paid"
    if (newData.status === "paid" && previousData.status !== "paid") {
      const order = newData;
      const orderId = context.params.orderId;

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "ventas@tutienda.com",
            to: order.customer_email, // Asegúrate de guardar el email en la orden
            subject: `Confirmación de pedido #${orderId.slice(0, 8)}`,
            html: `
              <h1>¡Gracias por tu compra!</h1>
              <p>Tu pedido ha sido confirmado.</p>
              <p><strong>Total:</strong> $${order.total}</p>
              <p>Te enviaremos actualizaciones sobre el envío.</p>
            `,
          }),
        });
        console.log(`Email sent for order ${orderId}`);
      } catch (error) {
        console.error(`Failed to send email for order ${orderId}:`, error);
      }
    }
    return null;
  });
```

### 5.3 Configurar y Desplegar

1.  **Configurar la API Key de Resend:**

    ```bash
    firebase functions:config:set resend.api_key="TU_RESEND_API_KEY"
    ```

2.  **Desplegar la función:**

    ```bash
    firebase deploy --only functions
    ```

---

## 🔄 PASO 6: Keep-Alive (¡No es necesario con Firebase!)

A diferencia de otras plataformas, el plan gratuito de Firebase (Spark) **no pausa** tu base de datos por inactividad. Puedes saltarte este paso.

---

## ✅ PASO 7: Verificación y Testing

### 7.1 Checklist de Deployment

Frontend:
- [ ] Sitio carga en `https://tutienda.pages.dev`
- [ ] Productos se muestran desde Firestore
- [ ] Carrito funciona (localStorage)
- [ ] Formulario de checkout valida

Backend:
- [ ] Proyecto de Firebase creado y servicios habilitados
- [ ] Reglas de seguridad de Firestore y Storage configuradas
- [ ] Firebase Function para webhook desplegada

Pagos:
- [ ] Mercado Pago Public Key configurada en Cloudflare
- [ ] Webhook URL (de la Firebase Function) configurada en MP
- [ ] Firebase Function funcionando y actualizando órdenes

### 7.2 Testing de Flujo Completo

1.  **Agregar producto al carrito**
2.  **Ir a checkout y completar formulario**
3.  **Click "Confirmar y pagar"**
4.  **Verificar redirect a Mercado Pago**
5.  **Pagar con usuario de prueba**
6.  **Verificar:**
    -   Orden creada en Firestore (colección `orders`)
    -   Webhook recibido (ver logs en la consola de Firebase Functions)
    -   Orden actualizada a status `paid` en Firestore
    -   Email de confirmación enviado (si configuraste Resend y la función de email)

---

## 📊 Monitoreo

### Cloudflare Analytics

Dashboard → **Analytics & Logs**
- Requests por día
- Bandwidth consumido
- Errores

### Firebase Console

-   **Firestore**: Lee/escribe/elimina documentos. Uso de almacenamiento.
-   **Authentication**: Usuarios activos.
-   **Storage**: Uso de almacenamiento y ancho de banda.
-   **Functions**: Invocaciones, tiempos de ejecución y logs.

### Breaking Points (Plan Gratuito Spark)

Consulta la [página de precios de Firebase](https://firebase.google.com/pricing) para los límites detallados. El upgrade al plan Blaze (pago por uso) es necesario si superas consistentemente las cuotas gratuitas.

---

## 🚨 Troubleshooting

### Build falla en Cloudflare

**Error**: `Module not found: firebase`

**Solución**: Verificar que `package.json` tenga la dependencia:

```bash
npm install firebase
git add package.json package-lock.json
git commit -m "fix: add firebase dependency"
git push
```

### Productos no cargan desde Firestore

**Solución**:
1.  Verificar variables de entorno `NEXT_PUBLIC_FIREBASE_*` en Cloudflare Pages.
2.  Verificar que las **Reglas de Seguridad** de Firestore permiten la lectura de la colección `products`.
3.  Revisar la consola del navegador por errores de conexión a Firebase.

### Webhook no funciona

**Solución**:
1.  Verificar que la URL del webhook en el Dashboard de Mercado Pago sea exactamente la que te dio Firebase Functions.
2.  Ir a la consola de Firebase → **Functions** → **Registros (Logs)** para ver si hay errores en la ejecución de tu función.
3.  Asegurarte que el Access Token de MP esté correctamente configurado en los secrets de Firebase Functions.

---

## 🎉 ¡Deployment Completado!

Tu tienda está ahora en producción con:

✅ **Cloudflare Pages**: Frontend con SSL y CDN global
✅ **Firebase**: Backend completo (Firestore, Auth, Storage, Functions)
✅ **Pagos**: Webhooks de Mercado Pago procesados de forma segura
✅ **$0/mes**: Completamente gratis dentro de las cuotas del plan Spark

### URLs Finales

```
Frontend:     https://tutienda.pages.dev
Firebase Console: https://console.firebase.google.com/project/tu-project-id
Webhook:      (URL de tu Firebase Function)
Admin Panel:  https://tutienda.pages.dev/admin
```

### Próximos Pasos

1.  Agregar productos reales en Firestore.
2.  Subir imágenes a Firebase Storage.
3.  Configurar dominio custom en Cloudflare.
4.  ¡Empezar a vender!

---

**Documentación completa**: Ver `README.md`
