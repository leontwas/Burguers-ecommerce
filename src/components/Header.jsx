import { useContext, useState } from 'react';
import '../css/header.css'; // Asegúrate de que este archivo CSS contenga los estilos actualizados
import { FaShoppingCart } from 'react-icons/fa';
import CarritoContext from "../context/CarritoContext";
import { NavLink } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

// Importaciones de React-Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';


// Reintroducir la importación de useAuth
import { useAuth } from '../context/AuthContext';
// Reintroducir las importaciones de íconos de lucide-react
import { User, LogOut } from 'lucide-react';

function Header() {
  const { carrito } = useContext(CarritoContext);
  // Reintroducir las variables relacionadas con AuthContext
  const { currentUser, isAdmin, logout, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false); // Estado para controlar el Offcanvas

  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  // Funciones para manejar el Offcanvas
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  return (
    <>
      <Navbar expand="lg" className="header-bootstrap"> {/* Usa Navbar de Bootstrap */}
        <Container fluid className="header-container-fluid"> {/* Contenedor fluido para el Navbar */}
          <Navbar.Brand as={NavLink} to="/" className="logo-container"> {/* Usa Navbar.Brand para el logo/nombre */}
            <img src="/images/logo.png" alt="Logo Gloriosa Burgers" className="logo" />
            <h1 className="nombre">Gloriosa Burgers</h1>
          </Navbar.Brand>

          {/* Botón de hamburguesa para pantallas pequeñas */}
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShowOffcanvas} />

          {/* Offcanvas para el menú responsivo */}
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end" // El menú aparecerá desde la derecha
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3 nav-custom"> {/* nav-custom para tus estilos */}
                {/* Los NavLink de react-router-dom funcionan bien dentro de Nav de react-bootstrap */}
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Inicio</NavLink>
                <NavLink to="/novedades" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Novedades</NavLink>
                <NavLink to="/reservas" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Reservas</NavLink>
                <NavLink to="/nosotros" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Nosotros</NavLink>

                {/* Carrito as a NavLink */}
                <NavLink to="/carrito" className={({ isActive }) => `nav-link ${isActive ? 'active-link carrito-nav-link' : 'carrito-nav-link'}`} onClick={handleCloseOffcanvas}>
                  <FaShoppingCart className="carrito-icono" />
                  <span className="carrito-text">Carrito</span>
                  {totalProductos > 0 && <span className="contador">{totalProductos}</span>}
                </NavLink>

                {/* Login/Admin/Logout Link - Lógica condicional */}
                {loading ? (
                  <span className="nav-link login-nav-link">Cargando...</span>
                ) : currentUser ? (
                  isAdmin ? (
                    // Si es admin, enlace a /admin
                    <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active-link admin-nav-link' : 'admin-nav-link'}`} onClick={handleCloseOffcanvas}>
                      🛠️ Admin
                    </NavLink>
                  ) : (
                    // Si es usuario normal, muestra email y botón de salir
                    <NavLink to="#" onClick={(e) => { e.preventDefault(); logout(); handleCloseOffcanvas(); }} className="nav-link login-nav-link">
                      <LogOut size={20} style={{ marginRight: '5px' }} /> {currentUser.email} (Salir)
                    </NavLink>
                  )
                ) : (
                  // Si no hay usuario, muestra el botón de Login
                  <NavLink to="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); handleCloseOffcanvas(); }} className="nav-link login-nav-link">
                    <User size={20} style={{ marginRight: '5px' }} /> Login
                  </NavLink>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Header;
