/**
 * Mercado Pago Integration Module (Cloudflare + Supabase)
 *
 * This file provides the client-side integration with Mercado Pago.
 * Backend integration uses Cloudflare Workers or Firebase Functions.
 *
 * Architecture:
 * 1. Frontend calls createPaymentPreference()
 * 2. Supabase Edge Function creates MP preference
 * 3. Edge Function saves order to Supabase DB
 * 4. Frontend redirects to MP checkout
 * 5. User completes payment on MP
 * 6. MP sends webhook to Cloudflare Worker
 * 7. Worker validates payment and updates order in Supabase
 * 8. Worker triggers email confirmation (via Edge Function)
 * 9. User returns to success/failure page
 *
 * Setup:
 * 1. Deploy Edge Function: supabase functions deploy create-mp-preference
 * 2. Deploy Cloudflare Worker: wrangler deploy worker-webhook-mp.js
 * 3. Configure webhook URL in Mercado Pago Dashboard
 * 4. Set environment variables (see DEPLOYMENT_CLOUDFLARE.md)
 */

/**
 * Creates a payment preference on the backend
 * @param {Object} orderData - Order details
 * @param {Array} orderData.items - Products in cart
 * @param {Object} orderData.payer - Customer information
 * @param {Object} orderData.shipment - Shipping information
 * @returns {Promise<string>} Preference ID for MP checkout
 */
export async function createPaymentPreference(orderData) {
  // Supabase integration has been removed from this repo.
  // Implement a server-side endpoint (Cloudflare Worker or Firebase Function)
  // that creates Mercado Pago preferences and call it from the frontend.
  throw new Error('Supabase removed — implement createPaymentPreference on your backend (Cloudflare Worker or Firebase Function)')
}

/**
 * Redirects to Mercado Pago checkout
 * @param {string} preferenceId - MP preference ID
 */
export function redirectToCheckout(preferenceId) {
  // Sandbox URL for testing
  const isSandbox = process.env.NEXT_PUBLIC_MP_SANDBOX === 'true'
  const baseUrl = isSandbox
    ? 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect'
    : 'https://www.mercadopago.com.ar/checkout/v1/redirect'

  window.location.href = `${baseUrl}?pref_id=${preferenceId}`
}

/**
 * Formats cart items for MP preference
 * @param {Array} cart - Cart items from localStorage
 * @returns {Array} Formatted items for MP
 */
export function formatCartForMP(cart) {
  return cart.map(item => ({
    id: item.id.toString(),
    title: item.name,
    description: item.name,
    picture_url: item.image,
    category_id: 'electronics', // Adjust based on your categories
    quantity: item.quantity,
    unit_price: item.price,
    currency_id: 'ARS',
  }))
}

/**
 * Calculates total from cart
 * @param {Array} cart - Cart items
 * @returns {number} Total amount
 */
export function calculateCartTotal(cart) {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

/*
================================================================================
Backend Function Example: create-mp-preference (Cloudflare Worker / Firebase Function) — adapt to Firestore
================================================================================

Location: supabase/functions/create-mp-preference/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { MercadoPagoConfig, Preference } from 'npm:mercadopago@2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { items, payer, shipment } = await req.json()

    // Initialize Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: Deno.env.get('MP_ACCESS_TOKEN')!
    })
    const preference = new Preference(client)

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Calculate total
    const total = items.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0
    )

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_email: payer.email,
        items: items,
        total: total,
        status: 'pending',
        shipping_address: shipment
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create MP preference
    const mpResponse = await preference.create({
      items: items.map(item => ({
        id: item.id.toString(),
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS'
      })),
      payer: {
        name: payer.nombre,
        surname: payer.apellido,
        email: payer.email,
        phone: { number: payer.telefono }
      },
      back_urls: {
        success: `${Deno.env.get('FRONTEND_URL')}/pago-exitoso`,
        failure: `${Deno.env.get('FRONTEND_URL')}/pago-fallido`,
        pending: `${Deno.env.get('FRONTEND_URL')}/pago-pendiente`
      },
      auto_return: 'approved',
      notification_url: `${Deno.env.get('WEBHOOK_URL')}/webhook/mercadopago`,
      external_reference: order.id
    })

    return new Response(JSON.stringify({
      preferenceId: mpResponse.id,
      initPoint: mpResponse.init_point,
      orderId: order.id
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

================================================================================
Cloudflare Worker Example: webhook-mercadopago
================================================================================

See DEPLOYMENT_CLOUDFLARE.md for complete Worker code

================================================================================
*/
