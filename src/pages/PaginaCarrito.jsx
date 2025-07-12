import { useCarrito } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';

function PaginaCarrito() {
  const { carrito, agregarProducto, quitarProducto, eliminarProducto, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="pagina-carrito" style={{ padding: '20px' }}>
      <h2>Carrito de Compras</h2>
      
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {carrito.map(producto => (
            <div key={producto.nombre} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <img src={producto.imagen} alt={producto.nombre} style={{ width: '100px', marginRight: '10px' }} />
              <div style={{ flex: 1 }}>
                <h4>{producto.nombre}</h4>
                <p>Precio: ${producto.precio}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => quitarProducto(producto)}>-</button>
                <span>{producto.cantidad}</span>
                <button onClick={() => agregarProducto(producto)}>+</button>
                <button onClick={() => eliminarProducto(producto)}>Eliminar</button>
              </div>
            </div>
          ))}

          <h3>Total: ${total}</h3>

          <button onClick={vaciarCarrito} style={{ backgroundColor: 'orange', marginRight: '10px' }}>
            Vaciar Carrito
          </button>

          <button onClick={() => alert("Compra confirmada")} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
            Confirmar Compra
          </button>

          <button onClick={() => navigate(-1)} style={{ backgroundColor: 'gray', color: 'white' }}>
            Volver
          </button>
        </div>
      )}
    </div>
  );
}

export default PaginaCarrito;
