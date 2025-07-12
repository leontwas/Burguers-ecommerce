function Footer() {
  return (
    <footer>
      <div className="grid-container">
        <div className="grid-item kalam-regular">Preguntas frecuentes</div>
        <div className="grid-item kalam-regular">Sucursales</div>
        <div className="grid-item kalam-regular">¿Quiénes somos?</div>
        <div className="grid-item kalam-regular">Libro de quejas</div>
        <div className="grid-item kalam-regular">Asuntos Legales</div>
        <div className="grid-item kalam-regular">Novedades</div>
        <div className="grid-item kalam-regular">Contacto</div>
        <div className="grid-item kalam-regular">Servicios</div>
        <div className="grid-item kalam-regular">Políticas de privacidad</div>
      </div>

      <div className="footlist">
        <a
          className="footlink fab fa-facebook fa-2x"
          href="https://facebook.com"
          title="Facebook"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
        <a
          className="footlink fab fa-youtube fa-2x"
          href="https://youtube.com/"
          title="YouTube"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
        <a
          className="footlink fab fa-instagram fa-2x"
          href="https://www.instagram.com/"
          title="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
        <a
          className="footlink fab fa-whatsapp fa-2x"
          href="https://web.whatsapp.com/"
          title="Whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      </div>

      <p className="copyright">&copy; 2025 - Mi Aplicación React</p>
    </footer>
  );
}

export default Footer;

