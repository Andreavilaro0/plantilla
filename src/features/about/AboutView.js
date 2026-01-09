export default function AboutView() {
  return `
    <div class="view-container">
      <section id="about" class="about-section">
        
        <!-- Título oculto semántico para accesibilidad -->
        <h1 class="visually-hidden">Sobre mí</h1>

        <!-- Contenedor principal del about -->
        <div class="about-container">
          
          <!-- SVG con efecto blob -->
          <div class="about-blob-wrapper">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="about-blob-svg" aria-labelledby="aboutTitle">
              <title id="aboutTitle">Imagen de perfil</title>
              
              <!-- Imagen con clip-path -->
              <image 
                href="${import.meta.env.BASE_URL}assets/about-profile.jpg"
                width="200" 
                height="200"
                preserveAspectRatio="xMidYMid slice"
                clip-path="url(#blobClip)"
              />
              
              <!-- Clip path para la forma blob -->
              <clipPath id="blobClip">
                <path d="M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z"
                      transform="translate(100 100)"/>
              </clipPath>

              <!-- Path invisible para el texto -->
              <path
                id="textPath"
                d="M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z"
                transform="translate(100 100)"
                fill="none" 
                stroke="none"
                pathLength="100"
              />

              <!-- Texto animado que gira alrededor -->
              <text class="blob-text-content">
                <textPath href="#textPath" startOffset="0%">
                  ★ CREATIVE DESIGNER ★ VISUAL ARTIST ★ CREATIVE DESIGNER ★ VISUAL ARTIST ★
                  <animate attributeName="startOffset" from="0%" to="100%" dur="20s" repeatCount="indefinite" />
                </textPath>
                <textPath href="#textPath" startOffset="100%">
                  ★ CREATIVE DESIGNER ★ VISUAL ARTIST ★ CREATIVE DESIGNER ★ VISUAL ARTIST ★
                  <animate attributeName="startOffset" from="-100%" to="0%" dur="20s" repeatCount="indefinite" />
                </textPath>
              </text>
            </svg>
          </div>

          <!-- Texto de descripción -->
          <div class="about-text-content">
            <h2 class="about-title">Hola, soy Andrea</h2>
            <p class="about-description">
              Trabajo para <span class="highlight">levitar</span> lo cotidiano. 
              Transformo ideas en experiencias visuales que conectan y emocionan.
            </p>
            <p class="about-description">
              Con un enfoque creativo y experimental, exploro las posibilidades 
              del diseño digital para crear piezas únicas y memorables.
            </p>
          </div>

        </div>

      </section>
    </div>
  `
}
