'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { formatPrice, getCategoryName } from '@/lib/products'
import { getProductById } from '@/lib/firebase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BLUR_BASE64 = "data:image/gif;base64,R0lGODlhAQABAAAAACw="

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mainImageLoaded, setMainImageLoaded] = useState(false)

  const thumbContainerRef = useRef(null)
  const lastTapRef = useRef(0)
  const touchStartXRef = useRef(null)
  const touchDeltaRef = useRef(0)

  const images = useMemo(() => {
    return Array.isArray(product?.images) ? product.images.filter(Boolean) : []
  }, [product?.images])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await getProductById(params.id)
        if (!data) {
          setNotFound(true)
          setProduct(null)
          return
        }
        setProduct(data)
      } catch (error) {
        console.error('Error loading product:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (params?.id) {
      loadProduct()
    }
  }, [params?.id])

  useEffect(() => {
    setActiveImageIndex(0)
  }, [product?.id])

  useEffect(() => {
    if (!isLightboxOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false)
      }
      if (event.key === 'ArrowLeft' && images.length > 1) {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
      }
      if (event.key === 'ArrowRight' && images.length > 1) {
        setActiveImageIndex((prev) => (prev + 1) % images.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isLightboxOpen, images.length])

  useEffect(() => {
    // reset zoom when closing lightbox or changing image
    setIsZoomed(false)
    setMainImageLoaded(false)
  }, [isLightboxOpen, activeImageIndex])

  const activeImage = images[activeImageIndex] || images[0]

  // fallback: si onLoadingComplete no se dispara (p. ej. cached images)
  // evitamos que la galería quede oculta indefinidamente
  useEffect(() => {
    if (!activeImage) return
    const t = setTimeout(() => setMainImageLoaded(true), 1200)
    return () => clearTimeout(t)
  }, [activeImage])
  const stockValue = Number.isFinite(product?.stock) ? product.stock : 0
  const hasStock = stockValue > 0
  const categoryLabel = getCategoryName(product?.category) || product?.category || 'Producto'

  const openLightbox = (index) => {
    if (!images.length) return
    setActiveImageIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const showPrev = () => {
    if (images.length < 2) return
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const showNext = () => {
    if (images.length < 2) return
    setActiveImageIndex((prev) => (prev + 1) % images.length)
  }

  const onMainImageLoad = () => {
    setMainImageLoaded(true)
  }

  const handleImageError = (e) => {
    try {
      // fallback to a simple inline SVG placeholder
      e.currentTarget.src = '/images/placeholder.svg'
    } catch (err) {
      // ignore
    }
  }

  const toggleZoom = () => setIsZoomed((z) => !z)

  const onThumbPrev = () => {
    const el = thumbContainerRef.current
    if (!el) return
    el.scrollBy({ left: -180, behavior: 'smooth' })
  }

  const onThumbNext = () => {
    const el = thumbContainerRef.current
    if (!el) return
    el.scrollBy({ left: 180, behavior: 'smooth' })
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && touchStartXRef.current !== null) {
      const x = e.touches[0].clientX
      touchDeltaRef.current = x - touchStartXRef.current
    }
  }

  const handleTouchEnd = (e) => {
    const delta = touchDeltaRef.current
    const threshold = 50
    if (delta > threshold) {
      showPrev()
    } else if (delta < -threshold) {
      showNext()
    }
    touchStartXRef.current = null
    touchDeltaRef.current = 0
  }

  const handleLightboxTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      // double tap -> toggle zoom
      toggleZoom()
      lastTapRef.current = 0
      return
    }
    lastTapRef.current = now
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container-custom px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container-custom px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
            <button
              onClick={() => router.back()}
              className="btn btn-primary px-6 py-2"
            >
              Volver
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const waNumber = '5491162961526'
  const productSlug = product.slug || product.id || params.id
  const getWaLink = () => {
    const url = `/producto/${productSlug}`
    const text = `Hola, quisiera consultar por el producto: ${product.name} (ID: ${productSlug}). ${url}`
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main id="main-content" className="relative overflow-x-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#FA8F01]/20 blur-3xl"></div>
          <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-[#0EA5E9]/10 blur-3xl"></div>
        </div>

        <div className="container-custom relative py-3 lg:py-5">

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <section className="rounded-3xl bg-white p-4 shadow-xl shadow-slate-200/40 min-w-0 overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors group"
                    aria-label="Volver"
                  >
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-noorfloro-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700">Volver</span>
                  </button>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Galeria</p>
                    <p className="hidden sm:block text-sm text-slate-600">Imagenes del producto</p>
                  </div>
                </div>
                <button
                  onClick={() => openLightbox(activeImageIndex)}
                  className="shrink-0 whitespace-nowrap rounded-full bg-[#FA8F01] hover:bg-[#E85A2B] px-4 py-2 text-xs font-semibold text-white transition-all shadow-md hover:shadow-lg cursor-pointer"
                  title="Ver galería completa"
                >
                  {images.length || 0} {images.length === 1 ? 'foto' : 'fotos'}
                </button>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_10px_30px_-8px_rgba(2,6,23,0.12)]">
                {activeImage ? (
                  <div
                    className="relative inset-0 h-full w-full transition-opacity duration-500 opacity-100"
                    onDoubleClick={toggleZoom}
                  >
                    {/* skeleton mientras carga (evita que la galería quede en gris indefinido) */}
                    {!mainImageLoaded && (
                      <div className="absolute inset-0 rounded-2xl bg-slate-100 animate-pulse"></div>
                    )}

                    <button
                      type="button"
                      onClick={() => openLightbox(activeImageIndex)}
                      className="group absolute inset-0 cursor-pointer"
                      aria-label="Abrir imagen en detalle"
                    >
                      <Image
                        src={activeImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className={`object-cover transition-all duration-700 ease-out ${isZoomed ? 'scale-150' : 'scale-100 group-hover:scale-[1.03]'}`}
                        onLoadingComplete={onMainImageLoad}
                        onError={handleImageError}
                        placeholder="blur"
                        blurDataURL={BLUR_BASE64}
                        priority
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-2xl bg-white/95 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-slate-900 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            🔍 Ver en detalle
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    Sin imagen
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-4 relative">
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 hidden sm:block z-10">
                    <button 
                      onClick={onThumbPrev} 
                      aria-label="Anterior" 
                      className="tap-target px-2 py-2 bg-white/90 rounded-full shadow-[0_6px_18px_-6px_rgba(2,6,23,0.12)] hover:bg-white transition-all"
                    >
                      &larr;
                    </button>
                  </div>

                  <div ref={thumbContainerRef} className="mt-2 flex gap-3 overflow-x-auto py-2 hide-scrollbar [-webkit-overflow-scrolling:touch] [scroll-behavior:smooth]">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-square min-w-[72px] max-w-[72px] overflow-hidden rounded-xl transition-all duration-[180ms] ease-in-out hover:-translate-y-1.5 hover:scale-[1.02] ${
                          activeImageIndex === index 
                            ? 'border-2 !border-[#FA8F01] shadow-[0_6px_18px_-6px_rgba(250,143,1,0.25)]' 
                            : 'border border-transparent hover:border-slate-200'
                        }`}
                        aria-pressed={activeImageIndex === index}
                        aria-label={`Ver imagen ${index + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          sizes="72px"
                          className="object-cover"
                          loading="lazy"
                          onError={handleImageError}
                          placeholder="blur"
                          blurDataURL={BLUR_BASE64}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden sm:block z-10">
                    <button 
                      onClick={onThumbNext} 
                      aria-label="Siguiente" 
                      className="tap-target px-2 py-2 bg-white/90 rounded-full shadow-[0_6px_18px_-6px_rgba(2,6,23,0.12)] hover:bg-white transition-all"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Calidad</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Materiales seleccionados para alto transito y terminaciones prolijas.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Asesoria</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Te ayudamos con medidas, instalacion y combinaciones ideales.
                  </p>
                </div>
              </div>
            </section>

            <aside className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/40 lg:sticky lg:top-24 min-w-0 overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-500">
                  {categoryLabel}
                </span>
                <span className="rounded-full bg-[#FA8F01]/10 px-3 py-1 text-[10px] text-[#B45309]">
                  Noorfloro
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl font-display break-words">
                {product.name}
              </h1>
              <div
                className="mt-3 text-base text-slate-600 product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xl font-bold text-[#0EA5E9]">
                    {formatPrice(product.price)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      stockValue > 10
                        ? 'bg-emerald-100 text-emerald-700'
                        : stockValue > 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {hasStock ? `${stockValue} disponibles` : 'Sin stock'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Consultanos por medidas, variantes y stock actualizado.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                {!hasStock ? (
                  <button className="w-full rounded-xl bg-slate-200 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed">
                    Sin stock
                  </button>
                ) : (
                  <a
                    href={getWaLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full py-3 text-sm font-semibold"
                  >
                    Consultar por este producto
                  </a>
                )}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 text-center">
                    Envios a todo el pais
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 text-center">
                    Atencion personalizada
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 text-xs">
                  <p className="uppercase tracking-[0.2em] text-[10px] text-slate-400">Categoria</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{categoryLabel}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 text-xs">
                  <p className="uppercase tracking-[0.2em] text-[10px] text-slate-400">Codigo</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700 break-all">{productSlug}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <h2 className="text-sm font-semibold text-slate-800">Necesitas asesoramiento?</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Respondemos rapido por WhatsApp y te ayudamos a elegir el producto ideal.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {isLightboxOpen && activeImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm" onClick={closeLightbox}>
          <div
            className="relative mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center px-4 py-6"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClickCapture={handleLightboxTap}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-200 hover:rotate-90 group"
              aria-label="Cerrar lightbox"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={showPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 shadow-2xl"
                aria-label="Imagen anterior"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div className="relative h-[75vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm">
              <div
                className={`h-full w-full transition-transform duration-300 ${isZoomed ? 'cursor-grab scale-150' : 'cursor-pointer'}`}
                onDoubleClick={toggleZoom}
              >
                <Image
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-contain transition-opacity duration-500"
                  onError={handleImageError}
                  placeholder="blur"
                  blurDataURL={BLUR_BASE64}
                />
              </div>
              
              {isZoomed && (
                <div className="absolute top-4 left-4 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white">
                  🔍 Zoom activado • Doble click para salir
                </div>
              )}
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 shadow-2xl"
                aria-label="Imagen siguiente"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              <div className="rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white shadow-2xl">
                {activeImageIndex + 1} / {images.length}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 max-w-md overflow-x-auto hide-scrollbar px-2">
                  {images.map((img, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                        idx === activeImageIndex
                          ? 'border-white scale-110 shadow-2xl'
                          : 'border-white/30 hover:border-white/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
