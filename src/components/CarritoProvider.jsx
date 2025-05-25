// src/context/CarritoProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

// Crear el contexto
const CarritoContext = createContext();

// Hook para usar el contexto fácilmente
export const useCarrito = () => useContext(CarritoContext);

// Componente Provider
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
      toast.success(`${producto.nombre} agregado al carrito.`);
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
      toast.error("El carrito está vacío.");
      return;
    }
    toast.success("¡Compra confirmada!");
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
