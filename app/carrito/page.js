'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { formatPrice } from '@/lib/products'

export default function CarritoPage() {
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return

    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    )

    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const clearCart = () => {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      setCart([])
      localStorage.setItem('cart', JSON.stringify([]))
      window.dispatchEvent(new Event('cartUpdated'))
    }
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Page Header */}
        <section className="bg-gray-900 text-white py-12">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold">Carrito de Compras</h1>
          </div>
        </section>

        {/* Cart Content */}
        <section className="section">
          <div className="container-custom">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-600 mb-6">Agrega productos para comenzar tu compra</p>
                <Link href="/productos" className="btn btn-primary">
                  Explorar productos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="text-xl font-bold">Productos ({cart.length})</h2>
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                        aria-label="Vaciar carrito"
                      >
                        Vaciar carrito
                      </button>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {cart.map(item => (
                        <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4">
                          <div className="relative w-full sm:w-24 h-24 bg-gray-200 rounded flex-shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={`Imagen de ${item.name}`}
                                fill
                                sizes="96px"
                                className="object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="flex-grow">
                            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                            <p className="text-sky-600 font-bold text-xl mb-2">
                              {formatPrice(item.price)}
                            </p>

                            <div className="flex items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 tap-target"
                                  aria-label="Disminuir cantidad"
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 font-semibold border-x border-gray-300" aria-label={`Cantidad: ${item.quantity}`}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 tap-target"
                                  aria-label="Aumentar cantidad"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                                aria-label={`Eliminar ${item.name} del carrito`}
                              >
                                Eliminar
                              </button>
                            </div>

                            <p className="text-gray-600 text-sm mt-2">
                              Subtotal: {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Envío</span>
                        <span className="text-sm">Calculado en el checkout</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span className="text-sky-600">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>

                    <Link href="/checkout" className="btn btn-primary w-full mb-3">
                      Proceder al pago
                    </Link>

                    <Link href="/productos" className="btn btn-outline w-full">
                      Seguir comprando
                    </Link>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Pago 100% seguro</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Envío a todo el país</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
