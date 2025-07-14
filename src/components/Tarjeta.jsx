import { useContext } from 'react';
import PropTypes from 'prop-types';
import Boton from './Boton';
import '../css/tarjeta.css';
import CarritoContext from "../context/CarritoContext";

const API_BASE = 'https://mi-api-burger.onrender.com';

function Tarjeta({ producto }) {
  const { agregarAlCarrito } = useContext(CarritoContext);

  // ✅ Mostramos la imagen al renderizar cada tarjeta
  console.log('Imagen del producto:', producto.imagen);

  const handleComprar = () => {
    if (producto) {
      agregarAlCarrito({
        imagen: producto.imagen,
        nombre: producto.nombre,
        picanteNivel: producto.picanteNivel,
        precio: parseFloat(producto.precio),
      });
    }
  };

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div className="tarjeta">
      <img
        src={`${API_BASE}${producto.imagen}`}
        alt={producto.nombre}
        className="tarjeta-img"
      />
      <h3 className="tarjeta-nombre">{producto.nombre}</h3>
      <p className="tarjeta-picante">🔥</p>
      <p className="tarjeta-precio">${parseFloat(producto.precio).toFixed(2)}</p>
      <Boton texto="Comprar" color="#28a745" onClick={handleComprar} />
    </div>
  );
}

Tarjeta.propTypes = {
  producto: PropTypes.shape({
    imagen: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default Tarjeta;
