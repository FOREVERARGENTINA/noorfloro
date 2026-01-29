'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { categories, formatPrice, getCategoryName } from '@/lib/products'
import { getProducts, getProductById, deleteProduct, updateProduct, setProduct, uploadProductImage } from '@/lib/firebase'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
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
    images: [],
    featured: false,
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Load products from Firestore on mount
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
      setFilteredProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
      alert('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

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

  const slugify = (value) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price !== null && product.price !== undefined ? product.price.toString() : '',
      stock: product.stock.toString(),
      category: product.category,
      images: product.images && product.images.length ? product.images : [],
      featured: product.featured,
    })
    setImageFiles([])
    setImagePreviews(product.images && product.images.length ? product.images : [])
    setShowModal(true)
  }

  const handleDelete = async (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId)
        setProducts(prev => prev.filter(p => p.id !== productId))
        alert('Producto eliminado correctamente')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error al eliminar el producto')
      }
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])

    if (imagePreviews.length > 0) {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }

    if (files.length === 0) {
      setImageFiles([])
      setImagePreviews(formData.images || [])
      return
    }

    const invalidFile = files.find(file => !file.type.startsWith('image/'))
    if (invalidFile) {
      alert('Selecciona solo archivos de imagen válidos.')
      return
    }

    setImageFiles(files)
    setImagePreviews(files.map(file => URL.createObjectURL(file)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const parsedPrice = formData.price === '' ? null : Number(formData.price)
      const existingImages = formData.images || []

      if (imageFiles.length === 0 && existingImages.length === 0) {
        alert('Por favor, sube al menos una imagen del producto.')
        return
      }

      const slug = editingProduct ? editingProduct.id : slugify(formData.name)

      if (!editingProduct) {
        const existing = await getProductById(slug)
        if (existing) {
          alert('Ya existe un producto con ese nombre. Cambia el nombre o edita el existente.')
          return
        }
      }

      let imageUrls = existingImages
      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            const safeName = String(Date.now()) + '-' + file.name
            const cleanedName = safeName.replace(/[^a-zA-Z0-9._-]/g, '-')
            return await uploadProductImage(file, cleanedName)
          })
        )
      }

      const productData = {
        slug,
        name: formData.name,
        description: formData.description,
        price: Number.isNaN(parsedPrice) ? null : parsedPrice,
        stock: parseInt(formData.stock),
        category: formData.category,
        images: imageUrls,
        featured: formData.featured,
      }

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, productData)
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p))
        alert('Producto actualizado correctamente')
      } else {
        // Add new product
        await setProduct(slug, productData)
        setProducts(prev => [...prev, { ...productData, id: slug }])
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
        images: [],
        featured: false,
      })
      if (imagePreviews.length > 0) {
        imagePreviews.forEach((preview) => {
          if (preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview)
          }
        })
      }
      setImageFiles([])
      setImagePreviews([])
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error al guardar el producto')
    }
  }

  const openNewProductModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'medias',
      images: [],
      featured: false,
    })
    if (imagePreviews.length > 0) {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }
    setImageFiles([])
    setImagePreviews([])
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

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

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
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /producto/{editingProduct ? editingProduct.id : slugify(formData.name || '')}
                  </p>
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
                      min="0"
                      placeholder="Opcional"
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
                  <label htmlFor="imageFiles" className="label">Imágenes del Producto</label>
                  <input
                    type="file"
                    id="imageFiles"
                    name="imageFiles"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="input"
                    required={imageFiles.length === 0 && (!formData.images || formData.images.length === 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sube una o más imágenes (JPG, PNG o WebP). Tamaño recomendado: hasta 2MB cada una.
                  </p>
                  {(imagePreviews.length > 0 || (formData.images && formData.images.length > 0)) && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-2">Vista previa:</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {(imagePreviews.length > 0 ? imagePreviews : formData.images).map((src, index) => (
                          <div key={`${src}-${index}`} className="relative w-24 h-24 bg-gray-100 rounded border border-gray-200">
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ))}
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
