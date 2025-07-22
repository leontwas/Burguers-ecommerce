// src/components/ProductosDetailModal.jsx
import PropTypes from 'prop-types';
import Boton from './Boton';
import '../css/ProductosDetailModal.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ Importa SweetAlert2

const API_BASE = 'https://mi-api-burger.onrender.com';

function ProductDetailModal({ producto, onClose, onAddToCart }) {
  const navigate = useNavigate();

  if (!producto) return null;

  const renderFuegoIcons = (level) => {
    return '🔥'.repeat(level);
  };

  const handleGoToCart = () => {
    onClose();
    navigate('/carrito');
  };

  // ✅ Función para manejar la adición al carrito y mostrar la alerta
  const handleAddToCartAndNotify = () => {
    onAddToCart(producto); // Llama a la función original para agregar al carrito
    Swal.fire({
      icon: 'success',
      title: '¡Producto agregado!',
      text: `${producto.nombre} ha sido añadido al carrito.`,
      showConfirmButton: false,
      timer:2000, // Cierra automáticamente después de 1.5 segundos
      position: 'center', // O donde prefieras que aparezca
      toast: false 
    });
   
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
          {/* ✅ Usa la nueva función handleAddToCartAndNotify */}
          <Boton texto="Volver" color="#007bff" onClick={onClose} />
          <Boton texto="Agregar" color="#28a745" onClick={handleAddToCartAndNotify} />
          <Boton texto="Ir al Carrito" color="#6c757d" onClick={handleGoToCart} />
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