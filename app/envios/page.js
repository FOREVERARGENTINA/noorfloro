import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Informacion de Envios | NOORFLORO',
  description:
    'Informacion de envios de NOORFLORO: cobertura, plazos, costos, retiro en tienda y seguimiento.',
}

const shippingItems = [
  {
    title: 'Cobertura',
    text: 'Realizamos envios en CABA, GBA y al resto del pais mediante operadores logisticos disponibles para cada zona.',
  },
  {
    title: 'Plazos estimados',
    text: 'El plazo de entrega se confirma al validar stock, destino y medio de transporte. Los tiempos publicados son estimados.',
  },
  {
    title: 'Costo de envio',
    text: 'El costo depende del volumen, peso, distancia y operador. Se informa antes de confirmar el pedido.',
  },
  {
    title: 'Retiro en tienda',
    text: 'Tambien podes retirar por Av. Maipu 3366, Olivos, en horario comercial, coordinando previamente por WhatsApp.',
  },
  {
    title: 'Seguimiento',
    text: 'Cuando el operador lo permite, compartimos numero de guia o estado de despacho para seguimiento.',
  },
  {
    title: 'Incidencias',
    text: 'Si el pedido llega con danos visibles, reportalo dentro de las primeras 24 horas con fotos y datos del envio.',
  },
  {
    title: 'Datos de entrega',
    text: 'El cliente debe informar direccion completa, referencia, telefono y disponibilidad para recepcion.',
  },
  {
    title: 'Demoras externas',
    text: 'Pueden existir demoras por clima, alta demanda, feriados o contingencias del operador logistico.',
  },
]

export default function EnviosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-grow bg-gray-50">
        <section
          className="relative overflow-hidden text-white py-14"
          style={{ background: 'linear-gradient(135deg, #1C1510 0%, #251A0E 50%, #1C1510 100%)' }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(250,143,1,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(250,143,1,0.06) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(250,143,1,0.15) 0%, transparent 70%)' }}
          />

          <div className="container-custom relative z-10">
            <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#FA8F01] mb-2">
              Logistica y entregas
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Informacion de <span className="text-[#FA8F01]">Envios</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
              Ultima actualizacion: 14 de febrero de 2026.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Estas condiciones aplican a compras coordinadas por nuestros canales oficiales.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shippingItems.map((item) => (
                  <article key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <h2 className="text-sm md:text-base font-bold text-gray-900 mb-1">{item.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-white border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-1">Coordinar envio</h3>
                <p className="text-sm text-gray-600">
                  Para cotizar o coordinar entregas, escribinos por{' '}
                  <a
                    className="text-[#FA8F01] hover:underline"
                    href="https://wa.me/5491162961526"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>{' '}
                  o por email a{' '}
                  <a className="text-[#FA8F01] hover:underline" href="mailto:noorfloro23@hotmail.com">
                    noorfloro23@hotmail.com
                  </a>
                  .
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
