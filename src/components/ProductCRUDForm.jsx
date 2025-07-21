// src/components/ProductCRUDForm.jsx
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/ProductCRUDForm.css';

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

  // Nuevo estado para controlar si el campo ID debe estar bloqueado
  const [isIdLocked, setIsIdLocked] = useState(false);

  const API_BASE_URL = 'https://mi-api-burger.onrender.com/api/productos';

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
    // Al limpiar, el ID siempre debe ser editable
    setIsIdLocked(false);
    Swal.fire({
      icon: 'info',
      title: 'Formulario Limpio',
      text: 'Todos los campos han sido restablecidos.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

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
      if (!imagen.trim() || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(imagen)) {
        Swal.fire({ icon: 'warning', title: 'URL de Imagen Inválido', text: 'La URL de la imagen es obligatoria y debe ser un formato válido (JPG, PNG, GIF, WEBP).' });
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
      if (!id) {
        Swal.fire({ icon: 'warning', title: 'ID Requerido', text: 'Por favor, ingrese el ID del producto.' });
        return false;
      }
    }

    if (precio !== '' && !isNaN(parseFloat(precio))) {
      setFormData(prevData => ({ ...prevData, precio: parseFloat(precio) }));
    }

    return true;
  };

  const handleAdd = async () => {
    if (!validateFormForOperation('add')) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        Swal.fire({ icon: 'error', title: 'Error de Autenticación', text: 'No se encontró el token de administrador. Por favor, inicie sesión.' });
        return;
      }

      const dataToSend = { ...formData };
      delete dataToSend.id;
      dataToSend.precio = parseFloat(dataToSend.precio);

      const response = await axios.post(API_BASE_URL, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Producto agregado:', response.data);
      Swal.fire({
        icon: 'success',
        title: '¡Producto Agregado!',
        text: `"${response.data.nombre}" ha sido añadido exitosamente con ID: ${response.data.id}.`,
        timer: 3000,
        showConfirmButton: false,
      });
      handleClear();
    } catch (error) {
      console.error('Error al agregar producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar',
        text: `No se pudo agregar el producto. ${error.response && error.response.data.error ? error.response.data.error : error.message}`,
      });
    }
  };

  const handleModify = async () => {
    if (!validateFormForOperation('modify')) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        Swal.fire({ icon: 'error', title: 'Error de Autenticación', text: 'No se encontró el token de administrador. Por favor, inicie sesión.' });
        return;
      }

      const { id } = formData;

      const dataToUpdate = {};
      for (const key in formData) {
        if (key === 'id') continue;
        if (key === 'estado' && formData[key] === '') {
          continue;
        }

        const value = formData[key];

        if (value !== '' && value !== null && value !== undefined) {
          if (key === 'precio') {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue) && numericValue > 0) {
              dataToUpdate[key] = numericValue;
            } else {
              Swal.fire({ icon: 'warning', title: 'Precio Inválido', text: 'El precio debe ser un número positivo para modificar.' });
              return;
            }
          } else if (key === 'imagen' && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(value)) {
            Swal.fire({ icon: 'warning', title: 'URL de Imagen Inválido', text: 'La URL de la imagen debe ser un formato válido (JPG, PNG, GIF, WEBP).' });
            return;
          } else if (typeof value === 'string' && value.trim() === '') {
             continue;
          }
          else {
            dataToUpdate[key] = value;
          }
        }
      }

      if (Object.keys(dataToUpdate).length === 0) {
          Swal.fire({ icon: 'info', title: 'Sin Cambios', text: 'No se han ingresado nuevos valores para modificar el producto.' });
          return;
      }

      const response = await axios.put(`${API_BASE_URL}/${id}`, dataToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Producto modificado:', response.data);
      Swal.fire({
        icon: 'success',
        title: '¡Producto Modificado!',
        text: `"${response.data.nombre}" (ID: ${response.data.id}) ha sido actualizado exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
      setFormData(response.data);
      // Después de modificar, el ID sigue siendo el mismo y debería bloquearse
      setIsIdLocked(true);
    } catch (error) {
      console.error('Error al modificar producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al modificar',
        text: `No se pudo modificar el producto. ${error.response && error.response.data.error ? error.response.data.error : error.message}`,
      });
    }
  };

  const handleChangeStatusToSoldOut = async () => {
    if (!validateFormForOperation('delete')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      Swal.fire({ icon: 'error', title: 'Error de Autenticación', text: 'No se encontró el token de administrador. Por favor, inicie sesión.' });
      return;
    }

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
        const response = await axios.put(`${API_BASE_URL}/${formData.id}`, { estado: 'agotado' }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Producto estado modificado:', response.data);
        setFormData(response.data);
        Swal.fire({
          icon: 'success',
          title: '¡Producto Agotado!',
          text: `El estado de "${response.data.nombre}" (ID: ${response.data.id}) ha sido cambiado a "agotado".`,
          timer: 2000,
          showConfirmButton: false,
        });
        // Después de marcar como agotado, el ID sigue siendo el mismo y debería bloquearse
        setIsIdLocked(true);
      } catch (error) {
        console.error('Error al cambiar estado del producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cambiar estado',
          text: `No se pudo cambiar el estado del producto. ${error.response && error.response.data.error ? error.response.data.error : error.message}`,
        });
      }
    }
  };

  const handleSearchByName = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire({ icon: 'warning', title: 'Nombre Requerido', text: 'Por favor, ingrese el nombre del producto para buscar.' });
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}?nombre=${encodeURIComponent(formData.nombre)}`);

      if (response.data && response.data.length > 0) {
        const productFound = response.data[0];
        setFormData(productFound);
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado',
          text: `"${productFound.nombre}" (ID: ${productFound.id}) cargado en el formulario.`,
          timer: 2000,
          showConfirmButton: false,
        });
        // Si se encuentra, bloquear el ID
        setIsIdLocked(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado',
          text: `No se encontró ningún producto con el nombre "${formData.nombre}".`,
        });
        handleClear(); // Si no se encuentra, limpiar y desbloquear
      }
    } catch (error) {
      console.error('Error al buscar producto por nombre:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al buscar',
        text: `No se pudo buscar el producto por nombre. ${error.response && error.response.data.error ? error.response.data.error : error.message}`,
      });
      handleClear(); // En caso de error, limpiar y desbloquear
    }
  };

  const handleSearchByID = async () => {
    if (!validateFormForOperation('searchByID')) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/${formData.id}`);
      if (response.data) {
        setFormData(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Producto Encontrado',
          text: `El producto con ID "${formData.id}" ha sido cargado.`,
          timer: 2000,
          showConfirmButton: false,
        });
        // Si se encuentra, bloquear el ID
        setIsIdLocked(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Producto No Encontrado',
          text: `No se encontró ningún producto con el ID "${formData.id}".`,
        });
        handleClear(); // Si no se encuentra, limpiar y desbloquear
      }
    } catch (error) {
      console.error('Error al buscar producto por ID:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al buscar',
        text: `No se pudo encontrar el producto con ID "${formData.id}". ${error.response && error.response.status === 404 ? 'Producto no existe.' : error.response && error.response.data.error ? error.response.data.error : error.message}`,
      });
      handleClear(); // En caso de error, limpiar y desbloquear
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
                  value={formData.id}
                  onChange={handleChange}
                  // Ahora readOnly depende del nuevo estado isIdLocked
                  readOnly={isIdLocked}
                  aria-label="ID del Producto"
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
                  value={formData.nombre}
                  onChange={handleChange}
                  aria-label="Nombre del Producto"
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
                  value={formData.descripcion}
                  onChange={handleChange}
                  aria-label="Descripción del Producto"
                />
                <label htmlFor="descripcion">Descripción</label>
              </div>
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
                  <option value="5">5</option>
                </select>
                <label htmlFor="nivel_picante">Nivel de Picante</label>
              </div>

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