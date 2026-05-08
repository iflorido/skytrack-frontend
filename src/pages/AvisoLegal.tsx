import LegalLayout from '../components/ui/LegalLayout'

export default function AvisoLegal() {
  return (
    <LegalLayout>
      <div className="legal-container">
        <h1>Aviso Legal</h1>

        <h2>1. Datos identificativos</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
          Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa que el titular
          del sitio web <strong>flyskytrack.com</strong> es:
        </p>
        <ul>
          <li><strong>Titular:</strong> Ignacio Florido</li>
          <li><strong>Correo electrónico:</strong> info@flyskytrack.com</li>
          <li><strong>Sitio web:</strong> https://flyskytrack.com</li>
        </ul>

        <h2>2. Objeto y ámbito de aplicación</h2>
        <p>
          FlySkyTrack es una aplicación web que ofrece información sobre el tráfico aéreo en tiempo
          real a partir de datos públicos proporcionados por OpenSky Network y otras fuentes de
          datos abiertas. El servicio tiene carácter meramente informativo y divulgativo.
        </p>

        <h2>3. Propiedad intelectual e industrial</h2>
        <p>
          El código fuente, diseño, logotipos, textos y demás elementos que integran este sitio web
          son propiedad de Ignacio Florido o dispone de licencia para su uso. Queda prohibida su
          reproducción, distribución o comunicación pública sin autorización expresa del titular.
        </p>
        <p>
          Los datos de posición de aeronaves proceden de OpenSky Network y están sujetos a sus
          propios términos de uso disponibles en{' '}
          <a href="https://opensky-network.org" target="_blank" rel="noopener noreferrer">
            opensky-network.org
          </a>.
        </p>

        <h2>4. Exclusión de responsabilidad</h2>
        <p>
          FlySkyTrack proporciona información de tráfico aéreo con fines exclusivamente informativos.
          Los datos mostrados pueden contener imprecisiones, retrasos o errores. El titular no se
          responsabiliza del uso que los usuarios hagan de dicha información ni de las decisiones
          que puedan adoptar basándose en ella.
        </p>
        <p>
          Queda expresamente prohibido el uso de esta aplicación para la planificación de vuelos,
          navegación aérea o cualquier actividad que requiera datos certificados y oficiales.
        </p>

        <h2>5. Modificaciones</h2>
        <p>
          El titular se reserva el derecho de modificar el presente aviso legal en cualquier momento.
          Se recomienda a los usuarios revisarlo periódicamente.
        </p>

        <h2>6. Legislación aplicable y jurisdicción</h2>
        <p>
          Las relaciones entre el titular y los usuarios se rigen por la legislación española. Para
          la resolución de cualquier controversia, las partes se someten a los juzgados y tribunales
          del domicilio del usuario.
        </p>

        <p className="legal-date">Última actualización: mayo de 2026</p>
      </div>
    </LegalLayout>
  )
}