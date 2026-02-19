// ── Datos de contacto del negocio ────────────────────────
// WhatsApp / celular
export const WHATSAPP_NUMBER = '5491162961526'
export const WHATSAPP_DISPLAY = '11-6296-1526'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

// Línea fija
export const LANDLINE_DISPLAY = '11-4711-5185'
export const LANDLINE_TEL = '+541147115185'

export const categories = [
  { id: 'todos', name: 'Todos los productos', slug: 'todos' },
  { id: 'pisos-flotante-7mm', name: 'Pisos Flotante 7mm', slug: 'pisos-flotante-7mm' },
  { id: 'pisos-flotante-8mm', name: 'Pisos Flotante 8mm', slug: 'pisos-flotante-8mm' },
  { id: 'pisos-vinilico-click-4-1mm', name: 'Pisos Vinílico 4+1mm Sistema Click', slug: 'pisos-vinilico-click-4-1mm' },
  { id: 'piso-liston-autoadhesivos-1-2mm', name: 'Piso en Listón Autoadhesivos 1.2mm', slug: 'piso-liston-autoadhesivos-1-2mm' },
  { id: 'baldosas-vinilicas-50x50', name: 'Baldosas Vinílicas de 50x50 Autoadhesivas', slug: 'baldosas-vinilicas-50x50' },
  { id: 'cesped-sintetico-10mm', name: 'Césped Sintético 10mm', slug: 'cesped-sintetico-10mm' },
  { id: 'cesped-sintetico-20mm', name: 'Césped Sintético 20mm', slug: 'cesped-sintetico-20mm' },
  { id: 'cesped-sintetico-30mm', name: 'Césped Sintético 30mm', slug: 'cesped-sintetico-30mm' },
  { id: 'alfombra-boucle-doble-base', name: 'Alfombra Boucle DOBLE Base', slug: 'alfombra-boucle-doble-base' },
  { id: 'felpudos-coco-60x90-lisos', name: 'Felpudos de Coco de 60x90cm lisos', slug: 'felpudos-coco-60x90-lisos' },
  { id: 'felpudos-coco-40x60-lisos', name: 'Felpudos de Coco 40x60cm lisos', slug: 'felpudos-coco-40x60-lisos' },
  { id: 'felpudos-coco-40x60-dibujo', name: 'Felpudos de Coco 40x60cm con Dibujo', slug: 'felpudos-coco-40x60-dibujo' },
  { id: 'revestimiento-wall-panel-pvc', name: 'Revestimiento de Pared: Wall Panel de PVC', slug: 'revestimiento-wall-panel-pvc' },
  { id: 'revestimiento-placas-autoadhesivas', name: 'Revestimiento de Pared: Placas Autoadhesivas', slug: 'revestimiento-placas-autoadhesivas' },
  { id: 'zocalos', name: 'Zócalos', slug: 'zocalos' },
]

export function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(price)) {
    return 'Consultar'
  }
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
