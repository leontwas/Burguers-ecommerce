// src/App.jsx
import './css/App.css';
import './css/index.css';
import './css/footer.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Main from './components/Main';
import ProductosGrid from './components/ProductosGrid';
import Carrito from './components/Carrito';
import ReservaMesa from './components/ReservaMesa';
import LoginRegister from './components/LoginRegister';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CarritoProvider } from "./context/CarritoProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCRUDForm from './components/ProductCRUDForm';

import LoginModal from './components/LoginModal';
import { LoginModalProvider, useLoginModal } from './context/LoginModalContext'; // Mantén el import
import PrivateRoutes from './components/PrivateRoutes';

function AppContent() {
  const { showLogin, setShowLogin } = useLoginModal(); // Esto está bien aquí

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Main />
            <ProductosGrid />
          </>
        } />
        <Route path="/reservas" element={<ReservaMesa />} />
        <Route path="/carrito" element={<Carrito />} />
        {/* Si tienes una ruta /login para la página completa, déjala. Si solo usas el modal, puedes quitarla. */}
        <Route path="/login" element={<LoginRegister />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/perfil" element={<div>Mi Perfil (Solo Usuarios)</div>} />
          <Route path="/crud-productos" element={<ProductCRUDForm />} />
        </Route>

        <Route element={<PrivateRoutes adminOnly={true} />}>
          <Route path="/admin-panel" element={<div>Panel de Administrador</div>} />
        </Route>

      </Routes>
      <Footer />

      {/* ⭐ El LoginModal se renderiza aquí condicionalmente, dentro de AppContent, que está dentro de todos los proveedores. */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

function App() {
  return (
    <Router> {/* Router es el más externo porque AuthProvider usa useNavigate */}
      <AuthProvider> {/* AuthProvider ahora envuelve todo lo demás */}
        <CarritoProvider> {/* CarritoProvider después de AuthProvider */}
          {/* ⭐ Mueve el LoginModalProvider aquí, dentro de CarritoProvider y AuthProvider. */}
          {/* Esto asegura que LoginModalProvider y su contenido (el modal) tengan acceso a AuthProvider. */}
          <LoginModalProvider>
            <ToastContainer />
            <AppContent /> {/* AppContent y lo que contiene (LoginModal) ahora está correctamente anidado */}
          </LoginModalProvider>
        </CarritoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;