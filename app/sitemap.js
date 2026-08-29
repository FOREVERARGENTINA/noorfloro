import { getProducts } from '@/lib/publicProducts'

const SITE_URL = 'https://noorfloro.com.ar'

export const revalidate = 3600

export default async function sitemap() {
  const now = new Date()

  // Las fichas de producto son SSG: entran al sitemap.
  let productEntries = []
  try {
    const products = await getProducts()
    productEntries = products.map(product => ({
      url: `${SITE_URL}/producto/${product.slug || product.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error building product sitemap entries:', error)
  }

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/envios`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...productEntries,
  ]
}
