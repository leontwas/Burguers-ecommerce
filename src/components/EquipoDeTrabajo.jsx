import PropTypes from 'prop-types';
import '../css/equipoDeTrabajo.css';

function EquipoDeTrabajo({ equipo }) {
  return (
    <div className="equipo-container">
      {equipo.map((persona, index) => (
        <div key={index} className="equipo-card">
          <div className="equipo-miembro">
            <h1>{persona.nombre}</h1>
            <p>{persona.rol}</p>
          </div>
          <div className="equipo-imagen">
            <img src={persona.imagen} alt={`Foto de ${persona.nombre}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

EquipoDeTrabajo.propTypes = {
  equipo: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      rol: PropTypes.string.isRequired,
      imagen: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EquipoDeTrabajo;
