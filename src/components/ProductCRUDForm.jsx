// src/components/ProductCRUDForm.jsx
import { useState } from 'react';
import axios from 'axios'; // Necesario para las operaciones de búsqueda a la API
import Swal from 'sweetalert2';
import '../css/ProductCRUDForm.css'; // Asegúrate de que este CSS exista y se cargue
// Importa el mock desde el archivo separado
import initialProductsMock from '../data/initialProductsMock.js'; 

const ProductCRUDForm = () => {
  // Estado para almacenar los datos del formulario de producto
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    estado: 'disponible',
    nivel_picante: '',
  });

  // Estado para la lista de productos en el mock local (para operaciones de agregar/modificar/borrar)
  const [products, setProducts] = useState(initialProductsMock);

  // Estado para controlar si el campo ID debe estar bloqueado (solo editable al limpiar o si no hay producto cargado)
  const [isIdLocked, setIsIdLocked] = useState(false);

  // URL base de tu API de productos (para operaciones de búsqueda)
  const API_BASE_URL = 'https://mi-api-burger.onrender.com/api/productos';

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Si se modifica el ID manualmente, desbloquearlo para permitir la entrada
    if (name === 'id' && isIdLocked) {
      setIsIdLocked(false);
    }
  };

  // Limpia todos los campos del formulario y desbloquea el ID
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
    setIsIdLocked(false);
    Swal.fire({
      icon: 'info',
      title: 'Formulario Limpio',
      text: 'Todos los campos han sido restablecidos.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Valida los campos del formulario según el tipo de operación
  const validateFormForOperation = (operationType) => {
    const { id, nombre, descripcion, precio, imagen, estado, nivel_picante } = formData;

    if (operationType === 'add') {
      if (!nombre.trim()) {
        Swal.fire({ icon: 'warning', title: 'Campo Requerido', text: 'El nombre es obligatorio para agregar un producto.' });
        return false;
      }
      if (!descripcion.trim()) {
        Swal.fire({ icon: 'warning', title: 'Campo Requerido', text: 'La descripción es obligatoria para agregar un producto.' });
        return false;
      }
      const numericPrecio = parseFloat(precio);
      if (isNaN(numericPrecio) || numericPrecio <= 0) {
        Swal.fire({ icon: 'warning', title: 'Precio Inválido', text: 'El precio debe ser un número positivo para agregar un producto.' });
        return false;
      }
      // Validación de URL de imagen: Acepta URLs http/https O rutas relativas que empiezan con /images/
      const isValidImageUrl = 
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(imagen) ||
        /^\/images\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(imagen);

      if (!imagen.trim() || !isValidImageUrl) {
        Swal.fire({ icon: 'warning', title: 'URL de Imagen Inválido', text: 'La URL de la imagen es obligatoria y debe ser un formato válido (JPG, PNG, GIF, WEBP) o una ruta relativa (/images/...).' });
        return false;
      }
      if (!estado) {
        Swal.fire({ icon: 'warning', title: 'Campo Requerido', text: 'El estado es obligatorio para agregar un producto.' });
        return false;
      }
      if (!nivel_picante) {
        Swal.fire({ icon: 'warning', title: 'Campo Requerido', text: 'El nivel de picante es obligatorio para agregar un producto.' });
        return false;
      }
    } else if (operationType === 'modify' || operationType === 'delete' || operationType === 'searchByID') {
      // Para modificar, eliminar o buscar por ID, el ID es siempre requerido
      if (!id) {
        Swal.fire({ icon: 'warning', title: 'ID Requerido', text: 'Por favor, ingrese el ID del producto.' });
        return false;
      }
    }

    // Asegura que el precio sea un número flotante si se ha ingresado
    if (precio !== '' && !isNaN(parseFloat(precio))) {
      setFormData(prevData => ({ ...prevData, precio: parseFloat(precio) }));
    }

    return true;
  };

  // Maneja la acción de agregar un nuevo producto (simulado localmente)
  const handleAdd = async () => {
    if (!validateFormForOperation('add')) return;

    try {
      const newId = String(Date.now()); // Generar un ID único simple para el mock local
      const newProduct = { ...formData, id: newId, precio: parseFloat(formData.precio) };

      // Actualizar el estado de los productos en el mock local
      setProducts((prevProducts) => [...prevProducts, newProduct]);

      Swal.fire({
        icon: 'success',
        title: '¡Producto Agregado!',
        text: `"${newProduct.nombre}" ha sido añadido exitosamente con ID: ${newProduct.id}.`,
        timer: 3000,
        showConfirmButton: false,
      });
      handleClear(); // Limpiar el formulario después de agregar
    } catch (error) {
      console.error('Error al agregar producto (mock):', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar',
        text: `No se pudo agregar el producto. ${error.message}`,
      });
    }
  };

  // Maneja la acción de modificar un producto existente (simulado localmente)
  const handleModify = async () => {
    if (!validateFormForOperation('modify')) return;

    try {
      const { id } = formData;
      const productIndex = products.findIndex(p => String(p.id) === String(id));

      if (productIndex === -1) {
        Swal.fire({ icon: 'error', title: 'Producto No Encontrado', text: `Producto con ID '${id}' no encontrado para modificar.` });
        return;
      }

      let productToUpdate = { ...products[productIndex] };
      let changesMade = false;

      for (const key in formData) {
        if (key === 'id') continue; // No permitir cambiar el ID
        const value = formData[key];

        // Solo actualizar si el valor no es vacío, nulo o indefinido, y es diferente al valor actual
        if (value !== '' && value !== null && value !== undefined && String(productToUpdate[key]) !== String(value)) {
          if (key === 'precio') {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue) && numericValue > 0) {
              productToUpdate[key] = numericValue;
              changesMade = true;
            } else {
              Swal.fire({ icon: 'warning', title: 'Precio Inválido', text: 'El precio debe ser un número positivo para modificar.' });
              return;
            }
          } else if (key === 'imagen') {
            // Validación de URL de imagen para modificar
            const isValidImageUrl = 
              /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(value) ||
              /^\/images\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value);

            if (!value.trim() || !isValidImageUrl) {
              Swal.fire({ icon: 'warning', title: 'URL de Imagen Inválido', text: 'La URL de la imagen debe ser un formato válido (JPG, PNG, GIF, WEBP) o una ruta relativa (/images/...).' });
              return;
            }
            productToUpdate[key] = value;
            changesMade = true;
          } else {
            productToUpdate[key] = value;
            changesMade = true;
          }
        }
      }

      if (!changesMade) {
        Swal.fire({ icon: 'info', title: 'Sin Cambios', text: 'No se han ingresado nuevos valores para modificar el producto.' });
        return;
      }

      // Actualizar el estado de los productos en el mock local
      const updatedProducts = [...products];
      updatedProducts[productIndex] = productToUpdate;
      setProducts(updatedProducts);
      setFormData(productToUpdate); // Actualiza el formulario con los datos modificados

      Swal.fire({
        icon: 'success',
        title: '¡Producto Modificado!',
        text: `"${productToUpdate.nombre}" (ID: ${productToUpdate.id}) ha sido actualizado exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
      setIsIdLocked(true); // Bloquear el ID después de una modificación exitosa
    } catch (error) {
      console.error('Error al modificar producto (mock):', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al modificar',
        text: `No se pudo modificar el producto. ${error.message}`,
      });
    }
  };

  // Maneja la acción de cambiar el estado de un producto a "agotado" (simulado localmente)
  const handleChangeStatusToSoldOut = async () => {
    if (!validateFormForOperation('delete')) return;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esto cambiará el estado del producto a 'agotado'.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cambiar a agotado',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      try {
        const { id } = formData;
        const productIndex = products.findIndex(p => String(p.id) === String(id));

        if (productIndex === -1) {
          Swal.fire({ icon: 'error', title: 'Producto No Encontrado', text: `Producto con ID '${id}' no encontrado.` });
          return;
        }

        const productToUpdate = { ...products[productIndex], estado: 'agotado' };

        // Actualizar el estado de los productos en el mock local
        const updatedProducts = [...products];
        updatedProducts[productIndex] = productToUpdate;
        setProducts(updatedProducts);
        setFormData(productToUpdate); // Actualiza el formulario con el estado modificado
        Swal.fire({
          icon: 'success',
          title: '¡Producto Agotado!',
          text: `El estado de "${productToUpdate.nombre}" (ID: ${productToUpdate.id}) ha sido cambiado a "agotado".`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsIdLocked(true); // Bloquear el ID después de cambiar el estado
      } catch (error) {
        console.error('Error al cambiar estado del producto (mock):', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cambiar estado',
          text: `No se pudo cambiar el estado del producto. ${error.message}`,
        });
      }
    }
  };

  // Maneja la búsqueda de un producto por nombre (CONECTADO A LA API REAL)
  const handleSearchByName = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire({ icon: 'warning', title: 'Nombre Requerido', text: 'Por favor, ingrese el nombre del producto para buscar.' });
      return;
    }
    try {
      // Usamos axios para conectar con la API real
      const response = await axios.get(`${API_BASE_URL}?nombre=${encodeURIComponent(formData.nombre)}`);

      if (response.data && response.data.length > 0) {
        const productFound = response.data[0]; // Toma el primer resultado si hay múltiples coincidencias
        setFormData(productFound); // Carga los datos del producto encontrado en el formulario
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado',
          text: `"${productFound.nombre}" (ID: ${productFound.id}) cargado en el formulario.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsIdLocked(true); // Bloquear el ID al encontrar un producto
      } else {
        // Lógica para producto no encontrado: Muestra SweetAlert y limpia el formulario
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado',
          text: `No se encontró ningún producto con el nombre "${formData.nombre}".`,
        });
        handleClear(); // Limpiar el formulario si no se encuentra
      }
    } catch (error) {
      console.error('Error al buscar producto por nombre (API):', error);
      // Lógica para error en la búsqueda: Muestra SweetAlert de error y limpia el formulario
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: 'info', // Usar 'info' o 'warning' para "no encontrado"
          title: 'Producto No Encontrado',
          text: `No se encontró ningún producto con el nombre "${formData.nombre}".`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al buscar',
          text: `No se pudo buscar el producto por nombre. ${error.message}`,
        });
      }
      handleClear(); // Limpiar el formulario en caso de error
    }
  };

  // Maneja la búsqueda de un producto por ID (CONECTADO A LA API REAL)
  const handleSearchByID = async () => {
    if (!validateFormForOperation('searchByID')) return;

    try {
      // Usamos axios para conectar con la API real
      const response = await axios.get(`${API_BASE_URL}/${formData.id}`);
      if (response.data) {
        setFormData(response.data); // Carga los datos del producto encontrado en el formulario
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado',
          text: `El producto con ID "${formData.id}" ha sido cargado.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsIdLocked(true); // Bloquear el ID al encontrar un producto
      } else {
        // Esta rama else solo se alcanzaría si la API devuelve un 200 OK con data nula/vacía,
        // lo cual es menos común para un "no encontrado" por ID.
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado',
          text: `No se encontró ningún producto con el ID "${formData.id}".`,
        });
        handleClear(); // Limpiar el formulario si no se encuentra
      }
    } catch (error) {
      console.error('Error al buscar producto por ID (API):', error);
      // Lógica para error en la búsqueda: Muestra SweetAlert de error y limpia el formulario
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: 'info', // Usar 'info' o 'warning' para "no encontrado"
          title: 'Producto No Encontrado',
          text: `No se encontró ningún producto con el ID "${formData.id}".`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al buscar',
          text: `No se pudo encontrar el producto con ID "${formData.id}". ${error.message}`,
        });
      }
      handleClear(); // Limpiar el formulario en caso de error
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
              {/* Campo ID del Producto */}
              <div className="form-floating mb-3">
                <input
                  name="id"
                  type="text"
                  className="form-control"
                  id="id"
                  placeholder="ID"
                  value={formData.id}
                  onChange={handleChange}
                  readOnly={isIdLocked}
                  aria-label="ID del Producto"
                />
                <label htmlFor="id">ID del Producto</label>
              </div>
              {/* Campo Nombre del Producto */}
              <div className="form-floating mb-3">
                <input
                  name="nombre"
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Nombre del producto"
                  value={formData.nombre}
                  onChange={handleChange}
                  aria-label="Nombre del Producto"
                />
                <label htmlFor="nombre">Nombre del Producto</label>
              </div>
              {/* Campo Descripción */}
              <div className="form-floating mb-3">
                <input
                  name="descripcion"
                  type="text"
                  className="form-control"
                  id="descripcion"
                  placeholder="Descripción"
                  value={formData.descripcion}
                  onChange={handleChange}
                  aria-label="Descripción del Producto"
                />
                <label htmlFor="descripcion">Descripción</label>
              </div>
              {/* Campo Precio */}
              <div className="form-floating mb-3">
                <input
                  name="precio"
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="precio"
                  placeholder="Precio"
                  value={formData.precio}
                  onChange={handleChange}
                  aria-label="Precio del Producto"
                />
                <label htmlFor="precio">Precio</label>
              </div>
              {/* Campo URL de la Imagen */}
              <div className="form-floating mb-3">
                <input
                  name="imagen"
                  type="url"
                  className="form-control"
                  id="imagen"
                  placeholder="URL de la imagen"
                  value={formData.imagen}
                  onChange={handleChange}
                  aria-label="URL de la Imagen del Producto"
                />
                <label htmlFor="imagen">URL de la Imagen</label>
              </div>
              {/* Campo Estado (select) */}
              <div className="form-floating mb-3">
                <select
                  name="estado"
                  className="form-control"
                  id="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  aria-label="Estado del Producto"
                >
                  <option value="">Seleccione estado</option>
                  <option value="disponible">Disponible</option>
                  <option value="agotado">Agotado</option>
                </select>
                <label htmlFor="estado">Estado</label>
              </div>
              {/* Campo Nivel de Picante (select) */}
              <div className="form-floating mb-3">
                <select
                  name="nivel_picante"
                  className="form-control"
                  id="nivel_picante"
                  value={formData.nivel_picante}
                  onChange={handleChange}
                  aria-label="Nivel de Picante del Producto"
                >
                  <option value="">Seleccione nivel</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <label htmlFor="nivel_picante">Nivel de Picante</label>
              </div>

              {/* Botones de acción */}
              <div className="d-flex gap-2 flex-wrap mb-3">
                <button type="button" className="btn btn-primary" onClick={handleClear}>Limpiar</button>
                <button type="submit" className="btn btn-success" onClick={handleAdd}>Agregar</button>
                <button type="button" className="btn btn-dark" onClick={handleModify}>Modificar</button>
                <button type="button" className="btn btn-danger" onClick={handleChangeStatusToSoldOut}>Marcar Agotado</button>
                <button type="button" className="btn btn-dark" onClick={handleSearchByName}>Buscar por Nombre</button>
                <button type="button" className="btn btn-dark" onClick={handleSearchByID}>Buscar por ID</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductCRUDForm;
