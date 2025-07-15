import { useContext, useState } from 'react';
import '../css/header.css';
import { FaShoppingCart } from 'react-icons/fa';
import CarritoContext from "../context/CarritoContext";
import { NavLink } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

function Header() {
  const { carrito } = useContext(CarritoContext);
  const [showLogin, setShowLogin] = useState(false);

  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <img src="/images/logo.png" alt="Logo Gloriosa Burgers" className="logo" />
          <h1 className="nombre">Gloriosa Burgers</h1>
        </div>

        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>Inicio</NavLink>
          <NavLink to="/reservas" className={({ isActive }) => isActive ? 'active-link' : ''}>Reservas</NavLink>
          <NavLink to="/carrito" className={({ isActive }) => isActive ? 'active-link carrito-nav-link' : 'carrito-nav-link'}>
            <FaShoppingCart className="carrito-icono" />
            <span className="contador">{totalProductos}</span>
            Carrito
          </NavLink>

          <span 
            className="login-nav-link nav-item" 
            onClick={() => setShowLogin(true)}
          >
            👤 Login
          </span>
        </nav>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Header;