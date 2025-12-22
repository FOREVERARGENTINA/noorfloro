'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { formatPrice } from '@/lib/products'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    notas: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setMounted(true)
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)

    if (savedCart.length === 0) {
      router.push('/carrito')
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    const phoneRegex = /^[0-9]{8,15}$/
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (!phoneRegex.test(formData.telefono.replace(/[\s-]/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (8-15 dígitos)'
    }

    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida'
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida'
    if (!formData.provincia.trim()) newErrors.provincia = 'La provincia es requerida'
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = 'El código postal es requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Focus first error field
      const firstErrorField = Object.keys(errors)[0]
      document.getElementById(firstErrorField)?.focus()
      return
    }

    setLoading(true)

    try {
      // Simulate API call - Replace with actual Mercado Pago integration
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Here you would:
      // 1. Send order to backend API
      // 2. Create Mercado Pago preference
      // 3. Redirect to Mercado Pago checkout
      // 4. Backend handles webhook and confirms payment

      // For now, simulate success
      localStorage.setItem('cart', JSON.stringify([]))
      window.dispatchEvent(new Event('cartUpdated'))

      alert('¡Pedido procesado con éxito! En producción se redirigiría a Mercado Pago.')
      router.push('/')
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Page Header */}
        <section className="bg-gray-900 text-white py-12">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="section">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6" noValidate>
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Información Personal</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nombre" className="label">
                          Nombre <span className="text-red-600" aria-label="requerido">*</span>
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className={`input ${errors.nombre ? 'border-red-500' : ''}`}
                          required
                          aria-required="true"
                          aria-invalid={!!errors.nombre}
                          aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                        />
                        {errors.nombre && (
                          <p id="nombre-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.nombre}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="apellido" className="label">
                          Apellido <span className="text-red-600" aria-label="requerido">*</span>
                        </label>
                        <input
                          type="text"
                          id="apellido"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          className={`input ${errors.apellido ? 'border-red-500' : ''}`}
                          required
                          aria-required="true"
                          aria-invalid={!!errors.apellido}
                          aria-describedby={errors.apellido ? 'apellido-error' : undefined}
                        />
                        {errors.apellido && (
                          <p id="apellido-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.apellido}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="label">
                          Email <span className="text-red-600" aria-label="requerido">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`input ${errors.email ? 'border-red-500' : ''}`}
                          required
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="telefono" className="label">
                          Teléfono <span className="text-red-600" aria-label="requerido">*</span>
                        </label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className={`input ${errors.telefono ? 'border-red-500' : ''}`}
                          placeholder="11 1234-5678"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.telefono}
                          aria-describedby={errors.telefono ? 'telefono-error' : undefined}
                        />
                        {errors.telefono && (
                          <p id="telefono-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.telefono}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="direccion" className="label">
                          Dirección <span className="text-red-600" aria-label="requerido">*</span>
                        </label>
                        <input
                          type="text"
                          id="direccion"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          className={`input ${errors.direccion ? 'border-red-500' : ''}`}
                          placeholder="Calle y número"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.direccion}
                          aria-describedby={errors.direccion ? 'direccion-error' : undefined}
                        />
                        {errors.direccion && (
                          <p id="direccion-error" className="text-red-600 text-sm mt-1" role="alert">
                            {errors.direccion}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="ciudad" className="label">
                            Ciudad <span className="text-red-600" aria-label="requerido">*</span>
                          </label>
                          <input
                            type="text"
                            id="ciudad"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            className={`input ${errors.ciudad ? 'border-red-500' : ''}`}
                            required
                            aria-required="true"
                            aria-invalid={!!errors.ciudad}
                            aria-describedby={errors.ciudad ? 'ciudad-error' : undefined}
                          />
                          {errors.ciudad && (
                            <p id="ciudad-error" className="text-red-600 text-sm mt-1" role="alert">
                              {errors.ciudad}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="provincia" className="label">
                            Provincia <span className="text-red-600" aria-label="requerido">*</span>
                          </label>
                          <input
                            type="text"
                            id="provincia"
                            name="provincia"
                            value={formData.provincia}
                            onChange={handleChange}
                            className={`input ${errors.provincia ? 'border-red-500' : ''}`}
                            required
                            aria-required="true"
                            aria-invalid={!!errors.provincia}
                            aria-describedby={errors.provincia ? 'provincia-error' : undefined}
                          />
                          {errors.provincia && (
                            <p id="provincia-error" className="text-red-600 text-sm mt-1" role="alert">
                              {errors.provincia}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="codigoPostal" className="label">
                            Código Postal <span className="text-red-600" aria-label="requerido">*</span>
                          </label>
                          <input
                            type="text"
                            id="codigoPostal"
                            name="codigoPostal"
                            value={formData.codigoPostal}
                            onChange={handleChange}
                            className={`input ${errors.codigoPostal ? 'border-red-500' : ''}`}
                            required
                            aria-required="true"
                            aria-invalid={!!errors.codigoPostal}
                            aria-describedby={errors.codigoPostal ? 'codigoPostal-error' : undefined}
                          />
                          {errors.codigoPostal && (
                            <p id="codigoPostal-error" className="text-red-600 text-sm mt-1" role="alert">
                              {errors.codigoPostal}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="notas" className="label">
                          Notas adicionales (opcional)
                        </label>
                        <textarea
                          id="notas"
                          name="notas"
                          value={formData.notas}
                          onChange={handleChange}
                          rows={3}
                          className="input"
                          placeholder="Instrucciones de entrega, referencias, etc."
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full text-lg"
                    aria-busy={loading}
                  >
                    {loading ? 'Procesando...' : 'Confirmar y pagar'}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

                  <div className="space-y-3 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envío</span>
                      <span className="text-sm">A calcular</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-xl">
                      <span>Total</span>
                      <span className="text-sky-600">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Métodos de pago disponibles:</p>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 rounded px-3 py-2 text-xs font-medium">
                        Mercado Pago
                      </div>
                      <div className="bg-gray-100 rounded px-3 py-2 text-xs font-medium">
                        Tarjetas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
