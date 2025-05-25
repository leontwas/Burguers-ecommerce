import Tarjeta from './Tarjeta';
import '../assets/images/productos/debilTouch.png';
import '../assets/images/productos/fuegoSupremo.png';
import '../assets/images/productos/gloryFire.png';
import '../assets/images/productos/hotRodeo.png';
import '../assets/images/productos/infernoClasica.png';
import '../assets/images/productos/jalapenioRush.png';
import '../assets/images/productos/lavaBath.png';
import '../assets/images/productos/ultimateBurn.png';
import '../assets/images/productos/volcanoKiss.png'; 
import '../assets/images/productos/chiliQueen.png';
import '../assets/images/productos/smokyHell.png';
import '../assets/images/productos/spicyTornado.png';  

const productos = [
  { imagen: '/src/assets/images/productos/fuegoSupremo.png', nombre: 'Fuego Supremo', picanteNivel: 5, precio: 5200 },
  { imagen: '/src/assets/images/productos/infernoClasica.png', nombre: 'Inferno Clásica', picanteNivel: 4, precio: 4800 },
  { imagen: '/src/assets/images/productos/chiliQueen.png', nombre: 'Chili Queen', picanteNivel: 3, precio: 4900 },
  { imagen: '/src/assets/images/productos/lavaBath.png', nombre: 'Lava Bath', picanteNivel: 5, precio: 5500 },
  { imagen: '//src/assets/images/productos/smokyHell.png', nombre: 'Smoky Hell', picanteNivel: 4, precio: 5100 },
  { imagen: '/src/assets/images/productos/gloryFire.png', nombre: 'Glory Fire', picanteNivel: 3, precio: 4700 },
  { imagen: '/src/assets/images/productos/debilTouch.png', nombre: 'Devil Touch', picanteNivel: 5, precio: 6000 },
  { imagen: '/src/assets/images/productos/hotRodeo.png', nombre: 'Hot Rodeo', picanteNivel: 2, precio: 4600 },
  { imagen: '/src/assets/images/productos/volcanoKiss.png', nombre: 'Volcano Kiss', picanteNivel: 4, precio: 5300 },
  { imagen: '/src/assets/images/productos/spicyTornado.png', nombre: 'Spicy Tornado', picanteNivel: 3, precio: 4950 },
  { imagen: '/src/assets/images/productos/jalapenioRush.png', nombre: 'Jalapeño Rush', picanteNivel: 2, precio: 4550 },
  { imagen: '/src/assets/images/productos/ultimateBurn.png', nombre: 'Ultimate Burn', picanteNivel: 5, precio: 6200 },
];

function ProductosGrid() {
  return (
    <div className="tarjeta-grid-container">
      {productos.map((producto, index) => (
        <Tarjeta key={index} {...producto} />
      ))}
    </div>
  );
}

export default ProductosGrid;
