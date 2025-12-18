export default function ContactView() {
  return `
    <div class="view-container">
      <section class="contact-section">
        <h1>Contacto</h1>
        <p>Ponte en contacto con nosotros</p>
      </section>
      
      <section class="content-section">
        <form class="contact-form" id="contact-form">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Enviar</button>
        </form>
      </section>
    </div>
  `
}
