import React, { useContext } from 'react';
import '../css/header.css';
import { FaShoppingCart } from 'react-icons/fa';
import { CarritoContext } from '../context/CarritoContext';

function Header() {
  const { carrito } = useContext(CarritoContext);

  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <header className="header">
      <div className="logo-container">
        <img src="./public/images/logo.png" alt="Logo Gloriosa Burgers" className="logo" />
        <h1 className="nombre">Gloriosa Burgers</h1>
      </div>

      <nav className="nav">
        <a href="#">Inicio</a>
        <a href="#">Novedades</a>
        <a href="#">Reservas</a>
        <a href="#">Nosotros</a>
      </nav>

      <div className="carrito-container">
        <FaShoppingCart className="carrito-icono" />
        <span className="contador">{totalProductos}</span>
      </div>
    </header>
  );
}

export default Header;
