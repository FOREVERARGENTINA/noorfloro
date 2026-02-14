import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Terminos y Condiciones | NOORFLORO',
  description:
    'Terminos y condiciones de uso, compra, pagos, envios, cambios y devoluciones de NOORFLORO.',
}

const sections = [
  {
    title: '1. Alcance',
    content:
      'Estos Terminos y Condiciones regulan el uso del sitio web de NOORFLORO y las operaciones comerciales realizadas a traves de sus canales de contacto y venta.',
  },
  {
    title: '2. Productos y disponibilidad',
    content:
      'Las imagenes, colores y descripciones son referenciales. La disponibilidad de stock puede variar sin previo aviso y sera confirmada al momento de la gestion del pedido.',
  },
  {
    title: '3. Precios y pagos',
    content:
      'Los precios pueden modificarse sin previo aviso. El precio valido es el informado al momento de confirmar la compra. Los pagos se procesan por los medios habilitados por la tienda.',
  },
  {
    title: '4. Envios y entregas',
    content:
      'Realizamos envios segun cobertura y condiciones del operador logistico. Los plazos de entrega son estimados y pueden variar por causas externas o de fuerza mayor.',
  },
  {
    title: '5. Cambios y devoluciones',
    content:
      'Los cambios o devoluciones se evaluan segun el estado del producto, su uso y el plazo desde la entrega. Para iniciar una gestion, escribi a nuestros canales oficiales.',
  },
  {
    title: '6. Garantias',
    content:
      'Cada producto puede contar con garantia del fabricante o del importador segun corresponda. La validez y alcance dependeran de sus condiciones especificas.',
  },
  {
    title: '7. Uso del sitio',
    content:
      'El usuario se compromete a brindar datos veraces y a no utilizar el sitio para actividades ilicitas, fraudulentas o que afecten el funcionamiento normal de la plataforma.',
  },
  {
    title: '8. Propiedad intelectual',
    content:
      'Los contenidos del sitio (textos, imagenes, logotipos y diseno) son propiedad de NOORFLORO o de terceros autorizados. No esta permitida su reproduccion sin autorizacion.',
  },
  {
    title: '9. Privacidad',
    content:
      'El uso de datos personales se realiza conforme a la normativa aplicable y a las practicas internas de la empresa para contacto comercial, seguimiento y atencion al cliente.',
  },
  {
    title: '10. Modificaciones',
    content:
      'NOORFLORO puede actualizar estos terminos en cualquier momento. La version publicada en esta pagina sera la vigente desde su fecha de actualizacion.',
  },
]

export default function TerminosPage() {
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
              Informacion legal
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Terminos y <span className="text-[#FA8F01]">Condiciones</span>
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
                Al usar este sitio y/o realizar una compra, aceptas los siguientes terminos y
                condiciones.
              </p>

              <div className="space-y-5">
                {sections.map((section) => (
                  <article key={section.title} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                    <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-1">Contacto</h3>
                <p className="text-sm text-gray-600">
                  Para consultas sobre estos terminos, escribi a{' '}
                  <a className="text-[#FA8F01] hover:underline" href="mailto:noorfloro23@hotmail.com">
                    noorfloro23@hotmail.com
                  </a>{' '}
                  o por WhatsApp al{' '}
                  <a className="text-[#FA8F01] hover:underline" href="https://wa.me/5491162961526" target="_blank" rel="noopener noreferrer">
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
