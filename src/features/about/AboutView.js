export default function AboutView() {
  return `
    <div class="view-container">
      <section id="about" class="about-section" data-bounce-section>
        
        <!-- Título oculto semántico para accesibilidad -->
        <h1 class="visually-hidden">Sobre mí</h1>

        <div class="about-container">
          <!-- SVG con efecto blob (Simplified) -->
          <div class="about-blob-wrapper">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="about-blob-svg" aria-labelledby="aboutTitle">
              <title id="aboutTitle">Andrea Avila</title>
              <image 
                href="${import.meta.env.BASE_URL}assets/about-profile.jpg"
                width="200" 
                height="200"
                preserveAspectRatio="xMidYMid slice"
                clip-path="url(#blobClip)"
              />
              <clipPath id="blobClip">
                <path d="M43.1,-68.5C56.2,-58.6,67.5,-47.3,72.3,-33.9C77.2,-20.5,75.5,-4.9,74.2,11.3C72.9,27.6,71.9,44.5,63.8,57.2C55.7,69.8,40.6,78.2,25.5,79.2C10.4,80.1,-4.7,73.6,-20.9,69.6C-37.1,65.5,-54.5,63.9,-66,54.8C-77.5,45.8,-83.2,29.3,-85.7,12.3C-88.3,-4.8,-87.7,-22.3,-79.6,-34.8C-71.5,-47.3,-55.8,-54.9,-41.3,-64.2C-26.7,-73.6,-13.4,-84.7,0.8,-86C15,-87.2,29.9,-78.5,43.1,-68.5Z"
                      transform="translate(100 100)"/>
              </clipPath>
            </svg>
          </div>

          <!-- Texto de descripción redesignado -->
          <div class="about-text-content">
            <span class="about-subtitle word">Hi, Nice to meet you</span>
            <h2 class="about-title">
              <span class="word">I'm</span> <span class="word">Andrea</span> <span class="word">Avila</span>
            </h2>
            <div class="about-description-group">
              <p class="about-description">
                <span class="word">Trabajo</span> <span class="word">para</span> <span class="word">evitar</span> <span class="word">lo</span> <span class="word">cotidiano.</span> 
                <span class="word">Transformo</span> <span class="word">ideas</span> <span class="word">en</span> <span class="word">experiencias</span> <span class="word">visuales</span> <span class="word">que</span> <span class="word">conectan</span> <span class="word">y</span> <span class="word">emocionan.</span>
              </p>
              <p class="about-description">
                <span class="word">Con</span> <span class="word">un</span> <span class="word">enfoque</span> <span class="word">creativo</span> <span class="word">y</span> <span class="word">experimental,</span> <span class="word">exploro</span> <span class="word">las</span> <span class="word">posibilidades</span> 
                <span class="word">del</span> <span class="word">diseño</span> <span class="word">digital</span> <span class="word">para</span> <span class="word">crear</span> <span class="word">piezas</span> <span class="word">únicas</span> <span class="word">y</span> <span class="word">memorables.</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
}
