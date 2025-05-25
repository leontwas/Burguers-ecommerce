import { useEffect, useState } from 'react';
import Tarjeta from './Tarjeta';

function ProductosGrid() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cambiá esta URL según dónde esté tu API (local o en internet)
    const URL_API = 'http://localhost:3000/productos';

    fetch(URL_API)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los productos');
        return res.json();
      })
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los productos');
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tarjeta-grid-container">
      {productos.map((producto, index) => (
        <Tarjeta key={index} {...producto} />
      ))}
    </div>
  );
}

export default ProductosGrid;
