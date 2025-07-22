// src/App.jsx
import './css/App.css';
import './css/index.css';
import './css/footer.css';

// Importa tus componentes
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import ProductosGrid from './components/ProductosGrid';
import Carrito from './components/Carrito';
import ReservaMesa from './components/ReservaMesa';
import ProductCRUDForm from './components/ProductCRUDForm';
import LoginModal from './components/LoginModal';
import PrivateRoutes from './components/PrivateRoutes';

// Importa tus contextos
import { CarritoProvider } from "./context/CarritoProvider";
import { AuthProvider, useAuth } from "./context/AuthProvider";

// ⭐⭐⭐ CORRECCIÓN CLAVE AQUÍ ⭐⭐⭐
// LoginModalProvider es un default export de './context/LoginModalProvider'
import LoginModalProvider from './context/LoginModalProvider';
// useLoginModal es un named export de './context/LoginModalProvider'
import { useLoginModal } from './context/LoginModalProvider';
// ⭐⭐⭐ FIN CORRECCIÓN CLAVE ⭐⭐⭐

// Rutas de React Router
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';

// Estilos de Toastify y Bootstrap
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente que contendrá la lógica principal de la aplicación
function AppContent() {
  // Ahora useLoginModal se importa correctamente
  const { showLogin, closeLogin } = useLoginModal();
  const { loading } = useAuth();

  // Loading spinner mientras se carga el estado de autenticación inicial
  if (loading) {
    return (
      <div
        className="full-page-loading"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999
        }}
      >
        <div>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Main />
                <ProductosGrid />
              </>
            }
          />
          <Route path="/productos" element={<ProductosGrid />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/reservas" element={<ReservaMesa />} />

          {/* Rutas Protegidas para Usuarios Logueados */}
          <Route element={<PrivateRoutes />}>
            <Route
              path="/perfil"
              element={
                <div className="container py-4">
                  <h2>Mi Perfil</h2>
                  <p>Solo Usuarios Logueados</p>
                </div>
              }
            />
          </Route>

          {/* Rutas Protegidas SOLO para Administradores */}
          <Route element={<PrivateRoutes adminOnly={true} />}>
            <Route path="/crud-productos" element={<ProductCRUDForm />} />
            <Route
              path="/admin-panel"
              element={
                <div className="container py-4">
                  <h2>Panel de Administrador</h2>
                  <p>Solo para administradores</p>
                </div>
              }
            />
          </Route>

          {/* Redirige /login al home */}
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Ruta 404 */}
          <Route
            path="*"
            element={
              <div className="container text-center py-5">
                <h2>404 - Página no encontrada</h2>
                <p>La página que buscas no existe.</p>
                <Navigate to="/" replace />
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />

      {/* El LoginModal se renderiza condicionalmente */}
      {showLogin && <LoginModal onClose={closeLogin} />}

      {/* ToastContainer al final para que aparezca encima de todo */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="toast-container"
        toastClassName="toast-custom"
      />
    </div>
  );
}

// Componente principal de la aplicación
function App() {
  return (
    <Router>
      <LoginModalProvider>
        <AuthProvider>
          <CarritoProvider>
            <AppContent />
          </CarritoProvider>
        </AuthProvider>
      </LoginModalProvider>
    </Router>
  );
}

export default App;