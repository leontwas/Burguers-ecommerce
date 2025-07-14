import { useContext, useState } from 'react';
import '../css/header.css'; // Asegúrate de que este archivo CSS contenga los estilos actualizados
import { FaShoppingCart } from 'react-icons/fa';
import CarritoContext from "../context/CarritoContext";
import { NavLink } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
// Se elimina la importación de useAuth ya que se quita la funcionalidad de autenticación
// import { useAuth } from '../context/AuthContext';
// Se eliminan las importaciones de íconos de lucide-react si solo se usaban para AuthContext
// import { User, LogOut } from 'lucide-react';

function Header() {
  const { carrito } = useContext(CarritoContext);
  // Se eliminan las variables relacionadas con AuthContext
  // const { currentUser, isAdmin, logout, loading } = useAuth();
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
          <NavLink to="/novedades" className={({ isActive }) => isActive ? 'active-link' : ''}>Novedades</NavLink>
          <NavLink to="/reservas" className={({ isActive }) => isActive ? 'active-link' : ''}>Reservas</NavLink>
          <NavLink to="/nosotros" className={({ isActive }) => isActive ? 'active-link' : ''}>Nosotros</NavLink>

          {/* Carrito as a NavLink */}
          <NavLink to="/carrito" className={({ isActive }) => isActive ? 'active-link carrito-nav-link' : 'carrito-nav-link'}>
            <FaShoppingCart className="carrito-icono" />
            {/* Envuelve el texto "Carrito" en un span para mejor control */}
            <span className="carrito-text">Carrito</span>
            {/* Mueve el contador para que quede DESPUÉS del texto */}
            {totalProductos > 0 && <span className="contador">{totalProductos}</span>}
          </NavLink>

          {/* Se elimina el enlace al panel de administración ya que se quita la funcionalidad de autenticación */}
          {/* {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active-link admin-nav-link' : 'admin-nav-link'}>
              🛠️ Admin
            </NavLink>
          )} */}

          {/* Login Link - Vuelve a su estado original sin lógica de autenticación */}
          <NavLink to="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }} className="login-nav-link">
            {/* Se usa un emoji simple o se puede volver al ícono User si se desea, pero sin lógica de autenticación */}
            👤 Login
          </NavLink>
        </nav>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Header;
