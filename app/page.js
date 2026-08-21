'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative text-white overflow-hidden min-h-[650px] flex items-center justify-center">
          <Image
            src="/images/hero.webp"
            alt="Showroom de pisos y revestimientos NOORFLORO"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* layered overlay: vignette + bottom fade */}
          <div className="absolute inset-0 z-10"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)' }}
          />
          <div className="absolute inset-0 z-10"
            style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.30) 100%)' }}
          />

          <div className="container-custom relative z-20 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-8 text-center md:text-left">

              <div className="md:col-span-2">
                <img
                  src="/images/logo.webp"
                  alt="NOORFLORO"
                  className="fade-in-left mx-auto md:mx-0 mb-4 md:mb-0 w-full max-w-2xl h-auto drop-shadow-xl"
                />
              </div>

              <div className="md:col-span-1">
                <span className="fade-in-delay inline-block text-[10px] font-bold tracking-[0.28em] uppercase text-white bg-[#B45309] rounded px-3 py-1 mb-5">
                  Pisos &amp; Revestimientos
                </span>
                <h1 className="fade-in-delay text-4xl lg:text-5xl font-bold mb-5 leading-tight">
                  Bienvenidos
                </h1>
                <p className="fade-in-delay text-base md:text-lg mb-8 text-gray-200 leading-relaxed">
                  Calidad en pisos y revestimientos con envíos a todo el país
                </p>
                <div className="fade-in-delay flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link href="/productos" className="btn btn-primary text-base px-7">
                    Ver productos
                  </Link>
                  <Link
                    href="/contacto"
                    className="btn text-base px-7 text-white border border-white/30"
                    style={{ background: 'rgba(255,255,255,0.08)', boxShadow: 'none' }}
                  >
                    Contactarnos
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Beneficios ────────────────────────────────────────── */}
        <section className="section bg-white border-b border-gray-100">
          <div className="container-custom">
            <h2 className="sr-only">Beneficios de comprar en NOORFLORO</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {[
                {
                  num: '01',
                  title: 'Calidad Garantizada',
                  desc: 'Productos seleccionados con los más altos estándares de calidad',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
                },
                {
                  num: '02',
                  title: 'Pago Seguro',
                  desc: 'Después de contactarnos, comprá seguro con Mercado Pago',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
                },
                {
                  num: '03',
                  title: 'Envío Rápido',
                  desc: 'Envíos a todo el país con las mejores empresas de logística',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="group flex items-start gap-4 p-6 rounded-2xl border border-gray-100 hover:border-[#FA8F01]/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300"
                    style={{ background: 'rgba(250,143,1,0.08)' }}
                  >
                    <svg className="w-5 h-5 text-[#FA8F01]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.2em] text-[#B45309] uppercase mb-1">{item.num}</div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Productos Destacados ──────────────────────────────── */}
        <section className="section bg-gray-50">
          <div className="container-custom">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B45309] mb-2">Selección especial</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Productos Destacados
                </h2>
              </div>
              <Link
                href="/productos"
                className="text-sm font-semibold text-[#B45309] hover:text-[#8A3207] transition-colors flex items-center gap-1.5 shrink-0"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-72 rounded-2xl bg-white shadow-sm animate-pulse" />
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center text-gray-400 mb-8 py-12">
                Aun no hay productos destacados.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="text-center">
              <Link href="/productos" className="btn btn-primary text-base px-10">
                Ver todos los productos
              </Link>
            </div>

          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section
          className="section relative overflow-hidden text-white"
          style={{ background: 'linear-gradient(135deg, #1C1510 0%, #251A0E 50%, #1C1510 100%)' }}
        >
          {/* tile grid texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(250,143,1,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(250,143,1,0.06) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
          {/* warm radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(250,143,1,0.18) 0%, transparent 70%)' }}
          />

          <div className="container-custom relative z-10 text-center">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#FA8F01] mb-4">
              Catálogo completo
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              ¿Listo para{' '}
              <span className="text-[#FA8F01]">comprar?</span>
            </h2>
            <p className="text-base md:text-lg mb-8 text-gray-400 max-w-md mx-auto leading-relaxed">
              Explora nuestro catálogo completo y encontrá el piso o revestimiento ideal para tu espacio
            </p>
            <Link href="/productos" className="btn btn-primary text-base px-10">
              Explorar catálogo
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
