// src/components/ProductCRUDForm.jsx
import { useState } from 'react';
import axios from 'axios'; // Importa axios
import Swal from 'sweetalert2'; // Importa SweetAlert2
import '../css/ProductCRUDForm.css'; // Importa el CSS

const ProductCRUDForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    estado: 'disponible',
    nivel_picante: '',
  });

  const [message, setMessage] = useState(''); // Este estado lo mantendremos para mensajes internos si es necesario, aunque Swal será el principal

  // URL base de tu API desplegada en Render
  const API_BASE_URL = 'https://mi-api-burger.onrender.com/api/productos';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      estado: 'disponible',
      nivel_picante: '',
    });
    setMessage('Formulario limpiado.');
    Swal.fire({
      icon: 'info',
      title: 'Formulario Limpio',
      text: 'Todos los campos han sido restablecidos.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleAdd = async () => {
    try {
      // Remover el ID si es autogenerado por la API al crear
      const dataToSend = { ...formData };
      delete dataToSend.id; // Asume que la API genera el ID

      const response = await axios.post(API_BASE_URL, dataToSend);
      console.log('Producto agregado:', response.data);
      Swal.fire({
        icon: 'success',
        title: '¡Producto Agregado!',
        text: `"${response.data.nombre}" ha sido añadido exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
      handleClear(); // Limpia el formulario después de agregar
    } catch (error) {
      console.error('Error al agregar producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar',
        text: `No se pudo agregar el producto. ${error.response ? error.response.data.message : error.message}`,
      });
    }
  };

  const handleModify = async () => {
    if (!formData.id) {
      Swal.fire({
        icon: 'warning',
        title: 'ID Requerido',
        text: 'Por favor, ingrese el ID del producto a modificar.',
      });
      return;
    }
    try {
      const response = await axios.put(`${API_BASE_URL}/${formData.id}`, formData);
      console.log('Producto modificado:', response.data);
      Swal.fire({
        icon: 'success',
        title: '¡Producto Modificado!',
        text: `"${response.data.nombre}" ha sido actualizado exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al modificar producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al modificar',
        text: `No se pudo modificar el producto. ${error.response ? error.response.data.message : error.message}`,
      });
    }
  };

  const handleDelete = async () => {
    if (!formData.id) {
      Swal.fire({
        icon: 'warning',
        title: 'ID Requerido',
        text: 'Por favor, ingrese el ID del producto a eliminar.',
      });
      return;
    }

    // Confirmación antes de cambiar el estado o eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esto cambiará el estado del producto a 'agotado'. ¡No podrás revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cambiar a agotado',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      try {
        // En lugar de DELETE, hacemos un PUT para cambiar el estado a 'agotado'
        const updatedData = { ...formData, estado: 'agotado' };
        const response = await axios.put(`${API_BASE_URL}/${formData.id}`, updatedData);
        console.log('Producto estado modificado:', response.data);
        setFormData(response.data); // Actualiza el formulario con el nuevo estado
        Swal.fire({
          icon: 'success',
          title: '¡Producto Agotado!',
          text: `El estado de "${response.data.nombre}" ha sido cambiado a "agotado".`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error al cambiar estado del producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cambiar estado',
          text: `No se pudo cambiar el estado del producto. ${error.response ? error.response.data.message : error.message}`,
        });
      }
    }
  };

  const handleSearchByName = async () => {
    if (!formData.nombre) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre Requerido',
        text: 'Por favor, ingrese el nombre del producto para buscar.',
      });
      return;
    }
    try {
      // Asumiendo que tu API soporta la búsqueda por nombre con un parámetro de query (ej: /api/productos?nombre=...)
      // Si no, necesitarías un endpoint específico como /api/productos/buscarPorNombre/:nombre
      // O tendrías que obtener todos los productos y filtrar en el cliente (menos eficiente).
      const response = await axios.get(`${API_BASE_URL}?nombre=${formData.nombre}`);

      if (response.data && response.data.length > 0) {
        // Asumimos que si busca por nombre, podría devolver un array.
        // Tomamos el primer resultado para cargar el formulario.
        const productFound = response.data[0];
        setFormData(productFound);
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado',
          text: `"${productFound.nombre}" cargado en el formulario.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado',
          text: `No se encontró ningún producto con el nombre "${formData.nombre}".`,
        });
        handleClear(); // Limpia el formulario si no se encuentra
      }
    } catch (error) {
      console.error('Error al buscar producto por nombre:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al buscar',
        text: `No se pudo buscar el producto por nombre. ${error.response ? error.response.data.message : error.message}`,
      });
    }
  };

  const handleSearchByID = async () => {
    if (!formData.id) {
      Swal.fire({
        icon: 'warning',
        title: 'ID Requerido',
        text: 'Por favor, ingrese el ID del producto para buscar.',
      });
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/${formData.id}`);
      if (response.data) {
        // Si la API devuelve el objeto directamente
        setFormData(response.data); // Llena el formulario con los datos encontrados
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado',
          text: `El producto con ID "${formData.id}" ha sido cargado.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Si la API devuelve un 200 pero el body está vacío o es null
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado',
          text: `No se encontró ningún producto con el ID "${formData.id}".`,
        });
        handleClear(); // Limpia el formulario si no se encuentra
      }
    } catch (error) {
      // Esto capturaría errores 404 (Not Found) u otros errores de la API
      console.error('Error al buscar producto por ID:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al buscar',
        text: `No se pudo encontrar el producto con ID "${formData.id}". ${error.response && error.response.status === 404 ? 'Producto no existe.' : error.message}`,
      });
      handleClear();
    }
  };

  return (
    <>
      <div className="titulo-crud">
        <h2>Gestión de productos</h2>
      </div>

      <main>
        <section className="contenedor">
          <div className="bg-black bg-opacity-75 text-white p-5 custom-form-container">
            <form id="formulario" onSubmit={(e) => e.preventDefault()}>
              <div className="form-floating mb-3">
                <input
                  name="id"
                  type="text"
                  className="form-control"
                  id="id"
                  placeholder="ID"
                  required
                  value={formData.id}
                  onChange={handleChange}
                />
                <label htmlFor="id">ID del Producto</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  name="nombre"
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Nombre del producto"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                />
                <label htmlFor="nombre">Nombre del Producto</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  name="descripcion"
                  type="text"
                  className="form-control"
                  id="descripcion"
                  placeholder="Descripción"
                  required
                  value={formData.descripcion}
                  onChange={handleChange}
                />
                <label htmlFor="descripcion">Descripción</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  name="precio"
                  type="number"
                  className="form-control"
                  id="precio"
                  placeholder="Precio"
                  required
                  value={formData.precio}
                  onChange={handleChange}
                />
                <label htmlFor="precio">Precio</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  name="imagen"
                  type="url"
                  className="form-control"
                  id="imagen"
                  placeholder="URL de la imagen"
                  required
                  value={formData.imagen}
                  onChange={handleChange}
                />
                <label htmlFor="imagen">URL de la Imagen</label>
              </div>
              <div className="form-floating mb-3">
                <select
                  name="estado"
                  className="form-control"
                  id="estado"
                  required
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="">Seleccione estado</option>
                  <option value="disponible">Disponible</option>
                  <option value="agotado">Agotado</option>
                </select>
                <label htmlFor="estado">Estado</label>
              </div>
              <div className="form-floating mb-3">
                <select
                  name="nivel_picante"
                  className="form-control" // Cambié type="number" a className="form-control" en el select
                  id="nivel_picante"
                  placeholder="Nivel de Picante"
                  required
                  value={formData.nivel_picante}
                  onChange={handleChange}
                >
                  <option value="">Seleccione nivel</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <label htmlFor="nivel_picante">Nivel de Picante</label>
              </div>

              <div className="d-flex gap-2 flex-wrap mb-3">
                <button type="button" className="btn btn-primary" onClick={handleClear}>Limpiar</button>
                <button type="submit" className="btn btn-success" onClick={handleAdd}>Agregar</button>
                <button type="button" className="btn btn-warning" onClick={handleModify}>Modificar</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                <button type="button" className="btn btn-info" onClick={handleSearchByName}>Buscar por Nombre</button>
                <button type="button" className="btn btn-secondary" onClick={handleSearchByID}>Buscar por ID</button>
              </div>

              {/* El mensaje de SweetAlert2 reemplazará en gran medida esto, pero se mantiene si deseas mensajes complementarios */}
              {message && (
                <div id="mensaje" className="mt-3 alert alert-info" role="alert">
                  {message}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductCRUDForm;