// src/context/CarritoProvider.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { CarritoContext } from "./CarritoContext";
import Swal from "sweetalert2"; 

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((p) => p.nombre === producto.nombre);
      if (existente) {
        return prev.map((p) =>
          p.nombre === producto.nombre ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {

        Swal.fire({
          title: '¡Agregado!',
          text: `${producto.nombre} ha sido agregado al carrito.`,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: 'center',
          width: '400px',
          padding: '20px',
          customClass: {
            popup: 'swal-popup-large',
            title: 'swal-title-large',
            content: 'swal-content-large'
          }
        });
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const aumentarCantidad = (nombre) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.nombre === nombre ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };

  const disminuirCantidad = (nombre) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p.nombre === nombre ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, vaciarCarrito, aumentarCantidad, disminuirCantidad }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
