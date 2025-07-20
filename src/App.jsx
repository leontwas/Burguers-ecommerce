import './css/App.css';
import './css/index.css';
import './css/footer.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import ProductosGrid from './components/ProductosGrid';
import Carrito from './components/Carrito';
import Login from './components/Login'; // Tu componente de Login/Registro
import ReservaMesa from './components/ReservaMesa'; // Tu componente de Reservas
import PrivateRoutes from './components/PrivateRoutes'; // Importa el nuevo componente PrivateRoutes
import 'bootstrap/dist/css/bootstrap.min.css';
import { CarritoProvider } from "./context/CarritoProvider";
import { AuthProvider } from "./context/AuthProvider"; // Importar AuthProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componente de ejemplo para la página de administración
const AdminDashboard = () => (
  <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
    <h1>Panel de Administración</h1>
    <p>Solo los administradores pueden ver esto.</p>
  </div>
);

function App() {
  return (
    <Router> {/* Envuelve toda la aplicación con Router */}
      <AuthProvider>
        <CarritoProvider>
          <ToastContainer />
          <Header />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={
              <>
                <Main />
                <ProductosGrid />
              </>
            } />
            <Route path="/reservas" element={<ReservaMesa />} />
            <Route path="/login" element={<Login />} /> {/* Tu componente Login/Registro */}

            {/* Rutas protegidas para usuarios logueados */}
            <Route element={<PrivateRoutes />}>
              <Route path="/carrito" element={<Carrito />} />
              {/* Agrega aquí otras rutas que solo requieran estar logueado */}
            </Route>

            {/* Rutas protegidas solo para administradores */}
            <Route element={<PrivateRoutes adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Agrega aquí otras rutas solo para admin, como edición de productos, etc. */}
            </Route>

            {/* Ruta para cualquier otra URL no encontrada */}
            <Route path="*" element={<h1 style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>404: Página no encontrada</h1>} />
          </Routes>
          <Footer />
        </CarritoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;