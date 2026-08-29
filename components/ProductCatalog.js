'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { categories } from '@/lib/products'

/**
 * Filtro de categorias + grilla.
 * Recibe los productos ya resueltos en el servidor: el HTML inicial
 * llega con todos los productos renderizados y el filtro solo los oculta.
 */
export default function ProductCatalog({ products }) {
  const [selectedCategory, setSelectedCategory] = useState('todos')

  const filteredProducts = selectedCategory === 'todos'
    ? products
    : products.filter(product => product.category === selectedCategory)

  return (
    <>
      {/* ── Mobile Category Filter ───────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100 sticky top-16 z-40 md:hidden">
        <div className="container-custom py-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#FA8F01]"
            aria-label="Filtrar por categoría"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* ── Products Grid ────────────────────────────────────── */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-6">

            {/* Sidebar */}
            <aside className="hidden md:block md:w-56 lg:w-64 shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#FA8F01] mb-3">
                  Filtrar por
                </p>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Categorías</h3>
                <div className="flex flex-col gap-1">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      aria-pressed={selectedCategory === category.id}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'font-semibold text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      style={selectedCategory === category.id
                        ? { background: '#FA8F01' }
                        : {}
                      }
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(250,143,1,0.08)' }}>
                    <svg className="w-7 h-7 text-[#FA8F01]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Sin productos en esta categoría</h3>
                  <p className="text-gray-500 text-sm mb-5">Probá con otra categoría del menú lateral</p>
                  <button
                    onClick={() => setSelectedCategory('todos')}
                    className="btn btn-primary"
                  >
                    Ver todos los productos
                  </button>
                </div>

              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-xs text-gray-400 font-medium">
                      <span className="text-gray-900 font-bold">{filteredProducts.length}</span>{' '}
                      {filteredProducts.length === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
    </>
  )
}
