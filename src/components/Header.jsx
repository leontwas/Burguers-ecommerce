import React, { useContext } from 'react';
import '../css/header.css';
import { FaShoppingCart } from 'react-icons/fa';
import { CarritoContext } from '../context/CarritoContext';
import { NavLink, Link } from 'react-router-dom';

function Header() {
  const { carrito } = useContext(CarritoContext);

  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo Gloriosa Burgers" className="logo" />
        <h1 className="nombre">Gloriosa Burgers</h1>
      </div>

      <nav className="nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>Inicio</NavLink>
        <NavLink to="/novedades" className={({ isActive }) => isActive ? 'active-link' : ''}>Novedades</NavLink>
        <NavLink to="/reservas" className={({ isActive }) => isActive ? 'active-link' : ''}>Reservas</NavLink>
        <NavLink to="/nosotros" className={({ isActive }) => isActive ? 'active-link' : ''}>Nosotros</NavLink>
      </nav>

      <div className="carrito-container">
        <Link to="/carrito">
          <FaShoppingCart className="carrito-icono" />
        </Link>
        <span className="contador">{totalProductos}</span>
      </div>
    </header>
  );
}

export default Header;
