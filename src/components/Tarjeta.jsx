import React, { useContext, useEffect, useState } from 'react';
import Boton from './Boton';
import '../css/tarjeta.css';
import { CarritoContext } from '../context/CarritoContext';

function Tarjeta() {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch('https://68339c86464b499636fff1e3.mockapi.io/productos')
      .then((res) => res.json())
      .then((data) => {
        setProducto(data[0]); // Puedes elegir otro índice si quieres otro producto
      })
      .catch((error) => console.error('Error al obtener el producto:', error));
  }, []);

  const handleComprar = () => {
    if (producto) {
      agregarAlCarrito({
        imagen: producto.imagen,
        nombre: producto.name,
        picanteNivel: 1, // Valor por defecto ya que no existe este campo
        precio: parseFloat(producto.price),
      });
    }
  };

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div className="tarjeta">
      <img
        src={producto.imagen}
        alt={producto.name}
        className="tarjeta-img"
      />
      <h3 className="tarjeta-nombre">{producto.name}</h3>

      {/* Como no hay picanteNivel en los datos, mostramos 1 🔥 por defecto */}
      <p className="tarjeta-picante">
        {'🔥'}
      </p>

      <p className="tarjeta-precio">${parseFloat(producto.price).toFixed(2)}</p>
      <Boton texto="Comprar" color="#28a745" onClick={handleComprar} />
    </div>
  );
}

export default Tarjeta;
