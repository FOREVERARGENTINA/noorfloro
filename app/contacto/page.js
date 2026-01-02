import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="w-full px-6 py-12 flex-grow">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contacto</h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: map and contact info (larger) */}
            <div className="md:col-span-8">
              <p className="mb-4">Av. Maipú 3366<br />Olivos – Vicente López – Buenos Aires</p>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
                <div className="w-full h-72 md:h-[520px] rounded overflow-hidden shadow-md">
                  <iframe
                    src="https://www.google.com/maps?q=Av.+Maip%C3%BA+3366+Olivos&output=embed"
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="NOORFLORO - Ubicación"
                  />
                </div>
              </div>

              <p className="mb-4">
                <strong>Tel:</strong> <a href="tel:+541162961526" className="text-sky-600 hover:underline">(11) 6296-1526</a>
              </p>
              <p className="mb-6">
                <strong>Horarios:</strong><br />Lunes a viernes 9:30 a 17:00 hs<br />Sábados 9:30 a 13:00 hs
              </p>
            </div>

            {/* Right: contact form */}
            <div className="md:col-span-4">
              <h2 className="text-xl font-semibold mb-3">Enviar mensaje</h2>
              <form action="mailto:info@tiendaonline.com" method="post" encType="text/plain" className="grid gap-4">
                <input name="name" type="text" placeholder="Tu nombre" className="input" required />
                <input name="email" type="email" placeholder="Tu email" className="input" required />
                <textarea name="message" placeholder="Mensaje" rows="8" className="input" required />
                <button className="btn btn-primary" type="submit">Enviar</button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
