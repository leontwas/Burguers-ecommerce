import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ backgroundColor: "#333", color: "white", padding: "10px" }}>
      <ul style={{
        listStyle: "none",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        margin: 0,
        padding: 0
      }}>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/novedades">Novedades</Link></li>
        <li><Link to="/reservas">Reservas</Link></li>
        <li><Link to="/nosotros">Nosotros</Link></li>
        <li><Link to="/login">Login</Link></li> {/* Asumiendo que creas una ruta "/login" */}
      </ul>
    </nav>
  );
}

export default Navbar;
