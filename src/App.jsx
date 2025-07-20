// src/App.jsx
import './css/App.css';
import './css/index.css';
import './css/footer.css';
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
import { AuthProvider } from "./context/AuthProvider"; // ← Importar AuthProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ⭐ IMPORTA TU COMPONENTE ProductCRUDForm ⭐
import ProductCRUDForm from './components/ProductCRUDForm'; // Asegúrate de que la ruta sea correcta

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

          {/* ⭐ AÑADE ESTA RUTA PARA EL COMPONENTE CRUD ⭐ */}
          <Route path="/crud-productos" element={<ProductCRUDForm />} />
        </Routes>
        <Footer />
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;