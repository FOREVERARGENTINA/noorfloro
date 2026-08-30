import './globals.css'
import Script from 'next/script'
import { Manrope, Space_Grotesk } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://noorfloro.com.ar'),
  title: 'NOORFLORO - Pisos y Revestimientos de Calidad',
  description: 'Especialistas en pisos flotantes, vinílicos, baldosas autoadhesivas, césped sintético, alfombras y revestimientos para pared. Envíos a todo el país.',
  keywords: ['pisos flotantes', 'pisos vinílicos', 'baldosas autoadhesivas', 'césped sintético', 'alfombras', 'revestimientos', 'noorfloro'],
  authors: [{ name: 'NOORFLORO' }],
  creator: 'Hernan de FrandoWeb',
  publisher: 'NOORFLORO',
  icons: {
    icon: '/images/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://noorfloro.com.ar',
    siteName: 'NOORFLORO',
    title: 'NOORFLORO - Pisos y Revestimientos de Calidad',
    description: 'Especialistas en pisos flotantes, vinílicos, baldosas autoadhesivas, césped sintético, alfombras y revestimientos para pared',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'NOORFLORO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOORFLORO - Pisos y Revestimientos de Calidad',
    description: 'Especialistas en pisos flotantes, vinílicos, baldosas autoadhesivas, césped sintético, alfombras y revestimientos',
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
    <html lang="es" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SPY6DL688C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SPY6DL688C');
          `}
        </Script>

        {/* Author / Creator (internal credit) */}
        <link rel="author" href="https://www.frandoweb.com.ar/" />
        <meta name="author" content="Hernan de FrandoWeb" />
        <meta name="creator" content="Hernan de FrandoWeb" />

        {/* Social profile links for verification / metadata */}
        <link rel="me" href="https://www.instagram.com/Noorfloro23" />
        <link rel="me" href="https://www.facebook.com/p/Noorfloro-100070396863140/" />

        {/* Open Graph helpers for social platforms */}
        <meta property="og:see_also" content="https://www.instagram.com/Noorfloro23" />
        <meta property="og:see_also" content="https://www.facebook.com/p/Noorfloro-100070396863140/" />
        <meta property="article:publisher" content="https://www.facebook.com/p/Noorfloro-100070396863140/" />
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
