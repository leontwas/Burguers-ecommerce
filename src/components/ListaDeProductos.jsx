function ListaDeProductos({productos}) {  
    return (
        <ol>
            {productos.map(producto => (
                <li key={producto}>{producto}</li>
            ))}
        </ol>
    );
}
export default ListaDeProductos;