'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getFeaturedProducts } from '@/lib/firebase'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoadingFeatured(true)
        const products = await getFeaturedProducts(3)
        setFeaturedProducts(products)
      } catch (error) {
        console.error('Error loading featured products:', error)
      } finally {
        setLoadingFeatured(false)
      }
    }

    loadFeatured()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative text-white section overflow-hidden min-h-[600px] flex items-center justify-center">
          <img
            src="/images/hero.webp"
            alt="Hero"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="container-custom relative z-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-8 text-center md:text-left">
              <div className="md:col-span-2">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="fade-in-left mx-auto md:mx-0 mb-4 md:mb-0 w-full max-w-2xl h-auto"
                />
              </div>

              <div className="md:col-span-1">
                <h1 className="fade-in-delay text-4xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Bienvenido a NOORFLORO
                </h1>
                <p className="fade-in-delay text-lg md:text-xl mb-8 text-gray-100">
                  Pisos y revestimientos de calidad con envíos a todo el país
                </p>
                <div className="fade-in-delay flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/productos" className="btn btn-primary bg-white text-noorfloro-orange hover:bg-gray-100 text-lg px-8">
                    Ver productos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-noorfloro-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Calidad Garantizada</h3>
                <p className="text-gray-600">Productos seleccionados con los más altos estándares de calidad</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-noorfloro-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pago Seguro</h3>
                <p className="text-gray-600">Integración con Mercado Pago para pagos 100% seguros</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-noorfloro-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Envío Rápido</h3>
                <p className="text-gray-600">Envíos a todo el país con las mejores empresas de logística</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
              <p className="text-gray-600 text-lg">Los mejores productos seleccionados para ti</p>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-72 rounded-2xl bg-white shadow-sm animate-pulse"
                  />
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center text-gray-600 mb-8">
                Aun no hay productos destacados.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="text-center">
              <Link href="/productos" className="btn btn-primary text-lg px-8">
                Ver todos los productos
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-[#FA8F01] text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para comprar?</h2>
            <p className="text-xl mb-8 font-semibold">Explora nuestro catálogo completo y encuentra lo que buscas</p>
            <Link href="/productos" className="btn bg-white text-[#FA8F01] hover:bg-gray-100 text-lg px-8 font-semibold">
              Explorar catálogo
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
