// src/components/Carrito.jsx
import React, { useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import "../css/carrito.css"; // Crear estilos si querés

function Carrito() {
  const { carrito, aumentarCantidad, disminuirCantidad, vaciarCarrito } = useContext(CarritoContext);

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

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
          <button className='confirmar' onClick={() => alert('¡Compra confirmada!')}>Pagar</button>
        </>
      )}
    </div>
  );
}

export default Carrito;
