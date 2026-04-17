export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        // Explicitly allow the llms.txt file so crawlers/LLMs can fetch it
        allow: ['/', '/llms.txt'],
        disallow: ['/admin', '/checkout', '/carrito'],
      },
    ],
    sitemap: 'https://noorfloro.com.ar/sitemap.xml',
    host: 'https://noorfloro.com.ar',
  }
}
