export default function ContactPage() {
  return (
    <main className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Contacto</h1>
        <p className="mb-4">Av. Maipú 3366<br />Olivos – Vicente López – Buenos Aires</p>
        <p className="mb-4">
          <strong>Tel:</strong> <a href="tel:+541147115185" className="text-sky-600 hover:underline">(011) 4711-5185</a>
        </p>
        <p className="mb-6">
          <strong>Horarios:</strong><br />Lunes a viernes 9:30 a 17:00 hs<br />Sábados 9:30 a 13:00 hs
        </p>

        <div className="mb-6">
          <a href="https://www.google.com/maps/search/Av.+Maip%C3%BA+3366+Olivos" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Ver en Google Maps
          </a>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Enviar mensaje</h2>
          <form action="mailto:info@tiendaonline.com" method="post" encType="text/plain" className="grid gap-4">
            <input name="name" type="text" placeholder="Tu nombre" className="input" required />
            <input name="email" type="email" placeholder="Tu email" className="input" required />
            <textarea name="message" placeholder="Mensaje" rows="6" className="input" required />
            <button className="btn btn-primary" type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </main>
  )
}
