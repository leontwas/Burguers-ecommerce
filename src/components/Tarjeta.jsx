import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Boton from './Boton';
import '../css/tarjeta.css';
import CarritoContext from "../context/CarritoContext";
import ProductDetailModal from './ProductosDetailModal'; 

const API_BASE = 'https://mi-api-burger.onrender.com';

function Tarjeta({ producto }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [showDetail, setShowDetail] = useState(false); 
  const renderFuegoIcons = (level) => {
    return '🔥'.repeat(level);
  };

  const handleComprar = (item) => { 
    if (item) {
      agregarAlCarrito({
        imagen: item.imagen,
        nombre: item.nombre,
        nivel_picante: item.nivel_picante, 
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
        <Boton texto="Ver descripción" color="#007bff" onClick={handleVerDescripcion} />
      </div>

      {showDetail && (
        <ProductDetailModal
          producto={producto}
          onClose={handleCloseDetail}
          onAddToCart={handleComprar} 
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