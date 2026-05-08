import LegalLayout from '../components/ui/LegalLayout'

export default function Privacidad() {
  return (
    <LegalLayout>
      <div className="legal-container">
        <h1>Política de Privacidad</h1>

        <p>
          En FlySkyTrack respetamos tu privacidad. Esta política describe qué datos recogemos,
          cómo los usamos y cuáles son tus derechos, de conformidad con el Reglamento (UE)
          2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
        </p>

        <h2>1. Responsable del tratamiento</h2>
        <ul>
          <li><strong>Titular:</strong> Ignacio Florido</li>
          <li><strong>Correo:</strong> info@flyskytrack.com</li>
          <li><strong>Web:</strong> https://flyskytrack.com</li>
        </ul>

        <h2>2. Datos que recogemos</h2>
        <p>FlySkyTrack no requiere registro ni cuenta de usuario. Los datos que podemos tratar son:</p>
        <ul>
          <li>
            <strong>Datos de navegación:</strong> dirección IP, navegador, sistema operativo,
            páginas visitadas y tiempo de sesión, recogidos de forma anónima y agregada a través
            de Google Analytics.
          </li>
          <li>
            <strong>Datos de contacto:</strong> si nos escribes por correo electrónico, trataremos
            tu dirección de correo y el contenido del mensaje exclusivamente para responderte.
          </li>
          <li>
            <strong>Cookies:</strong> utilizamos cookies propias y de terceros. Consulta nuestra
            Política de Cookies para más información.
          </li>
        </ul>

        <h2>3. Finalidad y base legal</h2>
        <ul>
          <li>
            <strong>Analítica web:</strong> mejorar el funcionamiento del sitio mediante estadísticas
            de uso anónimas (base legal: interés legítimo / consentimiento para cookies analíticas).
          </li>
          <li>
            <strong>Publicidad:</strong> mostramos anuncios a través de Google AdSense, que puede
            usar cookies para personalizar los anuncios según tu actividad de navegación
            (base legal: consentimiento).
          </li>
          <li>
            <strong>Atención al usuario:</strong> gestionar las consultas recibidas por correo
            (base legal: ejecución de una relación precontractual o contractual).
          </li>
        </ul>

        <h2>4. Destinatarios</h2>
        <p>Tus datos pueden ser compartidos con:</p>
        <ul>
          <li>
            <strong>Google LLC</strong> — a través de Google Analytics y Google AdSense, con
            transferencias internacionales amparadas en cláusulas contractuales tipo aprobadas
            por la Comisión Europea.
          </li>
          <li>
            <strong>Proveedores de infraestructura</strong> — servidores de alojamiento ubicados
            en la Unión Europea.
          </li>
        </ul>

        <h2>5. Conservación de datos</h2>
        <p>
          Los datos de navegación se conservan durante el período configurado en Google Analytics
          (por defecto, 26 meses). Los correos electrónicos se conservan durante el tiempo necesario
          para atender tu consulta y, en su caso, hasta que prescriban las posibles
          responsabilidades derivadas.
        </p>

        <h2>6. Tus derechos</h2>
        <p>Puedes ejercer los siguientes derechos escribiéndonos a info@flyskytrack.com:</p>
        <ul>
          <li><strong>Acceso:</strong> conocer qué datos tratamos sobre ti.</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
          <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
          <li><strong>Oposición:</strong> oponerte al tratamiento en determinados casos.</li>
          <li><strong>Limitación:</strong> solicitar la restricción del tratamiento.</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
        </ul>
        <p>
          También puedes presentar una reclamación ante la Agencia Española de Protección de
          Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.
        </p>

        <h2>7. Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a
          accesos no autorizados, pérdida o destrucción accidental, conforme al artículo 32 del RGPD.
        </p>

        <p className="legal-date">Última actualización: mayo de 2026</p>
      </div>
    </LegalLayout>
  )
}