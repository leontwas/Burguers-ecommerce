import { useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function InicioPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.body.appendChild(script);
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.5615, lng: -58.4522 }, // Coordenadas Av. Cabildo 4082
      zoom: 16,
    });

    new window.google.maps.Marker({
      position: { lat: -34.5615, lng: -58.4522 },
      map,
      title: 'Sucursal Cabildo 4082',
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Carousel fade>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Carousel.Item key={num}>
            <img
              className="d-block w-100"
              src={`https://via.placeholder.com/1200x500?text=Imagen+${num}`}
              alt={`Slide ${num}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <section style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2 className="mb-4">Nuestra Historia</h2>
        <p style={{ fontSize: '1.2em', maxWidth: '800px', margin: '0 auto' }}>
          En marzo de 2025 nació nuestra pasión por las hamburguesas picantes. Abrimos nuestra primera sucursal en Av. Cabildo 4082, en la Ciudad Autónoma de Buenos Aires, gracias al esfuerzo y apoyo de un grupo de amigos emprendedores que decidieron apostar por el sabor, la calidad y la innovación gastronómica.
        </p>
      </section>

      <section style={{ height: '400px', marginBottom: '40px' }}>
        <h3 className="text-center mb-3">Encontranos acá</h3>
        <div id="map" style={{ height: '100%', width: '100%', borderRadius: '10px' }}></div>
      </section>
    </div>
  );
}

export default InicioPage;