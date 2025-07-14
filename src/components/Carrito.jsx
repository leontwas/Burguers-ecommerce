import { useContext } from 'react';
import Swal from 'sweetalert2';
import CarritoContext from "../context/CarritoContext";
import "../css/carrito.css"; // Asegúrate de que este CSS exista y contenga los estilos para .carrito-item-img

// Define la base de la API para las imágenes
// Si tus imágenes están en la misma carpeta 'public' que tu frontend desplegado en Netlify,
// no necesitarías API_BASE y la ruta sería solo p.imagen (ej. /images/01.png).
// Si están en un servidor externo (como Render.com, como se insinuó antes), entonces sí.
// Para este ejemplo, asumimos que están en un servidor externo o en una ruta base específica.
const API_BASE = 'https://mi-api-burger.onrender.com'; // O la URL donde estén tus imágenes

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
    vaciarCarrito(); // Vaciar el carrito después de confirmar la compra
  };

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <ul>
          {carrito.map((p) => ( // No es necesario 'i' si usas p.id como key
            <li key={p.id} className="carrito-item"> {/* Añadido clase para estilizar el li */}
              <img
                src={`${API_BASE}${p.imagen}`} // Construye la URL completa de la imagen
                alt={p.nombre}
                className="carrito-item-img" // Clase para estilizar la miniatura
              />
              <div className="carrito-item-info"> {/* Contenedor para nombre y precio */}
                <strong>{p.nombre}</strong>  ${parseFloat(p.precio).toFixed(2)} c/u
              </div>
              <div className="carrito-item-cantidad"> {/* Contenedor para botones de cantidad */}
                <button className='restar' onClick={() => disminuirCantidad(p.id)}>-</button> {/* Usar p.id */}
                <span style={{ margin: '0 10px' }}>{p.cantidad}</span>
                <button className='sumar' onClick={() => aumentarCantidad(p.id)}>+</button> {/* Usar p.id */}
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
