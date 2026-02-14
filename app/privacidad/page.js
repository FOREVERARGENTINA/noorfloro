import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Politica de Privacidad | NOORFLORO',
  description:
    'Politica de privacidad de NOORFLORO sobre datos personales, uso de cookies y derechos del usuario.',
}

const privacySections = [
  {
    title: '1. Responsable del tratamiento',
    content:
      'NOORFLORO es responsable del tratamiento de los datos personales que compartis a traves del sitio y canales oficiales de contacto.',
  },
  {
    title: '2. Datos que podemos solicitar',
    content:
      'Podemos solicitar nombre, telefono, email, direccion de entrega y datos necesarios para gestionar consultas, cotizaciones, pedidos y postventa.',
  },
  {
    title: '3. Finalidad del uso de datos',
    content:
      'Usamos tus datos para responder consultas, coordinar compras, enviar informacion del pedido, brindar soporte y mejorar la atencion comercial.',
  },
  {
    title: '4. Base de tratamiento',
    content:
      'Tratamos datos con base en tu consentimiento, en la ejecucion de una relacion comercial y en obligaciones legales que correspondan.',
  },
  {
    title: '5. Compartir datos con terceros',
    content:
      'Podemos compartir datos con pasarelas de pago, operadores logisticos y proveedores tecnologicos, solo en la medida necesaria para prestar el servicio.',
  },
  {
    title: '6. Conservacion de informacion',
    content:
      'Conservamos los datos durante el tiempo necesario para cumplir la finalidad informada, obligaciones legales y resguardo administrativo.',
  },
  {
    title: '7. Cookies y tecnologias similares',
    content:
      'El sitio puede usar cookies tecnicas, analiticas o funcionales para operar correctamente, medir rendimiento y mejorar experiencia de navegacion.',
  },
  {
    title: '8. Seguridad',
    content:
      'Aplicamos medidas razonables de seguridad para proteger la informacion contra acceso no autorizado, perdida, alteracion o divulgacion indebida.',
  },
  {
    title: '9. Derechos del titular',
    content:
      'Podes solicitar acceso, actualizacion, rectificacion o eliminacion de tus datos, y revocar consentimiento cuando corresponda, por nuestros canales oficiales.',
  },
  {
    title: '10. Cambios a esta politica',
    content:
      'Esta politica puede actualizarse en cualquier momento. La version vigente sera la publicada en esta pagina con su fecha de actualizacion.',
  },
]

export default function PrivacidadPage() {
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
              Datos personales
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Politica de <span className="text-[#FA8F01]">Privacidad</span>
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
                Al interactuar con este sitio aceptas esta politica de privacidad.
              </p>

              <div className="space-y-5">
                {privacySections.map((section) => (
                  <article
                    key={section.title}
                    className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                  >
                    <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                      {section.title}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-1">Contacto por privacidad</h3>
                <p className="text-sm text-gray-600">
                  Para ejercer derechos o realizar consultas sobre privacidad, escribinos a{' '}
                  <a className="text-[#FA8F01] hover:underline" href="mailto:noorfloro23@hotmail.com">
                    noorfloro23@hotmail.com
                  </a>{' '}
                  o por WhatsApp al{' '}
                  <a
                    className="text-[#FA8F01] hover:underline"
                    href="https://wa.me/5491162961526"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    11-6296-1526
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
