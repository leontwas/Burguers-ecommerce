function ListaDeUsuarios() {
    const usuarios = ["Juan", "Ana", "Pedro", "Maria", "Luisa"];
    return (
        <ul>
            {usuarios.map(usuario => (
                <li key={usuario}>{usuario}</li>
            ))}
        </ul>
    );
}
export default ListaDeUsuarios;