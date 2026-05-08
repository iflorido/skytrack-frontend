import { Mail, Globe, Github } from 'lucide-react'

import LegalLayout from '../components/ui/LegalLayout'

export default function Contacto() {
  return (
    <LegalLayout><div className="legal-page" style={{ position: 'static' }}>
      <div className="legal-container">
        <h1>Contacto</h1>

        <p>
          Si tienes alguna pregunta, sugerencia, has detectado un error en la aplicación o
          quieres ponerte en contacto por cualquier otro motivo, puedes escribirnos directamente.
        </p>

        <div className="contact-card">
          <h2>FlySkyTrack</h2>
          <p>Desarrollado por <strong>Ignacio Florido</strong></p>

          <div className="contact-links">
            <a href="mailto:info@flyskytrack.com" className="contact-item">
              <Mail size={18} />
              <span>info@flyskytrack.com</span>
            </a>
            <a href="https://iflorido.es" target="_blank" rel="noopener noreferrer" className="contact-item">
              <Globe size={18} />
              <span>iflorido.es</span>
            </a>
            <a href="https://github.com/iflorido" target="_blank" rel="noopener noreferrer" className="contact-item">
              <Github size={18} />
              <span>github.com/iflorido</span>
            </a>
          </div>
        </div>

        <h2>Tiempo de respuesta</h2>
        <p>
          Intentamos responder todos los mensajes en un plazo máximo de 48 horas en días laborables.
        </p>

        <h2>Incidencias técnicas</h2>
        <p>
          Si detectas algún error en la aplicación o los datos no se muestran correctamente,
          puedes reportarlo directamente en el repositorio de GitHub o enviarnos un correo
          describiendo el problema, el navegador que utilizas y los pasos para reproducirlo.
        </p>

        <h2>Protección de datos</h2>
        <p>
          Los datos personales que nos facilites por correo electrónico serán tratados
          exclusivamente para gestionar tu consulta. Consulta nuestra{' '}
          <a href="/privacidad">Política de Privacidad</a> para más información.
        </p>
      </div>
    </div></LegalLayout>
  )
}