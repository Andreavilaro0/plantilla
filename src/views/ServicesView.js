export default function ServicesView() {
  return `
    <div class="relative w-full min-h-screen bg-black text-white">
      
      <!-- Hero Section -->
      <section class="relative min-h-[60vh] flex items-center justify-center px-6 py-20">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-6xl md:text-7xl font-serif italic mb-6 text-white">
            Servicios
          </h1>
          <p class="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Capturando momentos únicos con un enfoque editorial y urbano. 
            Cada sesión es una experiencia personalizada diseñada para contar tu historia.
          </p>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="relative px-6 py-20 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          <!-- Editorial -->
          <article class="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
            <h2 class="text-3xl font-serif italic mb-4 text-white">Editorial</h2>
            <p class="text-white/70 mb-6 leading-relaxed">
              Sesiones fotográficas con estilo editorial para revistas, portfolios y campañas creativas.
            </p>
            <ul class="space-y-3 mb-8 text-white/60">
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>2-3 horas de sesión</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>30-50 fotografías editadas</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Dirección artística incluida</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Galería online privada</span>
              </li>
            </ul>
            <a href="/contact" data-link class="inline-block px-6 py-3 border border-white/30 rounded-full text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300">
              Reservar
            </a>
          </article>

          <!-- Urbana -->
          <article class="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
            <h2 class="text-3xl font-serif italic mb-4 text-white">Urbana & Arquitectura</h2>
            <p class="text-white/70 mb-6 leading-relaxed">
              Exploración fotográfica del paisaje urbano, arquitectura y espacios contemporáneos.
            </p>
            <ul class="space-y-3 mb-8 text-white/60">
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>3-4 horas de sesión</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>40-60 fotografías editadas</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Locaciones personalizadas</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Derechos de uso comercial</span>
              </li>
            </ul>
            <a href="/contact" data-link class="inline-block px-6 py-3 border border-white/30 rounded-full text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300">
              Reservar
            </a>
          </article>

          <!-- Retratos -->
          <article class="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
            <h2 class="text-3xl font-serif italic mb-4 text-white">Retratos</h2>
            <p class="text-white/70 mb-6 leading-relaxed">
              Sesiones de retrato personalizadas que capturan la esencia auténtica de cada persona.
            </p>
            <ul class="space-y-3 mb-8 text-white/60">
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>1-2 horas de sesión</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>20-30 fotografías editadas</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Cambios de vestuario incluidos</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Retoque profesional</span>
              </li>
            </ul>
            <a href="/contact" data-link class="inline-block px-6 py-3 border border-white/30 rounded-full text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300">
              Reservar
            </a>
          </article>

          <!-- Eventos -->
          <article class="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
            <h2 class="text-3xl font-serif italic mb-4 text-white">Eventos</h2>
            <p class="text-white/70 mb-6 leading-relaxed">
              Cobertura fotográfica profesional para eventos especiales, exposiciones y celebraciones.
            </p>
            <ul class="space-y-3 mb-8 text-white/60">
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Cobertura completa del evento</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>100+ fotografías editadas</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Entrega en 48-72 horas</span>
              </li>
              <li class="flex items-start">
                <span class="text-gold-500 mr-3">✦</span>
                <span>Álbum digital de alta resolución</span>
              </li>
            </ul>
            <a href="/contact" data-link class="inline-block px-6 py-3 border border-white/30 rounded-full text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300">
              Reservar
            </a>
          </article>

        </div>

        <!-- FAQ Section -->
        <div class="max-w-3xl mx-auto mt-32">
          <h2 class="text-4xl md:text-5xl font-serif italic text-center mb-12 text-white">
            Preguntas Frecuentes
          </h2>
          
          <div class="space-y-6">
            <details class="group border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300">
              <summary class="text-xl font-serif cursor-pointer text-white/90 list-none flex justify-between items-center">
                ¿Cuánto tiempo tarda la entrega de las fotografías?
                <span class="text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p class="mt-4 text-white/60 leading-relaxed">
                El tiempo de entrega varía según el servicio. Generalmente, las sesiones editoriales y de retrato se entregan en 7-10 días, mientras que los eventos tienen una entrega express de 48-72 horas.
              </p>
            </details>

            <details class="group border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300">
              <summary class="text-xl font-serif cursor-pointer text-white/90 list-none flex justify-between items-center">
                ¿Incluyen las sesiones locaciones o estudio?
                <span class="text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p class="mt-4 text-white/60 leading-relaxed">
                Las sesiones pueden realizarse en exteriores (urbanas, arquitectura) o en ubicaciones de tu elección. Para sesiones de estudio, podemos coordinar el alquiler según tus necesidades.
              </p>
            </details>

            <details class="group border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300">
              <summary class="text-xl font-serif cursor-pointer text-white/90 list-none flex justify-between items-center">
                ¿Puedo solicitar fotografías adicionales?
                <span class="text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p class="mt-4 text-white/60 leading-relaxed">
                Sí, las fotografías adicionales pueden adquirirse después de la sesión. El precio por imagen extra varía según el servicio contratado.
              </p>
            </details>

            <details class="group border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300">
              <summary class="text-xl font-serif cursor-pointer text-white/90 list-none flex justify-between items-center">
                ¿Qué incluye la edición de las fotografías?
                <span class="text-2xl group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p class="mt-4 text-white/60 leading-relaxed">
                Todas las fotografías incluyen edición de color, exposición, contraste y retoque básico. El retoque avanzado (corrección de imperfecciones, composiciones complejas) está incluido en servicios premium.
              </p>
            </details>
          </div>
        </div>

        <!-- Final CTA -->
        <div class="text-center mt-32 mb-20">
          <h3 class="text-3xl md:text-4xl font-serif italic mb-6 text-white">
            ¿Listo para crear algo único?
          </h3>
          <p class="text-white/60 mb-8 max-w-2xl mx-auto">
            Hablemos de tu proyecto y diseñemos una sesión completamente personalizada.
          </p>
          <a href="/contact" data-link class="inline-block px-10 py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/40 rounded-full text-sm tracking-widest uppercase hover:bg-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
            Contactar
          </a>
        </div>

      </section>

    </div>
  `
}
