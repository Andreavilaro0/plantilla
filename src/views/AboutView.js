export default function AboutView() {
  return `
    <div class="view-container">
      <section id="about" class="about-section">

        <!-- Título oculto semántico para accesibilidad -->
        <h1 class="visually-hidden">Sobre mí</h1>

        <!-- Ventana About con mismo patrón que Portfolio -->
        <div class="about-ventana">

          <!-- Barra superior con dots (mismo estilo que portfolio) -->
          <div class="frame-bar">
            <div class="frame-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
          </div>

          <!-- Contenido: frase XL editorial -->
          <div class="about-contenido">
            <p class="about-frase">
              Trabajo para
              <span
                id="palabra-cambiante"
                class="palabra-cambiante"
                aria-live="polite"
              >
                levitar
              </span>
              lo cotidiano.
            </p>
          </div>

        </div>

      </section>
    </div>
  `
}
