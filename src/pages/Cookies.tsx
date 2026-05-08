import LegalLayout from '../components/ui/LegalLayout'

export default function Cookies() {
  return (
    <LegalLayout>
      <div className="legal-container">
        <h1>Política de Cookies</h1>

        <p>
          Esta política explica qué son las cookies, qué tipos utilizamos en FlySkyTrack y
          cómo puedes gestionarlas, de conformidad con el artículo 22.2 de la LSSI-CE y las
          directrices de la AEPD.
        </p>

        <h2>1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo
          cuando los visitas. Permiten recordar tus preferencias, analizar el uso del sitio y
          mostrar publicidad relevante.
        </p>

        <h2>2. Cookies que utilizamos</h2>

        <div className="cookie-table">
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Tipo</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Analítica</td>
                <td>Google Analytics</td>
                <td>Distinguir usuarios únicos</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td>_ga_*</td>
                <td>Analítica</td>
                <td>Google Analytics</td>
                <td>Mantener estado de sesión</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Analítica</td>
                <td>Google Analytics</td>
                <td>Distinguir usuarios</td>
                <td>24 horas</td>
              </tr>
              <tr>
                <td>__gads</td>
                <td>Publicidad</td>
                <td>Google AdSense</td>
                <td>Mostrar anuncios relevantes</td>
                <td>13 meses</td>
              </tr>
              <tr>
                <td>__gpi</td>
                <td>Publicidad</td>
                <td>Google AdSense</td>
                <td>Frecuencia de anuncios</td>
                <td>13 meses</td>
              </tr>
              <tr>
                <td>skytrack_theme</td>
                <td>Técnica</td>
                <td>FlySkyTrack</td>
                <td>Recordar preferencia de tema (oscuro/claro)</td>
                <td>1 año</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>3. Clasificación por tipo</h2>

        <h3>Cookies técnicas (necesarias)</h3>
        <p>
          Son imprescindibles para el funcionamiento del sitio. No requieren consentimiento.
          Permiten recordar tus preferencias de visualización (tema oscuro/claro).
        </p>

        <h3>Cookies analíticas</h3>
        <p>
          Nos permiten conocer cómo los usuarios interactúan con el sitio de forma agregada y
          anónima, para mejorar su funcionamiento. Requieren tu consentimiento.
        </p>

        <h3>Cookies publicitarias</h3>
        <p>
          Gestionadas por Google AdSense, permiten mostrar anuncios adaptados a tus intereses.
          Requieren tu consentimiento. Puedes consultar la política de privacidad de Google en{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            policies.google.com/privacy
          </a>.
        </p>

        <h2>4. Cómo gestionar las cookies</h2>
        <p>Puedes gestionar o eliminar las cookies desde la configuración de tu navegador:</p>
        <ul>
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer">
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
              Safari
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          Ten en cuenta que deshabilitar ciertas cookies puede afectar al funcionamiento del sitio.
        </p>

        <h2>5. Opt-out de Google Analytics</h2>
        <p>
          Puedes deshabilitar el seguimiento de Google Analytics instalando el complemento oficial:{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            tools.google.com/dlpage/gaoptout
          </a>.
        </p>

        <p className="legal-date">Última actualización: mayo de 2026</p>
      </div>
    </LegalLayout>
  )
}