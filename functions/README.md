# Functions — deploy notes

This folder contains Firebase Cloud Functions for backend tasks (Mercado Pago preference creation and webhook handling).

Environment setup (recommended):

1. Use Firebase project credentials:
   - `firebase login`
   - `firebase use --add`

2. Set Mercado Pago access token (server-side):

```bash
firebase functions:config:set mp.access_token="YOUR_MP_ACCESS_TOKEN"
# or set MP_ACCESS_TOKEN env var in CI
```

3. (Optional) If you need admin privileges and want to provide a Service Account JSON to the functions runtime, set the base64 encoded json as a secret in your CI or environment:

```bash
export FIREBASE_SERVICE_ACCOUNT_BASE64=$(base64 service-account.json | tr -d '\n')
# then set in your CI secrets or environment variables
```

4. Deploy functions:

```bash
cd functions
npm install
firebase deploy --only functions
```

Notes:
- The `createPaymentPreference` function expects a POST body with `{ items, payer, shipment }` and will create an `orders` doc in Firestore.
- For local testing use Firebase Emulator Suite:

```bash
firebase emulators:start --only functions,firestore
```
