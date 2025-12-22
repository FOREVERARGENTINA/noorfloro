import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TiendaOnline</h3>
            <p className="text-sm">
              Tu tienda de confianza con los mejores productos y el mejor servicio. Envíos a todo el país.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Enlaces útiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded">
                  Información de envíos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1 1 0 01-1.414 0l-4.243-4.243A8 8 0 1117.657 16.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div>Av. Maipú 3366</div>
                  <div className="text-gray-400">Olivos – Vicente López – Buenos Aires</div>
                </div>
              </li>

              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+541147115185" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded">
                  (011) 4711-5185
                </a>
              </li>

              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-1 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
                <div>
                  <div>Lunes a viernes <span className="text-gray-400">9:30 a 17:00 hs</span></div>
                  <div>Sábados <span className="text-gray-400">9:30 a 13:00 hs</span></div>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded tap-target flex items-center justify-center" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded tap-target flex items-center justify-center" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} TiendaOnline. Todos los derechos reservados.</p>
          <p className="mt-2">
            <Link href="/privacidad" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded">
              Política de privacidad
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
