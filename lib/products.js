// Productos reales importados desde `leer.md` - reemplaza imágenes con las tuyas en `public/images`
export const products = [
  {
    id: 1,
    name: 'Pisos 7 mm',
    description: 'Piso flotante de 7mm. Se vende por m2. Fácil y rápido de instalar. Sistema Click. Libre de mantenimiento. 3 diseños a elección.',
    price: 4990,
    stock: 100,
    category: 'pisos-7mm',
    images: ['https://plus.unsplash.com/premium_photo-1683129631372-bb53934f5b65?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    featured: true,
  },
  {
    id: 2,
    name: 'Pisos Vinílico 1.2 mm',
    description: 'Pisos vinílicos 1.2mm. Tipo de uso: decorativo. Formato de entrega en rollo. El precio publicado corresponde a 1m2. Requiere pegamento para su colocación.',
    price: 2990,
    stock: 200,
    category: 'pisos-vinilico-12mm',
    images: ['https://plus.unsplash.com/premium_photo-1663076196805-10be080a8cc2?q=80&w=1156&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    featured: false,
  },
  {
    id: 3,
    name: 'Pisos Vinílico en Rollo',
    description: 'Pisos vinílicos en rollo para uso decorativo. Entregas en rollos de 0.5m, 2.5m o 5m. Precio por m2. Requiere pegamento para su colocación.',
    price: 2790,
    stock: 150,
    category: 'pisos-vinilico-rollo',
    images: ['https://images.unsplash.com/photo-1629292116668-921112f088db?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    featured: false,
  },
  {
    id: 4,
    name: 'Piso Flotante Alto Tránsito 9 mm',
    description: 'Piso flotante comercial 9mm con capa melamínica AC4 (alto tránsito). Precio por m2. 5 colores. Medidas de tabla 1,20×30. Terminación: mate.',
    price: 7990,
    stock: 80,
    category: 'piso-flotante-9mm',
    images: ['https://images.unsplash.com/photo-1626551039948-ddd7e595fe06?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    featured: true,
  },
  {
    id: 5,
    name: 'Césped Sintético 10 mm Interior',
    description: 'Césped sintético 10 mm para uso residencial intenso. Fibra 100% polipropileno. Altura 10 mm. Ancho 2.00mts. Precio por m2.',
    price: 1490,
    stock: 300,
    category: 'cesped-10mm',
    images: ['https://images.unsplash.com/photo-1763043778073-0174fbed4170?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    featured: false,
  },
  {
    id: 6,
    name: 'Baldosas Vinílicas 30x30',
    description: 'Baldosas vinílicas autoadhesivas 30x30 simil cerámicos. Precio por caja. Se colocan sobre cerámicos, madera, mosaicos, carpetas de cemento. No requiere uso de pegamento.',
    price: 3490,
    stock: 120,
    category: 'baldosas-vinilicas',
    images: ['https://images.unsplash.com/photo-1605453170505-9a6dacd19a38?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    featured: false,
  },
]

export const categories = [
  { id: 'todos', name: 'Todos los productos', slug: 'todos' },
  { id: 'pisos-7mm', name: 'Pisos 7 mm', slug: 'pisos-7mm' },
  { id: 'pisos-vinilico-12mm', name: 'Pisos Vinílicos 1.2 mm', slug: 'pisos-vinilico-12mm' },
  { id: 'pisos-vinilico-rollo', name: 'Pisos Vinílicos en Rollo', slug: 'pisos-vinilico-rollo' },
  { id: 'piso-flotante-9mm', name: 'Piso Flotante 9 mm', slug: 'piso-flotante-9mm' },
  { id: 'cesped-10mm', name: 'Césped Sintético 10 mm', slug: 'cesped-10mm' },
  { id: 'baldosas-vinilicas', name: 'Baldosas Vinílicas', slug: 'baldosas-vinilicas' },
]

// Helper functions
export function getProductById(id) {
  return products.find(product => product.id === parseInt(id))
}

export function getProductsByCategory(category) {
  if (category === 'todos') return products
  return products.filter(product => product.category === category)
}

export function getFeaturedProducts() {
  const featured = products.filter(product => product.featured)
  if (featured.length >= 3) return featured.slice(0, 3)
  // Si hay menos de 3 destacados, completar con otros productos
  const othersNeeded = 3 - featured.length
  const others = products.filter(product => !product.featured).slice(0, othersNeeded)
  return featured.concat(others)
}

export function formatPrice(price) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getCategoryName(categoryId) {
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.name : 'Categoría'
}
