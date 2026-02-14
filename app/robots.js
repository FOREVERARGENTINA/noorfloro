export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/checkout', '/carrito'],
      },
    ],
    sitemap: 'https://noorfloro.com.ar/sitemap.xml',
    host: 'https://noorfloro.com.ar',
  }
}
