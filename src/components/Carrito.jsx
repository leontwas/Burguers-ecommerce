// src/components/Carrito.jsx
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { CarritoContext } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
// ❌ ¡ERROR! import { useLoginModal } from '../context/LoginModalContext';
// ✅ CORRECCIÓN: Importa useLoginModal desde el archivo del proveedor
import { useLoginModal } from '../context/LoginModalProvider';
import "../css/carrito.css";

const API_BASE = 'https://mi-api-burger.onrender.com';

function Carrito() {
  const { carrito, aumentarCantidad, disminuirCantidad, vaciarCarrito } = useContext(CarritoContext);
  const { currentUser } = useAuth();
  // Asumiendo que useLoginModal expone openLogin y closeLogin, es mejor usar esas funciones.
  const { openLogin } = useLoginModal();
  const navigate = useNavigate();
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const confirmarCompra = () => {
    if (!currentUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Iniciá sesión',
        text: 'Debés iniciar sesión para confirmar la compra',
        confirmButtonText: 'Ir al login',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        openLogin(); // ✅ Usa openLogin() para abrir el modal
      });
      return;
    }

    Swal.fire({
      title: '¿Confirmar compra?',
      text: '¿Estás seguro de que querés realizar la compra?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '¡Compra confirmada!',
          text: 'Gracias por tu compra',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          vaciarCarrito();
          navigate('/');
        });
      }
    });
  };

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <ul>
          {carrito.map((p, index) => (
            <li key={p.id || index} className="carrito-item">
              <img
                src={`${API_BASE}${p.imagen}`}
                alt={p.nombre}
                className="carrito-item-img"
              />
              <div className="carrito-item-info">
                <strong>{p.nombre}</strong> ${parseFloat(p.precio).toFixed(2)} c/u
              </div>
              <div className="carrito-item-cantidad">
                <button className='restar' onClick={() => disminuirCantidad(p.nombre)}>-</button>
                <span style={{ margin: '0 10px' }}>{p.cantidad}</span>
                <button className='sumar' onClick={() => aumentarCantidad(p.nombre)}>+</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {carrito.length > 0 && (
        <>
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
          <button className='vaciar' onClick={vaciarCarrito}>Vaciar</button>
          <button className='agregar' onClick={() => navigate('/')}>Agregar</button>
          <button className='confirmar' onClick={confirmarCompra}>Pagar</button>
        </>
      )}
    </div>
  );
}

export default Carrito;