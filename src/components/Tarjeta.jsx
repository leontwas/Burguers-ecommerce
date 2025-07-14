import { useContext, useState } from 'react'; // Import useState
import PropTypes from 'prop-types';
import Boton from './Boton';
import '../css/tarjeta.css';
import CarritoContext from "../context/CarritoContext";
import ProductDetailModal from './ProductosDetailModal'; // Import the new modal component

const API_BASE = 'https://mi-api-burger.onrender.com';

function Tarjeta({ producto }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [showDetail, setShowDetail] = useState(false); // State to control modal visibility

  // Function to render fire icons based on spice level
  const renderFuegoIcons = (level) => {
    return '🔥'.repeat(level);
  };

  const handleComprar = (item) => { // Modified to accept item, for use in modal
    if (item) {
      agregarAlCarrito({
        imagen: item.imagen,
        nombre: item.nombre,
        nivel_picante: item.nivel_picante, // Ensure this matches your JSON attribute
        precio: parseFloat(item.precio),
      });
    }
  };

  const handleVerDescripcion = () => {
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <>
      <div className="tarjeta">
        <img
          src={`${API_BASE}${producto.imagen}`}
          alt={producto.nombre}
          className="tarjeta-img"
        />
        <h3 className="tarjeta-nombre">{producto.nombre}</h3>
        <p className="tarjeta-picante">
          Picante: {renderFuegoIcons(producto.nivel_picante)}
        </p>
        <p className="tarjeta-precio">${parseFloat(producto.precio).toFixed(2)}</p>
        {/* Button to open the detail modal */}
        <Boton texto="Ver descripción" color="#007bff" onClick={handleVerDescripcion} />
      </div>

      {/* Render the modal only if showDetail is true */}
      {showDetail && (
        <ProductDetailModal
          producto={producto}
          onClose={handleCloseDetail}
          onAddToCart={handleComprar} // Pass the add to cart function
        />
      )}
    </>
  );
}

Tarjeta.propTypes = {
  producto: PropTypes.shape({
    imagen: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired, // Added description to propTypes
    nivel_picante: PropTypes.number.isRequired, // Added nivel_picante to propTypes
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default Tarjeta;