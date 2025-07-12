import { useContext, useState } from 'react';
import '../css/header.css';
import { FaShoppingCart } from 'react-icons/fa';
import CarritoContext from "../context/CarritoContext";
import { NavLink, Link } from 'react-router-dom';
import LoginRegister from './LoginRegister';

function Header() {
  const { carrito } = useContext(CarritoContext);
  const [showLogin, setShowLogin] = useState(false);

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
      <h4>Carrito</h4>
      </div>
        <button className="login-btn" onClick={() => setShowLogin(!showLogin)}>
          👤 Login
        </button>

      {showLogin && (
        <div className="login-modal">
          <button className="cerrar-login" onClick={() => setShowLogin(false)}>✖</button>
          <LoginRegister />
        </div>
      )}
    </header>
  );
}

export default Header;
