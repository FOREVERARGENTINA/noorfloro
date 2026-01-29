'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { categories } from '@/lib/products'
import { getProducts } from '@/lib/firebase'

export default function ProductosPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

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

        {/* Category Filter (mobile: dropdown) */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-[60] md:hidden overflow-visible">
          <div className="container-custom py-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4 md:mb-0">
              <label htmlFor="category-select" className="text-lg font-semibold">Categorías</label>
              <div className="w-full md:w-auto">
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-auto bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-noorfloro-orange"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="section">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar filters (left on md+) */}
              <aside className="hidden md:block md:w-64 lg:w-72">
                <div className="sticky top-24 bg-white p-4 rounded border">
                  <h3 className="text-lg font-semibold mb-4">Categorías</h3>
                  <div className="flex flex-col gap-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded transition-all focus:outline-none focus:ring-2 focus:ring-noorfloro-orange ${
                          selectedCategory === category.id
                            ? 'category-selected'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        aria-pressed={selectedCategory === category.id}
                        aria-label={`Filtrar por ${category.name}`}>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Products list */}
              <div className="flex-1">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
