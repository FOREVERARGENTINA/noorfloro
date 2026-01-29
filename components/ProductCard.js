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
    <article className="card group h-full flex flex-col">
      <Link href={`/producto/${productSlug}`} className="block flex-1">
        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={`Imagen de ${product.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-warning text-white text-xs font-bold px-2 py-1 rounded" aria-label={`Solo quedan ${product.stock} unidades`}>
              ¡Últimas {product.stock}!
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-error text-white text-xs font-bold px-2 py-1 rounded">
              Sin stock
            </span>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-gray-600 text-base mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-sky-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6">
        {product.stock === 0 ? (
          <button className="btn w-full py-3 bg-gray-300 text-gray-500 cursor-not-allowed" disabled aria-label={`${product.name} sin stock`}>Sin stock</button>
        ) : (
          <a
            href={getWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full py-3"
            aria-label={`Consultar por ${product.name} vía WhatsApp`}
          >
            Consultar por este producto
          </a>
        )}
      </div>
    </article>
  )
}
