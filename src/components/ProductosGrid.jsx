import { useEffect, useState } from 'react';
import Tarjeta from './Tarjeta';

const API_BASE = 'https://mi-api-burger.onrender.com/api/productos';

function ProductosGrid() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_BASE)
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
      {productos.map((producto) => (
        <Tarjeta key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ProductosGrid;
