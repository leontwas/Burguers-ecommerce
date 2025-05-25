import Tarjeta from './Tarjeta';

const productos = [
  { imagen: '/public/01_FuegoSupremo.png', nombre: 'Fuego Supremo', picanteNivel: 5, precio: 5200 },
  { imagen: '/public/02_InfernoClasica.png', nombre: 'Inferno Clásica', picanteNivel: 4, precio: 4800 },
  { imagen: '/public/03_ChiliQueen.png', nombre: 'Chili Queen', picanteNivel: 3, precio: 4900 },
  { imagen: '/public/04_LavaBath.png', nombre: 'Lava Bath', picanteNivel: 5, precio: 5500 },
  { imagen: '/public/05_SmokyHell.png', nombre: 'Smoky Hell', picanteNivel: 4, precio: 5100 },
  { imagen: '/public/06_GloryFire.png', nombre: 'Glory Fire', picanteNivel: 3, precio: 4700 },
  { imagen: '/public/07_DebilTouch.png', nombre: 'Devil Touch', picanteNivel: 5, precio: 6000 },
  { imagen: '/public/08_HotRodeo.png', nombre: 'Hot Rodeo', picanteNivel: 2, precio: 4600 },
  { imagen: '/public/09_VolcanoKiss.png', nombre: 'Volcano Kiss', picanteNivel: 4, precio: 5300 },
  { imagen: '/public/10_SpicyTornado.png', nombre: 'Spicy Tornado', picanteNivel: 3, precio: 4950 },
  { imagen: '/public/11_JalapenioRush.png', nombre: 'Jalapeño Rush', picanteNivel: 2, precio: 4550 },
  { imagen: '/public/12_UltimateBurn.png', nombre: 'Ultimate Burn', picanteNivel: 5, precio: 6200 },
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
