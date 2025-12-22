'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { products, categories } from '@/lib/products'

export default function ProductosPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos')

  const filteredProducts = selectedCategory === 'todos'
    ? products
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-grow">
        {/* Page Header */}
        <section className="bg-gray-900 text-white py-12">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Productos</h1>
            <p className="text-xl text-gray-300">Encuentra lo que necesitas al mejor precio</p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between mb-4 md:mb-0">
              <h2 className="text-lg font-semibold sr-only md:not-sr-only">Categorías:</h2>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      selectedCategory === category.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    aria-pressed={selectedCategory === category.id}
                    aria-label={`Filtrar por ${category.name}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="section">
          <div className="container-custom">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay productos en esta categoría</h3>
                <p className="text-gray-600 mb-6">Intenta seleccionar otra categoría</p>
                <button
                  onClick={() => setSelectedCategory('todos')}
                  className="btn btn-primary"
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
