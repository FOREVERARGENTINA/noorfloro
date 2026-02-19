import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-grow">

        {/* ── Page Header ─────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-white py-14"
          style={{ background: 'linear-gradient(135deg, #1C1510 0%, #251A0E 50%, #1C1510 100%)' }}
        >
          {/* tile grid texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(250,143,1,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(250,143,1,0.06) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
          {/* warm radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(250,143,1,0.15) 0%, transparent 70%)' }}
          />
          <div className="container-custom relative z-10">
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#FA8F01] mb-2">
              Estamos para ayudarte
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              <span className="text-[#FA8F01]">Contacto</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Visitanos en nuestra tienda o escribinos. Respondemos a la brevedad.
            </p>
          </div>
        </section>

        {/* ── Info Cards ──────────────────────────────────────── */}
        <section className="bg-gray-50 border-b border-gray-100 py-6">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

              {/* Dirección */}
              <a
                href="https://maps.google.com/?q=Av.+Maipú+3366,+Olivos,+Buenos+Aires"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#FA8F01]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(250,143,1,0.08)' }}>
                  <svg className="w-4 h-4 text-[#FA8F01]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-0.5">Dirección</div>
                  <div className="text-sm font-semibold text-gray-800 leading-snug">Av. Maipú 3366</div>
                  <div className="text-xs text-gray-500 leading-snug">Olivos, Vicente López</div>
                </div>
              </a>

              {/* Teléfono / WhatsApp */}
              <a
                href="https://wa.me/5491162961526"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#FA8F01]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(250,143,1,0.08)' }}>
                  <svg className="w-4 h-4 text-[#FA8F01]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-0.5">WhatsApp</div>
                  <div className="text-sm font-semibold text-gray-800">(11) 6296-1526</div>
                  <div className="text-xs text-gray-500">Escribinos ahora</div>
                </div>
              </a>

              {/* Teléfono fijo */}
              <a
                href="tel:+541147115185"
                className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#FA8F01]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(250,143,1,0.08)' }}>
                  <svg className="w-4 h-4 text-[#FA8F01]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-0.5">Teléfono fijo</div>
                  <div className="text-sm font-semibold text-gray-800">(11) 4711-5185</div>
                  <div className="text-xs text-gray-500">Llamanos directamente</div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:noorfloro23@hotmail.com"
                className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#FA8F01]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(250,143,1,0.08)' }}>
                  <svg className="w-4 h-4 text-[#FA8F01]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-0.5">Email</div>
                  <div className="text-sm font-semibold text-gray-800 break-all">noorfloro23@hotmail.com</div>
                </div>
              </a>

              {/* Horarios */}
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(250,143,1,0.08)' }}>
                  <svg className="w-4 h-4 text-[#FA8F01]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-0.5">Horarios</div>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-semibold">Lun–Vie</span> 9:30–17:00 hs<br />
                    <span className="font-semibold">Sábados</span> 9:30–13:00 hs
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Map + Form ──────────────────────────────────────── */}
        <section className="section bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Map */}
              <div className="lg:col-span-7">
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#FA8F01] mb-2">Cómo llegar</p>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ubicación</h2>
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: '460px' }}>
                  <iframe
                    src="https://www.google.com/maps?q=Noorfloro,+Av.+Maip%C3%BA+3366,+Olivos,+Buenos+Aires&z=19&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="NOORFLORO - Ubicación"
                  />
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-5">
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#FA8F01] mb-2">Escribinos</p>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Enviar mensaje</h2>

                <form
                  action="mailto:noorfloro23@hotmail.com"
                  method="post"
                  encType="text/plain"
                  autoComplete="off"
                  className="flex flex-col gap-3"
                >
                  <div>
                    <label className="label" htmlFor="contact-name">Tu nombre</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Juan García"
                      className="input"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-email">Tu email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="juan@email.com"
                      className="input"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-message">Mensaje</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="¿En qué podemos ayudarte?"
                      rows={7}
                      className="input resize-none"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full mt-1">
                    Enviar mensaje
                  </button>
                </form>

                <p className="text-xs text-gray-400 mt-3 text-center">
                  También podés escribirnos por{' '}
                  <a href="https://wa.me/5491162961526" target="_blank" rel="noopener noreferrer" className="text-[#FA8F01] hover:underline font-medium">
                    WhatsApp
                  </a>
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
