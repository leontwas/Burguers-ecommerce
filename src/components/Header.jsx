// src/components/Header.jsx
import { FaShoppingCart } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CarritoContext } from '../context/CarritoContext'; 
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useAuth } from '../context/AuthProvider';
import { useLoginModal } from '../context/LoginModalProvider';
import { User, LogOut } from 'lucide-react';
import Swal from 'sweetalert2'; // Importar Swal si lo vas a usar aquí para errores específicos
import '../css/header.css';

function Header() {
  const { carrito } = useContext(CarritoContext);
  const { currentUser, isAdmin, logout, loading, currentUsername } = useAuth();
  const { setShowLogin } = useLoginModal(); 
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const handleLogout = async () => {
    try {
      await logout();
      // El mensaje de éxito ya se maneja en AuthProvider,
      // aquí solo podrías mostrar un error si el logout falla específicamente.
    } catch (error) {
      console.error("Error al cerrar sesión desde Header:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cerrar sesión',
        text: 'Ocurrió un problema al cerrar tu sesión. Inténtalo de nuevo.',
      });
    } finally {
      handleCloseOffcanvas(); // Asegurarse de cerrar el offcanvas
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    handleCloseOffcanvas(); // Asegurarse de cerrar el offcanvas
  };

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
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} 
                  onClick={handleCloseOffcanvas}
                >
                  Inicio
                </NavLink>
                {/* Puedes añadir un link a /productos si lo deseas en el Nav de bootstrap */}
                <NavLink 
                  to="/productos" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} 
                  onClick={handleCloseOffcanvas}
                >
                  Productos
                </NavLink>
                <NavLink 
                  to="/reservas" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} 
                  onClick={handleCloseOffcanvas}
                >
                  Reservas
                </NavLink>
                <NavLink 
                  to="/carrito" 
                  className={({ isActive }) => `nav-link carrito-nav-link ${isActive ? 'active-link' : ''}`} 
                  onClick={handleCloseOffcanvas}
                >
                  <FaShoppingCart className="carrito-icono" />
                  <span className="carrito-text">Carrito</span>
                  {totalProductos > 0 && <span className="contador">{totalProductos}</span>}
                </NavLink>

                {loading ? (
                  // Muestra 'Cargando...' mientras se determina el estado de autenticación
                  <span className="nav-link login-nav-link">Cargando...</span>
                ) : currentUser ? (
                  // Si hay un usuario logueado
                  <>
                    {isAdmin && (
                      <NavLink
                        to="/crud-productos"
                        className={({ isActive }) => `nav-link admin-nav-link ${isActive ? 'active-link' : ''}`}
                        onClick={handleCloseOffcanvas}
                      >
                        🛠️ CRUD
                      </NavLink>
                    )}
                    {/* Botón para Salir */}
                    <span
                      onClick={handleLogout}
                      className="nav-link login-nav-link"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleLogout();
                      }}
                    >
                      <LogOut size={20} style={{ marginRight: '5px' }} /> {currentUsername} (Salir)
                    </span>
                  </>
                ) : (
                  // Si no hay usuario logueado, muestra el botón de Login
                  <span
                    onClick={handleLoginClick}
                    className="nav-link login-nav-link"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLoginClick();
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

      {/* ⭐ ELIMINAR: LoginModal se renderiza en App.jsx, no aquí. */}
      {/* {showLogin && <LoginModal onClose={() => setShowLogin(false)} />} */}
    </>
  );
}

export default Header;