// src/components/Login.jsx (Considera renombrarlo a LoginRegister.jsx)
import { useState } from 'react';
import Swal from 'sweetalert2';
import '../css/login.css'; 
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth
import PropTypes from 'prop-types'; // Importa PropTypes

// ⭐ ELIMINADAS: db y setDoc no son necesarias aquí porque AuthContext lo maneja
// import { db } from '../firebase/config'; 
// import { doc, setDoc } from 'firebase/firestore'; 

// ⭐ ELIMINADA: Si no se usa, quítala. Si la necesitas, vuelve a añadir la lógica de uso en handleRegister.
// import checkPasswordPwned from '../utils/checkPasswordPwned'; 

// El componente Login ahora recibe la prop 'onClose'
export default function Login({ onClose }) { // Si el archivo se llama LoginRegister.jsx, cambia esto a LoginRegister
  const [active, setActive] = useState(false); // false = login, true = register
  const { login: authLogin, register: authRegister } = useAuth(); // Obtiene las funciones login y register del contexto

  // Estados para el formulario de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Estados para el formulario de registro
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Manejar cambios en los inputs de login
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar cambios en los inputs de registro
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  // Función para manejar el login con Firebase
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", loginData.email);

    try {
      // Llama a la función login del AuthContext, que manejará la SweetAlert y la redirección
      await authLogin(loginData.email, loginData.password);

      console.log('Usuario autenticado y redirigido.');
      setLoginData({ email: '', password: '' }); // Limpiar formulario
      if (onClose) { // Si se proporcionó una función onClose, llámala para cerrar el modal
        onClose();
      }
    } catch (error) {
      console.error('Error en handleLogin:', error);
      let errorMessage = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No se encontró un usuario con ese correo electrónico.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es inválido.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
      } else {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Función para manejar el registro con Firebase
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Intentando registrar con:", registerData.email);
    console.log("Datos de registro:", registerData);

    try {
      const { username, email, password } = registerData;

      if (!username || !email || !password) {
        console.log("Error: Campos incompletos");
        throw new Error('Por favor completa todos los campos');
      }

      if (password.length < 6) {
        console.log("Error: Contraseña débil");
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // ⭐ ELIMINADO: La verificación de contraseña comprometida si no se usa checkPasswordPwned
      // const pwnedCount = await checkPasswordPwned(password);
      // if (pwnedCount > 0) {
      //   await Swal.fire({
      //     title: 'Contraseña comprometida',
      //     text: `Esta contraseña ha sido expuesta en ${pwnedCount} filtraciones. Elige otra más segura.`,
      //     icon: 'warning',
      //     confirmButtonText: 'Entendido'
      //   });
      //   return;
      // }

      // ⭐ CORRECCIÓN CLAVE: Llama a authRegister con username, el contexto se encargará de Firestore
      await authRegister(email, password, username); 

      // ⭐ ELIMINADO: Ya no necesitamos setDoc aquí, AuthContext lo maneja
      // const userDocRef = doc(db, `users/${user.uid}`);
      // await setDoc(userDocRef, {
      //   username: registerData.username,
      // }, { merge: true });

      // ⭐ ELIMINADO: El SweetAlert de éxito es manejado por AuthContext ahora
      // await Swal.fire({
      //   title: '¡Registro exitoso!',
      //   text: `Tu cuenta ha sido creada correctamente para ${user.email}`,
      //   icon: 'success',
      //   timer: 2000,
      //   timerProgressBar: true,
      //   position: 'center'
      // });

      setRegisterData({ username: '', email: '', password: '' });
      setActive(false);
      console.log("Registro completado y formulario limpiado.");

      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Error en handleRegister:', error);
      let errorMessage = 'Error al registrar usuario';
      let errorIcon = 'error';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está en uso. Por favor, inicia sesión o usa otro correo.';
        errorIcon = 'warning';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es inválido.';
      } else {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: errorIcon,
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="tarjeta-login">
      <div className={`wrapper${active ? ' active' : ''}`}>
        <span className="bg-animate"></span>
        <span className="bg-animate2"></span>

        {/* FORM LOGIN */}
        <div className="form-box login">
          <h2 className="animation" style={{ '--i': 0 }}>Inicio de Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="input-box animation" style={{ '--i': 1 }}>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <label>Correo electrónico</label>
              <i className='bx bxs-envelope'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 2 }}>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <label>Contraseña</label>
              <i className='bx bxs-lock'></i>
            </div>
            <button type="submit" className="btn animation" style={{ '--i': 3 }}>
              Iniciar Sesión
            </button>
            <div className="logreg-link animation" style={{ '--i': 4 }}>
              <p>
                ¿No tienes una cuenta?{' '}
                <a
                  href="#"
                  className="register-link"
                  onClick={e => {
                    e.preventDefault();
                    setActive(true);
                  }}
                >
                  Regístrate
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* INFO TEXT LOGIN */}
        <div className="info-text login">
          <h2 className="animation" style={{ '--i': 0 }}>
            Bienvenido
          </h2>
          <p className="animation" style={{ '--i': 1 }}>
            Para acceder ingresa tu correo electrónico y tu contraseña.
          </p>
        </div>

        {/* FORM REGISTER */}
        <div className="form-box register">
          <h2 className="animation" style={{ '--i': 0 }}>
            Regístrate
          </h2>
          <form onSubmit={handleRegister}>
            <div className="input-box animation" style={{ '--i': 1 }}>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                required
              />
              <label>Nombre de usuario</label>
              <i className='bx bxs-user'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 2 }}>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <label>Correo electrónico</label>
              <i className='bx bxs-envelope'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 3 }}>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
              <label>Contraseña</label>
              <i className='bx bxs-lock'></i>
            </div>
            <button type="submit" className="btn animation" style={{ '--i': 4 }}>
              Registrarse
            </button>
            <div className="logreg-link animation" style={{ '--i': 5 }}>
              <p>
                ¿Ya tienes una cuenta?{' '}
                <a
                  href="#"
                  className="login-link"
                  onClick={e => {
                    e.preventDefault();
                    setActive(false);
                  }}
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* INFO TEXT REGISTER */}
        <div className="info-text register">
          <h2 className="animation" style={{ '--i': 0 }}>
            Bienvenido
          </h2>
          <p className="animation" style={{ '--i': 1 }}>
            Para registrarte ingresa un nombre de usuario, tu correo electrónico y una contraseña.
          </p>
        </div>
      </div>
    </div>
  );
}

// Definición de PropTypes para validar la prop onClose
Login.propTypes = {
  onClose: PropTypes.func, // onClose es una función y es opcional
};