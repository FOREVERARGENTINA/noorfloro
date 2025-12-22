'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/products'

export default function ProductCard({ product }) {
  const waNumber = '5491162961526'

  const getWaLink = () => {
    const url = `/producto/${product.id}`
    const text = `Hola, quisiera consultar por el producto: ${product.name} (ID: ${product.id}) – ${url}`
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
  }

  return (
    <article className="card group">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square bg-gray-200 overflow-hidden">
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

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-sky-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        {product.stock === 0 ? (
          <button className="btn w-full bg-gray-300 text-gray-500 cursor-not-allowed" disabled aria-label={`${product.name} sin stock`}>Sin stock</button>
        ) : (
          <a
            href={getWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full"
            aria-label={`Consultar por ${product.name} vía WhatsApp`}
          >
            Consultar por este producto
          </a>
        )}
      </div>
    </article>
  )
}
