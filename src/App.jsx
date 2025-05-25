// src/App.jsx
import './css/App.css';
import './css/index.css';
import Header from "./components/Header";
import Main from './components/Main';
import EquipoDeTrabajo from './components/EquipoDeTrabajo';
import Boton from './components/Boton';
import ListaDeUsuarios from './components/ListaDeUsuarios';
import ListaDeProductos from './components/ListaDeProductos';
import Footer from './components/Footer';
import ProductosGrid from './components/ProductosGrid';
import TarjetaProyecto from './components/TarjetaProyecto';
import Carrito from './components/Carrito'; // Nuevo
import { CarritoProvider } from './context/CarritoContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const equipo = [/* ... tu equipo ... */];

function App() {
  return (
    <CarritoProvider>
      <ToastContainer />
      <Header />
      <Main />
      <ProductosGrid />
      <Carrito /> {/* Mostrar carrito */}
      <Footer />
    </CarritoProvider>
  );
}

export default App;

