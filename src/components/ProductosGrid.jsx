import { useEffect, useState } from 'react';
import Tarjeta from './Tarjeta';

const API_BASE = 'https://68339c86464b499636fff1e3.mockapi.io/productos';

function ProductosGrid() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/productos`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los productos');
        return res.json();
      })
      .then(data => {
        // Agregamos la URL completa a la propiedad imagen de cada producto
        const productosConImagenCompleta = data.map(producto => ({
          ...producto,
          imagen: API_BASE + producto.imagen
        }));

        setProductos(productosConImagenCompleta);
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
