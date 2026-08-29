import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCatalog from '@/components/ProductCatalog'
import { getProducts } from '@/lib/publicProducts'

export const revalidate = 3600

export const metadata = {
  title: 'Productos - Pisos, Revestimientos y Baldosas | NOORFLORO',
  description: 'Catálogo completo de pisos flotantes, vinílicos, baldosas autoadhesivas y revestimientos. Envíos a todo el país.',
  alternates: { canonical: '/productos' },
}

export default async function ProductosPage() {
  // Server Component: los productos van en el HTML inicial (indexables).
  let products = []
  try {
    products = await getProducts()
  } catch (error) {
    console.error('Error loading products:', error)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-grow">

        {/* ── Page Header ─────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-white py-14"
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
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(250,143,1,0.15) 0%, transparent 70%)' }}
          />
          <div className="container-custom relative z-10">
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#FA8F01] mb-2">
              Catálogo completo
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Nuestros <span className="text-[#FA8F01]">Productos</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Pisos, revestimientos y más — encontrá lo que necesitás para tu espacio.
            </p>
          </div>
        </section>

        <ProductCatalog products={products} />

      </main>

      <Footer />
    </div>
  )
}
