'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice, getCategoryName } from '@/lib/products'
import { getProducts } from '@/lib/firebase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0,
    outOfStock: 0,
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const productsData = await getProducts()
        const totalProducts = productsData.length
        const lowStock = productsData.filter(p => p.stock > 0 && p.stock < 10).length
        const outOfStock = productsData.filter(p => p.stock === 0).length
        const totalValue = productsData.reduce((sum, p) => {
          const price = typeof p.price === 'number' ? p.price : 0
          const stock = typeof p.stock === 'number' ? p.stock : 0
          return sum + (price * stock)
        }, 0)

        setStats({ totalProducts, lowStock, totalValue, outOfStock })
        setRecentProducts(productsData.slice(0, 5))
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen general de tu tienda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <Link href="/admin/productos" className="text-sm text-sky-600 hover:text-sky-700 mt-4 inline-block">
            Ver todos →
          </Link>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.lowStock}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Productos con menos de 10 unidades</p>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.outOfStock}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Productos agotados</p>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatPrice(stats.totalValue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Valor total del stock</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/productos?action=new"
            className="flex items-center justify-center space-x-2 p-4 border-2 border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">Agregar Producto</span>
          </Link>

          <Link
            href="/admin/productos"
            className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="font-medium">Ver Productos</span>
          </Link>

          <Link
            href="/admin/pedidos"
            className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="font-medium">Ver Pedidos</span>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Productos Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    Cargando productos...
                  </td>
                </tr>
              ) : recentProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    Aún no hay productos cargados.
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`font-medium ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {product.stock === 0 ? (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Sin stock
                        </span>
                      ) : product.stock < 10 ? (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                          Stock bajo
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Disponible
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link href="/admin/productos" className="text-sm text-sky-600 hover:text-sky-700">
            Ver todos los productos →
          </Link>
        </div>
      </div>
    </div>
  )
}
