import { useContext } from 'react';
import PropTypes from 'prop-types';
import Boton from './Boton';
import '../css/tarjeta.css';
import CarritoContext from "../context/CarritoContext";

function Tarjeta({ producto }) {
  const { agregarAlCarrito } = useContext(CarritoContext);

  const handleComprar = () => {
    if (producto) {
      agregarAlCarrito({
        imagen: producto.imagen,
        nombre: producto.name,
        picanteNivel: 1, // Valor por defecto
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
      <p className="tarjeta-picante">🔥</p>
      <p className="tarjeta-precio">${parseFloat(producto.price).toFixed(2)}</p>
      <Boton texto="Comprar" color="#28a745" onClick={handleComprar} />
    </div>
  );
}

Tarjeta.propTypes = {
  producto: PropTypes.shape({
    imagen: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default Tarjeta;
