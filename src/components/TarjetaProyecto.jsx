import Boton from "./Boton";
import '../css/TarjetaProyecto.css';
function TarjetaProyecto({ titulo, descripcion, botonTexto }) {
  return (
    <div className="proyect-conteiner">
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
      <Boton texto={botonTexto} color="blue" />
    </div>
  );
}
export default TarjetaProyecto;