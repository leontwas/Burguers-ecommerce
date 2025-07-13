import './css/App.css';
import './css/index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import ProductosGrid from './components/ProductosGrid';
import Carrito from './components/Carrito';
import Novedades from './pages/Novedades';
import ReservaMesa from './components/ReservaMesa';
import Nosotros from './pages/Nosotros';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CarritoProvider } from "./context/CarritoProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
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
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/reservas" element={<ReservaMesa />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </CarritoProvider>
  );
}

export default App;

