import './globals.css'

export const metadata = {
  metadataBase: new URL('https://tutienda.com'),
  title: 'Tienda Online - Los mejores productos al mejor precio',
  description: 'Encuentra productos de calidad con envíos a todo el país. Compra seguro con Mercado Pago.',
  keywords: ['tienda online', 'e-commerce', 'compras', 'productos'],
  authors: [{ name: 'Tienda Online' }],
  icons: {
    icon: '/images/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://tutienda.com',
    siteName: 'Tienda Online',
    title: 'Tienda Online - Los mejores productos',
    description: 'Encuentra productos de calidad con envíos a todo el país',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tienda Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tienda Online - Los mejores productos',
    description: 'Encuentra productos de calidad con envíos a todo el país',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded">
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  )
}
