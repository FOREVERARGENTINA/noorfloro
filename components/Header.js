'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const total = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(total)
    }

    updateCartCount()

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount)
    return () => window.removeEventListener('cartUpdated', updateCartCount)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom" aria-label="Navegación principal">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded">
            <img src="/images/logo.png" alt="TiendaOnline" className="h-10 w-auto" />
            <span className="sr-only">TiendaOnline</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-2 py-1">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-700 hover:text-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-2 py-1">
              Productos
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-2 py-1">
              Contacto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden tap-target flex items-center justify-center text-gray-700 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-sky-600 transition-colors tap-target px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="text-gray-700 hover:text-sky-600 transition-colors tap-target px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                href="/contacto"
                className="text-gray-700 hover:text-sky-600 transition-colors tap-target px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
