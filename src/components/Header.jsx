// src/components/Header.jsx
import { FaShoppingCart } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import CarritoContext from "../context/CarritoContext";
import LoginModal from './LoginModal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useAuth } from '../context/AuthProvider';
import { useLoginModal } from '../context/LoginModalContext'; // ✅ nuevo
import { User, LogOut } from 'lucide-react';
import '../css/header.css';

function Header() {
  const { carrito } = useContext(CarritoContext);
  const { currentUser, isAdmin, logout, loading, currentUsername } = useAuth();
  const { showLogin, setShowLogin } = useLoginModal(); // ✅ desde el contexto
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
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Inicio</NavLink>
                <NavLink to="/reservas" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Reservas</NavLink>
                <NavLink to="/carrito" className={({ isActive }) => `nav-link carrito-nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>
                  <FaShoppingCart className="carrito-icono" />
                  <span className="carrito-text">Carrito</span>
                  {totalProductos > 0 && <span className="contador">{totalProductos}</span>}
                </NavLink>

                {loading ? (
                  <span className="nav-link login-nav-link">Cargando...</span>
                ) : currentUser ? (
                  <>
                    {isAdmin && (
                      <NavLink to="/admin" className={({ isActive }) => `nav-link admin-nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>
                        🛠️ CRUD
                      </NavLink>
                    )}
                    <span
                      onClick={() => {
                        logout();
                        handleCloseOffcanvas();
                      }}
                      className="nav-link login-nav-link"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          logout();
                          handleCloseOffcanvas();
                        }
                      }}
                    >
                      <LogOut size={20} style={{ marginRight: '5px' }} /> {currentUsername} (Salir)
                    </span>
                  </>
                ) : (
                  <span
                    onClick={() => {
                      setShowLogin(true);
                      handleCloseOffcanvas();
                    }}
                    className="nav-link login-nav-link"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowLogin(true);
                        handleCloseOffcanvas();
                      }
                    }}
                  >
                    <User size={20} style={{ marginRight: '5px' }} /> Login
                  </span>
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
