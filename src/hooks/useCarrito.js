import { useContext } from 'react';
import { CarritoContext } from '../context/CarritoProvider';

const useCarrito = () => {
  return useContext(CarritoContext);
};

export default useCarrito;
