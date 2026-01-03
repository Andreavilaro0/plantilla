export default function AboutView() {
  return `
    <div class="view-container">
      <section id="about" class="section-block relative min-h-screen flex items-center justify-center bg-transparent py-20 px-6 premium-bg">
        
        <!-- macOS Window Style Container -->
        <div id="aboutWindow" class="mac-window">
          
          <!-- Titlebar (Draggable Trigger) -->
          <div class="mac-titlebar">
            <div class="mac-dots">
              <div class="mac-dot red"></div>
              <div class="mac-dot yellow"></div>
              <div class="mac-dot green"></div>
            </div>
            <div class="mac-title-label">About.sys — 128-bit Logic</div>
          </div>

          <div class="mac-body">
            <div class="mac-scroll">
              <div class="inner-grid">
                
                <!-- Profile Section -->
                <aside class="profile">
                  <div class="profile-photo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4 20C4 17.7909 7.58172 16 12 16C16.4183 16 20 17.7909 20 20" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="profile-info">
                    <div class="profile-name">WORK IMPRESSIONS</div>
                    <div class="profile-role">Architect & Curator</div>
                  </div>
                </aside>

                <!-- Content Sections -->
                <main class="content-wrapper">
                  <section class="mac-section">
                    <h3>The Vision</h3>
                    <p>
                      Explorando la intersección entre la brutalidad urbana y la elegancia editorial. Mi trabajo busca documentar lo efímero a través de una lente técnica rigurosa.
                    </p>
                  </section>

                  <section class="mac-section">
                    <h3>Capabilities</h3>
                    <div class="mac-tags">
                      <span class="mac-tag">Editorial</span>
                      <span class="mac-tag">Urban</span>
                      <span class="mac-tag">Minimalist</span>
                      <span class="mac-tag">B&W</span>
                    </div>
                  </section>

                  <section class="mac-section">
                    <h3>Status</h3>
                    <p>
                      Actualmente disponible para colaboraciones selectas y proyectos de gran escala que desafíen los límites de la narrativa visual convencional.
                    </p>
                  </section>
                </main>
              </div>
            </div>
          </div>

        </div>

      </section>
    </div>
  `
}

