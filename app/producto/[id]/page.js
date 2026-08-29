import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGallery from '@/components/ProductGallery'
import { formatPrice, getCategoryName } from '@/lib/products'
import { getProductById, getProducts } from '@/lib/publicProducts'

export const revalidate = 3600

// Catalogo chico y estable: se prerenderizan todas las fichas en build.
export async function generateStaticParams() {
  try {
    const products = await getProducts()
    return products.map(product => ({ id: String(product.slug || product.id) }))
  } catch (error) {
    console.error('Error generating product params:', error)
    return []
  }
}

async function loadProduct(id) {
  try {
    return await getProductById(id)
  } catch (error) {
    console.error('Error loading product:', error)
    return null
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await loadProduct(id)

  if (!product) {
    return { title: 'Producto no encontrado | NOORFLORO' }
  }

  // La descripcion es HTML (viene del editor del admin): se limpia para el meta.
  const plainDescription = String(product.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)

  const image = Array.isArray(product.images) ? product.images.filter(Boolean)[0] : null

  return {
    title: `${product.name} | NOORFLORO`,
    description: plainDescription || `${product.name} - Consultanos por medidas, variantes y stock.`,
    alternates: { canonical: `/producto/${product.slug || product.id}` },
    openGraph: {
      title: product.name,
      description: plainDescription,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params
  const product = await loadProduct(id)

  if (!product) {
    notFound()
  }

  const stockValue = Number.isFinite(product.stock) ? product.stock : 0
  const hasStock = stockValue > 0
  const categoryLabel = getCategoryName(product.category) || product.category || 'Producto'
  const productSlug = product.slug || product.id

  const waNumber = '5491162961526'
  const waText = `Hola, quisiera consultar por el producto: ${product.name} (ID: ${productSlug}). /producto/${productSlug}`
  const getWaLink = () => `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`

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
            <ProductGallery product={product} />

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

      <Footer />
    </div>
  )
}
