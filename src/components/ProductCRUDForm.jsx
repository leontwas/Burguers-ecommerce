// src/components/ProductCRUDForm.jsx
import { useState } from 'react';
import Swal from 'sweetalert2'; // Se mantiene para SweetAlerts
import '../css/ProductCRUDForm.css'; 
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

  // Estado para la lista de productos en el mock local (para operaciones de agregar/modificar/borrar y búsquedas locales)
  // IMPORTANTE: ESTO ES UN MOCK EN MEMORIA DEL NAVEGADOR. 
  // Los cambios realizados aquí NO persisten en el archivo initialProductsMock.js en tu disco duro.
  // Se reinician al recargar la página.
  const [products, setProducts] = useState(initialProductsMock);

  // Estado para controlar si el campo ID debe estar bloqueado (solo editable al limpiar o si no hay producto cargado)
  const [isIdLocked, setIsIdLocked] = useState(false);

  // URL base de tu API de productos (ya no se usa para búsquedas en este archivo)
  // const API_BASE_URL = 'https://mi-api-burger.onrender.com/api/productos';

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

  // Maneja la acción de agregar un nuevo producto (simulado localmente en memoria)
  const handleAdd = async () => {
    if (!validateFormForOperation('add')) return;

    try {
      const newId = String(Date.now()); // Generar un ID único simple para el mock local
      const newProduct = { ...formData, id: newId, precio: parseFloat(formData.precio) };

      // Actualizar el estado de los productos en el mock local (en memoria)
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

  // Maneja la acción de modificar un producto existente (simulado localmente en memoria)
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

      // Actualizar el estado de los productos en el mock local (en memoria)
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

  // Maneja la acción de cambiar el estado de un producto (simulado localmente en memoria)
  const handleChangeStatusToSoldOut = async () => {
    if (!validateFormForOperation('delete')) return;

    const { id } = formData;
    const productIndex = products.findIndex(p => String(p.id) === String(id));

    if (productIndex === -1) {
      Swal.fire({ icon: 'error', title: 'Producto No Encontrado', text: `Producto con ID '${id}' no encontrado.` });
      return;
    }

    let productToUpdate = { ...products[productIndex] };
    const currentStatus = productToUpdate.estado;
    const newStatus = currentStatus === 'disponible' ? 'agotado' : 'disponible';
    const actionText = newStatus === 'agotado' ? 'cambiar a agotado' : 'cambiar a disponible';
    const successText = newStatus === 'agotado' ? 'agotado' : 'disponible';

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esto cambiará el estado del producto a '${newStatus}'.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      try {
        productToUpdate.estado = newStatus;

        // Actualizar el estado de los productos en el mock local (en memoria)
        const updatedProducts = [...products];
        updatedProducts[productIndex] = productToUpdate;
        setProducts(updatedProducts);
        setFormData(productToUpdate); // Actualiza el formulario con el estado modificado
        Swal.fire({
          icon: 'success',
          title: `¡Producto ${successText.charAt(0).toUpperCase() + successText.slice(1)}!`,
          text: `El estado de "${productToUpdate.nombre}" (ID: ${productToUpdate.id}) ha sido cambiado a "${newStatus}".`,
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

  // --- MÉTODOS DE BÚSQUEDA LOCAL (OPERAN SOBRE EL ESTADO 'products') ---

  // Maneja la búsqueda de un producto por nombre (LOCAL en el mock en memoria)
  const handleSearchByNameLocal = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire({ icon: 'warning', title: 'Nombre Requerido', text: 'Por favor, ingrese el nombre del producto para buscar en el mock local.' });
      return;
    }
    
    try {
      const nombreLower = formData.nombre.toLowerCase();
      const productFound = products.find(p => p.nombre && p.nombre.toLowerCase().includes(nombreLower));

      if (productFound) {
        setFormData(productFound); // Carga los datos del producto encontrado en el formulario
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado (Local)',
          text: `"${productFound.nombre}" (ID: ${productFound.id}) cargado desde el mock local.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsIdLocked(true); // Bloquear el ID al encontrar un producto
      } else {
        // Lógica para producto no encontrado: Muestra SweetAlert y limpia el formulario
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado (Local)',
          text: `No se encontró ningún producto con el nombre "${formData.nombre}" en el mock local.`,
        });
        handleClear(); // Limpiar el formulario si no se encuentra
      }
    } catch (error) {
      console.error('Error al buscar producto por nombre (local mock):', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al buscar (Local)',
        text: `Ocurrió un error al buscar el producto por nombre en el mock local. ${error.message}`,
      });
      handleClear(); // Limpiar el formulario en caso de error
    }
  };

  // Maneja la búsqueda de un producto por ID (LOCAL en el mock en memoria)
  const handleSearchByIDLocal = async () => {
    if (!validateFormForOperation('searchByID')) return; // Reutiliza la validación de ID

    try {
      const productFound = products.find(p => String(p.id) === String(formData.id));

      if (productFound) {
        setFormData(productFound); // Carga los datos del producto encontrado en el formulario
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado (Local)',
          text: `El producto con ID "${formData.id}" ha sido cargado desde el mock local.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsIdLocked(true); // Bloquear el ID al encontrar un producto
      } else {
        // Lógica para producto no encontrado: Muestra SweetAlert y limpia el formulario
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado (Local)',
          text: `No se encontró ningún producto con el ID "${formData.id}" en el mock local.`,
        });
        handleClear(); // Limpiar el formulario si no se encuentra
      }
    } catch (error) {
      console.error('Error al buscar producto por ID (local mock):', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al buscar (Local)',
        text: `Ocurrió un error al buscar el producto por ID en el mock local. ${error.message}`,
      });
      handleClear(); // Limpiar el formulario en caso de error
    }
  };

  // --- MÉTODOS DE BÚSQUEDA A LA API EXTERNA (RENOMBRADOS y COMENTADOS) ---
  // Las siguientes funciones están comentadas porque no se utilizan actualmente en el código.
  // Si en el futuro necesitas interactuar con la API externa para búsquedas, puedes descomentarlas.

  /*
  const handleSearchByNameAPI = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire({ icon: 'warning', title: 'Nombre Requerido', text: 'Por favor, ingrese el nombre del producto para buscar en la API externa.' });
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
          title: 'Producto Encontrado (API)',
          text: `"${productFound.nombre}" (ID: ${productFound.id}) cargado desde la API.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsIdLocked(true); // Bloquear el ID al encontrar un producto
      } else {
        // Lógica para producto no encontrado: Muestra SweetAlert y limpia el formulario
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado (API)',
          text: `No se encontró ningún producto con el nombre "${formData.nombre}" en la API externa.`,
        });
        handleClear(); // Limpiar el formulario si no se encuentra
      }
    } catch (error) {
      console.error('Error al buscar producto por nombre (API):', error);
      // Lógica para error en la búsqueda: Muestra SweetAlert de error y limpia el formulario
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: 'info', 
          title: 'Producto No Encontrado (API)',
          text: `No se encontró ningún producto con el nombre "${formData.nombre}" en la API externa.`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al buscar (API)',
          text: `No se pudo buscar el producto por nombre en la API externa. ${error.message}`,
        });
      }
      handleClear(); // Limpiar el formulario en caso de error
    }
  };

  const handleSearchByIDAPI = async () => {
    if (!validateFormForOperation('searchByID')) return;

    try {
      // Usamos axios para conectar con la API real
      const response = await axios.get(`${API_BASE_URL}/${formData.id}`);
      if (response.data) {
        setFormData(response.data); // Carga los datos del producto encontrado en el formulario
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado (API)',
          text: `El producto con ID "${formData.id}" ha sido cargado desde la API.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsIdLocked(true); // Bloquear el ID al encontrar un producto
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado (API)',
          text: `No se encontró ningún producto con el ID "${formData.id}" en la API externa.`,
        });
        handleClear(); // Limpiar el formulario si no se encuentra
      }
    } catch (error) {
      console.error('Error al buscar producto por ID (API):', error);
      // Lógica para error en la búsqueda: Muestra SweetAlert de error y limpia el formulario
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: 'info', 
          title: 'Producto No Encontrado (API)',
          text: `No se encontró ningún producto con el ID "${formData.id}" en la API externa.`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al buscar (API)',
          text: `No se pudo encontrar el producto con ID "${formData.id}" en la API externa. ${error.message}`,
        });
      }
      handleClear(); // Limpiar el formulario en caso de error
    }
  };
  */

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
                  type="text" 
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
                <button type="button" className="btn btn-danger" onClick={handleChangeStatusToSoldOut}>Cambiar Estado</button>
                <button type="button" className="btn btn-info" onClick={handleSearchByNameLocal}>Buscar por Nombre</button>
                <button type="button" className="btn btn-info" onClick={handleSearchByIDLocal}>Buscar por ID</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductCRUDForm;
