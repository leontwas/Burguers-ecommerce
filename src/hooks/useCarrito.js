// src/hooks/useCarrito.js
import { useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';

const useCarrito = () => {
  return useContext(CarritoContext);
};

export default useCarrito;