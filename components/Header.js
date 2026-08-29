'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="container-custom" aria-label="Navegación principal">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/images/logo.webp" alt="NOORFLORO" className="h-10 w-auto" />
            <span className="sr-only">NOORFLORO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/productos', label: 'Productos' },
              { href: '/contacto', label: 'Contacto' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-[15px] font-medium text-gray-500 hover:text-[#FA8F01] transition-colors duration-200 py-1 group"
              >
                {label}
                <span
                  className="absolute bottom-0 left-0 h-[1.5px] w-0 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ background: '#FA8F01' }}
                />
              </Link>
            ))}

            <span className="w-px h-4 bg-gray-200" aria-hidden="true" />

            <Link
              href="/admin"
              className="flex items-center text-gray-400 hover:text-[#FA8F01] transition-colors duration-200 py-1"
              aria-label="Administración"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>

          {/* Mobile: user icon + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-[#FA8F01] transition-colors duration-200"
              aria-label="Administración"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-[#FA8F01] transition-colors duration-200"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/productos', label: 'Productos' },
              { href: '/contacto', label: 'Contacto' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center px-2 py-3 text-[15px] font-medium text-gray-600 hover:text-[#FA8F01] border-b border-gray-50 transition-colors duration-200 last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

      </nav>
    </header>
  )
}
