import React, { useContext } from 'react';
import Boton from './Boton';
import '../css/tarjeta.css';
import { CarritoContext } from '../context/CarritoContext';

function Tarjeta({ imagen, nombre, picanteNivel, precio }) {
  const { agregarAlCarrito } = useContext(CarritoContext);

  const handleComprar = () => {
    agregarAlCarrito({ imagen, nombre, picanteNivel, precio });
  };

  return (
    <div className="tarjeta">
      <img src={imagen} alt={nombre} className="tarjeta-img" />
      <h3 className="tarjeta-nombre">{nombre}</h3>
      <p className="tarjeta-picante">
        {Array.from({ length: picanteNivel }, () => '🔥').join(' ')}
      </p>
      <p className="tarjeta-precio">${precio}</p>
      <Boton texto="Comprar" color="#28a745" onClick={handleComprar} />
    </div>
  );
}

export default Tarjeta;
