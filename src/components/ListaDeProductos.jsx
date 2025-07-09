import PropTypes from 'prop-types';

function ListaDeProductos({ productos }) {
  return (
    <ol>
      {productos.map((producto, index) => (
        <li key={index}>{producto}</li>
      ))}
    </ol>
  );
}

ListaDeProductos.propTypes = {
  productos: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ListaDeProductos;
