import PropTypes from 'prop-types';
import Boton from './Boton';
import '../css/ProductosDetailModal.css'; // You'll need to create this CSS file

const API_BASE = 'https://mi-api-burger.onrender.com';

function ProductDetailModal({ producto, onClose, onAddToCart }) {
  if (!producto) return null; // Don't render if no product data

  // Function to render fire icons based on spice level
  const renderFuegoIcons = (level) => {
    return '🔥'.repeat(level);
  };

  return (
    <div className="modal-overlay">
      <div className="product-detail-card">
        <img
          src={`${API_BASE}${producto.imagen}`}
          alt={producto.nombre}
          className="detail-img"
        />
        <h2 className="detail-nombre">{producto.nombre}</h2>
        <p className="detail-descripcion">{producto.descripcion}</p>
        <p className="detail-picante">
          Nivel de Picante: {renderFuegoIcons(producto.nivel_picante)}
        </p>
        <p className="detail-precio">Precio: ${parseFloat(producto.precio).toFixed(2)}</p>

        <div className="detail-actions">
          <Boton texto="Agregar al Carrito" color="#28a745" onClick={() => onAddToCart(producto)} />
          <Boton texto="Volver atrás" color="#007bff" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}

ProductDetailModal.propTypes = {
  producto: PropTypes.shape({
    imagen: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    nivel_picante: PropTypes.number.isRequired,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductDetailModal;