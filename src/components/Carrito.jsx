import { useContext } from 'react';
import Swal from 'sweetalert2';
import CarritoContext from "../context/CarritoContext";
import "../css/carrito.css";

const API_BASE = 'https://mi-api-burger.onrender.com';

function Carrito() {
  const { carrito, aumentarCantidad, disminuirCantidad, vaciarCarrito } = useContext(CarritoContext);

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const confirmarCompra = () => {
    Swal.fire({
      icon: 'success',
      title: '¡Compra confirmada!',
      text: 'Gracias por tu compra',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
    vaciarCarrito(); 
  };

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <ul>
          {carrito.map((p, index) => ( // Añadido 'index' como segundo argumento
            <li key={p.id || index} className="carrito-item"> {/* Usar p.id como key, con index como fallback */}
              <img
                src={`${API_BASE}${p.imagen}`} // Construye la URL completa de la imagen
                alt={p.nombre}
                className="carrito-item-img" // Clase para estilizar la miniatura
              />
              <div className="carrito-item-info"> {/* Contenedor para nombre y precio */}
                <strong>{p.nombre}</strong> ${parseFloat(p.precio).toFixed(2)} c/u
              </div>
              <div className="carrito-item-cantidad"> {/* Contenedor para botones de cantidad */}
                <button className='restar' onClick={() => disminuirCantidad(p.nombre)}>-</button> {/* Usar p.nombre */}
                <span style={{ margin: '0 10px' }}>{p.cantidad}</span>
                <button className='sumar' onClick={() => aumentarCantidad(p.nombre)}>+</button> {/* Usar p.nombre */}
              </div>
            </li>
          ))}
        </ul>
      )}

      {carrito.length > 0 && (
        <>
          <p><strong>Total:</strong> ${total.toFixed(2)}</p> {/* Formatear el total */}
          <button className='vaciar' onClick={vaciarCarrito}>Vaciar Carrito</button>
          <button className='confirmar' onClick={confirmarCompra}>Pagar</button>
        </>
      )}
    </div>
  );
}

export default Carrito;
