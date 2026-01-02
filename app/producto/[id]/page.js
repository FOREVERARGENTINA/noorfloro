'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getProductById, formatPrice } from '@/lib/products'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  const product = getProductById(params.id)
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
            <button 
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Volver
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // WhatsApp contact link
  const waNumber = '5491162961526'
  const getWaLink = () => {
    const url = `/producto/${product.id}`
    const text = `Hola, quisiera consultar por el producto: ${product.name} (ID: ${product.id}). ${url}`
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Volver
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-full">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
              </div>
              
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.stock > 0 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                </span>
              </div>
              

              
              {product.stock === 0 ? (
                <button className="w-full py-3 px-6 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed">Sin stock</button>
              ) : (
                <a
                  href={getWaLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block py-3 px-6 rounded-lg font-medium bg-sky-600 text-white hover:bg-sky-700 text-center"
                >
                  Consultar por este producto
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}