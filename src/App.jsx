import './css/App.css';
import './css/index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import ProductosGrid from './components/ProductosGrid';
import Carrito from './components/Carrito';
import ReservaMesa from './components/ReservaMesa';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CarritoProvider } from "./context/CarritoProvider";
import { AuthProvider } from "./context/AuthContext"; // ← Importar AuthProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <ToastContainer />
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
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;