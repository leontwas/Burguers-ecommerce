
function Navbar () {
  return (
    <nav style={{ backgroundColor: "#333", color: "white", padding: "10px" }}>  
      <ul style={{ listStyle: "none", display: "flex", justifyContent: "space-around", margin: 0 }}>  
        <li><a href="./index.html">Inicio</a></li>
        <li><a href="/productos.html">Productos</a></li>
        <li><a href="./novedades.html">Novedades</a></li>
        <li><a href="./reservas.html">Reservas</a></li>
        <li><a href="./nosotros.html">Nosotros</a></li>
      </ul>
    </nav>
  );
};
export default Navbar;
