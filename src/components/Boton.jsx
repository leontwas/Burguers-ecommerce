function Boton({ texto, color, onClick }) {
  const estilo = {
    backgroundColor: color,
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,1)',
  };

  return (
    <button style={estilo} onClick={onClick}>
      {texto}
    </button>
  );
}

export default Boton;

