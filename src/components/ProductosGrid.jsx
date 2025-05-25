import Tarjeta from './Tarjeta';

const productos = [
  { imagen: 'src/assets/Imagenes/productos/01_FuegoSupremo.png', nombre: 'Fuego Supremo', picanteNivel: 5, precio: 5200 },
  { imagen: 'src/assets/Imagenes/productos/02_InfernoClasica.png', nombre: 'Inferno Clásica', picanteNivel: 4, precio: 4800 },
  { imagen: 'src/assets/Imagenes/productos/03_ChiliQueen.png', nombre: 'Chili Queen', picanteNivel: 3, precio: 4900 },
  { imagen: 'src/assets/Imagenes/productos/04_LavaBath.png', nombre: 'Lava Bath', picanteNivel: 5, precio: 5500 },
  { imagen: 'src/assets/Imagenes/productos/05_SmokyHell.png', nombre: 'Smoky Hell', picanteNivel: 4, precio: 5100 },
  { imagen: 'src/assets/Imagenes/productos/06_GloryFire.png', nombre: 'Glory Fire', picanteNivel: 3, precio: 4700 },
  { imagen: 'src/assets/Imagenes/productos/07_DebilTouch.png', nombre: 'Devil Touch', picanteNivel: 5, precio: 6000 },
  { imagen: 'src/assets/Imagenes/productos/08_HotRodeo.png', nombre: 'Hot Rodeo', picanteNivel: 2, precio: 4600 },
  { imagen: 'src/assets/Imagenes/productos/09_VolcanoKiss.png', nombre: 'Volcano Kiss', picanteNivel: 4, precio: 5300 },
  { imagen: 'src/assets/Imagenes/productos/10_SpicyTornado.png', nombre: 'Spicy Tornado', picanteNivel: 3, precio: 4950 },
  { imagen: 'src/assets/Imagenes/productos/11_JalapenioRush.png', nombre: 'Jalapeño Rush', picanteNivel: 2, precio: 4550 },
  { imagen: 'src/assets/Imagenes/productos/12_UltimateBurn.png', nombre: 'Ultimate Burn', picanteNivel: 5, precio: 6200 },
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
