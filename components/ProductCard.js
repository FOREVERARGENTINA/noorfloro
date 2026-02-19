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
    <article className="group bg-white rounded-2xl border border-gray-100 hover:border-[#FA8F01]/30 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">

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
          <h3 className="font-semibold text-[15px] text-gray-900 mb-1.5 line-clamp-2 group-hover:text-[#FA8F01] transition-colors duration-200 leading-snug">
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
      <div className="px-4 pb-4">
        {product.stock === 0 ? (
          <button
            className="btn w-full text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
            style={{ boxShadow: 'none' }}
            disabled
          >
            Sin stock
          </button>
        ) : (
          <a
            href={getWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full text-sm"
            aria-label={`Consultar por ${product.name} vía WhatsApp`}
          >
            Consultar por WhatsApp
          </a>
        )}
      </div>

    </article>
  )
}
