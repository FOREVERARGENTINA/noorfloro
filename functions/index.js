const functions = require('firebase-functions')
const admin = require('firebase-admin')
const mercadopago = require('mercadopago')
const cors = require('cors')

// Initialize Admin SDK (if not already)
if (!admin.apps.length) {
  // Prefer implicit credentials from environment, otherwise use base64 service account
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const saJson = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'))
    admin.initializeApp({ credential: admin.credential.cert(saJson) })
  } else {
    admin.initializeApp()
  }
}

const db = admin.firestore()

// Configure Mercado Pago from environment or functions config
const mpAccessToken = process.env.MP_ACCESS_TOKEN || (functions.config && functions.config().mp && functions.config().mp.access_token)
if (mpAccessToken) {
  mercadopago.configurations.setAccessToken(mpAccessToken)
}

// Helper to ensure MP is configured before creating preferences
function ensureMpConfigured(res) {
  if (!mpAccessToken) {
    res.status(501).send({ error: 'Mercado Pago not configured. Preference creation disabled.' })
    return false
  }
  return true
}

// Simple CORS wrapper
const corsHandler = cors({ origin: true })

exports.createPaymentPreference = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') return res.status(405).send({ error: 'Method not allowed' })

      // Ensure Mercado Pago is configured before proceeding
      if (!ensureMpConfigured(res)) return

      const { items, payer, shipment } = req.body
      if (!items || !Array.isArray(items)) return res.status(400).send({ error: 'Missing items' })

      // Create order in Firestore
      const orderRef = await db.collection('orders').add({
        customer_email: payer?.email || null,
        items,
        total: items.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0),
        status: 'pending',
        shipping_address: shipment || null,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      })

      // Create MP preference
      const preference = {
        items: items.map(item => ({
          id: item.id ? item.id.toString() : undefined,
          title: item.name || item.title || 'Item',
          quantity: item.quantity || 1,
          unit_price: item.price || 0,
          currency_id: 'ARS'
        })),
        payer: {
          email: payer?.email || undefined,
          name: payer?.nombre || payer?.name || undefined
        },
        external_reference: orderRef.id,
        back_urls: {
          success: (process.env.NEXT_PUBLIC_SITE_URL || '') + '/pago-exitoso',
          failure: (process.env.NEXT_PUBLIC_SITE_URL || '') + '/pago-fallido',
          pending: (process.env.NEXT_PUBLIC_SITE_URL || '') + '/pago-pendiente'
        },
        auto_return: 'approved',
        notification_url: (process.env.WEBHOOK_URL || '') + '/webhook/mercadopago'
      }

      const mpRes = await mercadopago.preferences.create(preference)
      const pref = mpRes.body

      // Save preference id to order
      await orderRef.update({ mp_pref_id: pref.id })

      return res.status(200).send({ preferenceId: pref.id, initPoint: pref.init_point, orderId: orderRef.id })
    } catch (error) {
      console.error('createPaymentPreference error', error)
      return res.status(500).send({ error: error.message })
    }
  })
})

// Example webhook handler (validate Mercado Pago webhook signature externally)
exports.webhookMercadoPago = functions.https.onRequest((req, res) => {
  // Implement payment notification handling here.
  res.status(200).send('ok')
})