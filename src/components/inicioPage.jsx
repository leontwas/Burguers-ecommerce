// src/components/InicioPage.jsx
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/inicioPage.css';

function InicioPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Hamburguesa Gourmet",
      title: "Hamburguesa Gourmet"
    },
    {
      src: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Hamburguesa con Bacon",
      title: "Hamburguesa con Bacon"
    },
    {
      src: "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Hamburguesa Artesanal",
      title: "Hamburguesa Artesanal"
    },
    {
      src: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Hamburguesa Picante",
      title: "Hamburguesa Picante"
    },
    {
      src: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Hamburguesa Completa",
      title: "Hamburguesa Completa"
    }
  ];

  useEffect(() => {
    // Cargar Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    // Cargar Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    // Auto-slide del carrusel
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 4000);

    // Limpieza
    return () => {
      clearInterval(interval);
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [carouselImages.length]); 

  const initMap = () => {
    if (window.L) {
      // Coordenadas de Av. Cabildo 4082, Buenos Aires
      const lat = -34.5615;
      const lng = -58.4522;

      const map = window.L.map('map').setView([lat, lng], 16);

      // Agregar tiles de OpenStreetMap (gratuito)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Agregar marcador
      window.L.marker([lat, lng])
        .addTo(map)
        .bindPopup('🍔 Sucursal Cabildo 4082<br>¡Las mejores hamburguesas picantes!')
        .openPopup();
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="inicio-container">
      {/* Carrusel personalizado */}
      <div className="carousel-container">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="carousel-image"
            />
            <div className="carousel-caption">
              <h3>{image.title}</h3>
              <p>Las hamburguesas más picantes</p>
            </div>
          </div>
        ))}
        
        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="carousel-nav-btn carousel-prev"
          aria-label="Imagen anterior"
        >
          ‹
        </button>
        
        <button
          onClick={nextSlide}
          className="carousel-nav-btn carousel-next"
          aria-label="Siguiente imagen"
        >
          ›
        </button>

        {/* Indicadores */}
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Sección Historia */}
      <section className="historia-section">
        <h2 className="historia-title">Nuestra Historia</h2>
        <p className="historia-text">
          En marzo de 2025 nació nuestra pasión por las hamburguesas picantes. Abrimos nuestra primera sucursal en Av. Cabildo 4082, en la Ciudad Autónoma de Buenos Aires, gracias al esfuerzo y apoyo de un grupo de amigos emprendedores que decidieron apostar por el sabor, la calidad y la innovación gastronómica.
        </p>
      </section>

      {/* Sección Mapa */}
      <section className="mapa-section">
        <h3 className="mapa-title">Encontranos acá 📍</h3>
        <div id="map" className="mapa-container"></div>
        <div className="mapa-info">
          <p>
            📍 Av. Cabildo 4082, CABA | 🕒 Lun-Dom 11:00-23:00 | 📞 (11) 1234-5678
          </p>
        </div>
      </section>
    </div>
  );
}

export default InicioPage;
