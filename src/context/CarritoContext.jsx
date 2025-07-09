// src/context/CarritoContext.jsx
import PropTypes from 'prop-types';
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const CarritoContext = createContext();

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
        toast.success(`${producto.nombre} ha sido agregado al carrito.`);
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

// Agregar validación de props para children
CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
