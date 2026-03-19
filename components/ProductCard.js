'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/products'

export default function ProductCard({ product }) {
  const waNumber = '5491162961526'
  const productSlug = product.slug || product.id

  const getWaLink = () => {
    const site = process.env.NEXT_PUBLIC_SITE_URL || ''
    const url = `${site.replace(/\/$/, '')}/producto/${productSlug}`
    const text = `Hola, quisiera consultar por el producto "${product.name}". ${url}`
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
  }

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 hover:border-[#FA8F01]/30 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_2px_4px_-1px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12),0_4px_8px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col overflow-hidden min-w-0">

      <Link href={`/producto/${productSlug}`} className="block flex-1">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={`Imagen de ${product.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2.5 right-2.5 text-white text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: '#FA8F01' }}>
              ¡Últimas {product.stock}!
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2.5 right-2.5 bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              Sin stock
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-[15px] text-gray-900 mb-1.5 line-clamp-2 group-hover:text-[#FA8F01] transition-colors duration-200 leading-snug break-words">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
            {product.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
          </p>
          {product.price !== null && product.price !== undefined && !Number.isNaN(Number(product.price)) && (
            <span className="text-xl font-bold text-[#FA8F01]">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </Link>

      {/* CTA */}
      <div className="px-4 pb-4 flex items-center gap-2">
        {product.stock === 0 ? (
          <span className="flex-1 text-center text-xs font-semibold text-gray-400 bg-gray-50 rounded-xl py-2.5 border border-gray-100">
            Sin stock
          </span>
        ) : (
          <>
            <Link
              href={`/producto/${productSlug}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-white text-[13px] font-semibold py-2.5 px-3 transition-all duration-200 hover:brightness-110 hover:-translate-y-px hover:shadow-md"
              style={{ background: 'linear-gradient(90deg, #FA8F01 0%, #FF8C61 100%)' }}
              aria-label={`Ver detalle de ${product.name}`}
            >
              Ver producto
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-green-600 transition-colors duration-200"
              aria-label={`Consultar por ${product.name} vía WhatsApp`}
              title="Consultar por WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </>
        )}
      </div>

    </article>
  )
}
