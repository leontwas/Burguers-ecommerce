import { useContext, useState } from 'react';
import '../css/header.css'; 
import { FaShoppingCart } from 'react-icons/fa';
import CarritoContext from "../context/CarritoContext";
import { NavLink } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

function Header() {
  const { carrito } = useContext(CarritoContext);
  const { currentUser, isAdmin, logout, loading, currentUsername } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false); 
  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  return (
    <>
      <Navbar expand="lg" className="header-bootstrap"> 
        <Container fluid className="header-container-fluid"> 
          <Navbar.Brand as={NavLink} to="/" className="logo-container"> 
            <img src="/images/logo.png" alt="Logo Gloriosa Burgers" className="logo" />
            <h1 className="nombre">Gloriosa Burgers</h1>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShowOffcanvas} />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end" 
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3 nav-custom">
                {/* Los NavLink de react-router-dom funcionan bien dentro de Nav de react-bootstrap */}
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Inicio</NavLink>
                <NavLink to="/reservas" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Reservas</NavLink>

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
                    // Si es usuario normal, muestra el username y botón de salir
                    <NavLink to="#" onClick={(e) => { e.preventDefault(); logout(); handleCloseOffcanvas(); }} className="nav-link login-nav-link">
                      <LogOut size={20} style={{ marginRight: '5px' }} /> {currentUsername} (Salir) {/* Muestra el username */}
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
