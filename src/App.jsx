// src/App.jsx
import './css/App.css';
import './css/index.css';
import Header from "./components/Header";
import Main from './components/Main';
import Footer from './components/Footer';
import ProductosGrid from './components/ProductosGrid';
import Carrito from './components/Carrito'; // Nuevo
import { CarritoProvider } from './context/CarritoContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <CarritoProvider>
      <ToastContainer />
      <Header />
      <Main />
      <ProductosGrid />
      <Carrito />
      <Footer />
    </CarritoProvider>
  );
}

export default App;

