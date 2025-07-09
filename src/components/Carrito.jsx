import { useContext } from 'react';
import Swal from 'sweetalert2';
import CarritoContext from "../context/CarritoContext";
import "../css/carrito.css";

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
  };

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <ul>
          {carrito.map((p, i) => (
            <li key={i}>
              <img src={p.imagen} alt={p.nombre} width={100} />
              <strong>{p.nombre}</strong>  ${p.precio} c/u
              <div>
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
          <p><strong>Total:</strong> ${total}</p>
          <button className='vaciar' onClick={vaciarCarrito}>Vaciar Carrito</button>
          <button className='confirmar' onClick={confirmarCompra}>Pagar</button>
        </>
      )}
    </div>
  );
}

export default Carrito;
