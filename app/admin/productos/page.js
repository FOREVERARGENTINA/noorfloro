'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { products as initialProducts, categories, formatPrice, getCategoryName } from '@/lib/products'

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'medias',
    images: ['https://via.placeholder.com/400x400/0ea5e9/ffffff?text=Producto'],
    featured: false,
  })

  useEffect(() => {
    filterProducts()
  }, [selectedCategory, searchTerm, products])

  const filterProducts = () => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      images: product.images,
      featured: product.featured,
    })
    setShowModal(true)
  }

  const handleDelete = (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== productId))
      alert('Producto eliminado correctamente')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      images: formData.images,
      featured: formData.featured,
    }

    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p))
      alert('Producto actualizado correctamente')
    } else {
      // Add new product
      setProducts(prev => [...prev, productData])
      alert('Producto agregado correctamente')
    }

    // Reset form
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'medias',
      images: ['https://via.placeholder.com/400x400/0ea5e9/ffffff?text=Producto'],
      featured: false,
    })
  }

  const openNewProductModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'medias',
      images: ['https://via.placeholder.com/400x400/0ea5e9/ffffff?text=Producto'],
      featured: false,
    })
    setShowModal(true)
  }

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-2">Gestiona tu catálogo de productos</p>
        </div>
        <button
          onClick={openNewProductModal}
          className="btn btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="label">Buscar</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="input"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="label">Categoría</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Destacado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 bg-gray-200 rounded flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`font-medium ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {product.featured ? (
                        <span className="px-2 py-1 text-xs font-medium bg-sky-100 text-sky-800 rounded-full">
                          Sí
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">Nombre del Producto</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="label">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="label">Precio (ARS)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="stock" className="label">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="input"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="label">Categoría</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input"
                  >
                    {categories.filter(cat => cat.id !== 'todos').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="imageUrl" className="label">URL de la Imagen</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.images[0]}
                    onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
                    className="input"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes usar placeholders: <a href="https://via.placeholder.com/400" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">via.placeholder.com</a> o subir tu imagen a <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">imgur.com</a>
                  </p>
                  {formData.images[0] && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Vista previa:</p>
                      <div className="relative w-32 h-32 bg-gray-100 rounded border border-gray-200">
                        <img
                          src={formData.images[0]}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400/e2e8f0/64748b?text=Error+al+cargar'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Producto destacado
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingProduct ? 'Actualizar' : 'Agregar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
