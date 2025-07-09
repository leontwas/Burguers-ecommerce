// src/context/CarritoProvider.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import CarritoContext from "../context/CarritoContext";

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.nombre === producto.nombre);
      if (existe) {
        return prev.map(item =>
          item.nombre === producto.nombre
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      Swal.fire({
        icon: 'success',
        title: 'Agregado',
        text: `${producto.nombre} agregado al carrito.`,
        timer: 1500,
        showConfirmButton: false,
      });
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const incrementar = (nombre) => {
    setCarrito(prev =>
      prev.map(item =>
        item.nombre === nombre ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const decrementar = (nombre) => {
    setCarrito(prev =>
      prev.map(item =>
        item.nombre === nombre
          ? { ...item, cantidad: item.cantidad > 1 ? item.cantidad - 1 : 1 }
          : item
      )
    );
  };

  const eliminarProducto = (nombre) => {
    setCarrito(prev => prev.filter(item => item.nombre !== nombre));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const confirmarCompra = () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El carrito está vacío.',
        confirmButtonColor: '#d33',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Compra confirmada',
      text: '¡Gracias por tu compra!',
      confirmButtonColor: '#3085d6',
    });
    setCarrito([]);
  };

  const valor = {
    carrito,
    agregarAlCarrito,
    incrementar,
    decrementar,
    eliminarProducto,
    vaciarCarrito,
    confirmarCompra
  };

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  );
};

CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
