// src/components/LoginRegister.jsx
import { useState } from 'react';
import Swal from 'sweetalert2';
import '../css/login.css';
import { useAuth } from '../context/AuthProvider';
import checkPasswordPwned from '../utils/checkPasswordPwned'; // asegurate de que la ruta sea correcta

export default function LoginRegister() {
  const { login, register } = useAuth();

  const [active, setActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      setLoginData({ email: '', password: '' });
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No se encontró un usuario con ese correo electrónico.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es inválido.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciales inválidas.';
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { username, email, password } = registerData;

      if (!username || !email || !password) {
        throw new Error('Por favor completa todos los campos');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Verifica si la contraseña ha sido comprometida
      const pwnedCount = await checkPasswordPwned(password);
      if (pwnedCount > 0) {
        await Swal.fire({
          title: 'Contraseña comprometida',
          text: `Esta contraseña ha sido expuesta en ${pwnedCount} filtraciones. Elige otra más segura.`,
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      await register(email, password);
      setRegisterData({ username: '', email: '', password: '' });
      setActive(false);
    } catch (error) {
      let errorMessage = 'Error al registrar usuario';
      let errorIcon = 'error';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está en uso.';
        errorIcon = 'warning';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil.';
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
              <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
              <label>Correo electrónico</label>
              <i className='bx bxs-envelope'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 2 }}>
              <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
              <label>Contraseña</label>
              <i className='bx bxs-lock'></i>
            </div>
            <button type="submit" className="btn animation" style={{ '--i': 3 }}>
              Iniciar Sesión
            </button>
            <div className="logreg-link animation" style={{ '--i': 4 }}>
              <p>
                ¿No tienes una cuenta?{' '}
                <a href="#" className="register-link" onClick={e => { e.preventDefault(); setActive(true); }}>
                  Regístrate
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* INFO TEXT LOGIN */}
        <div className="info-text login">
          <h2 className="animation" style={{ '--i': 0 }}>Bienvenido</h2>
          <p className="animation" style={{ '--i': 1 }}>
            Para acceder ingresa tu correo electrónico y tu contraseña.
          </p>
        </div>

        {/* FORM REGISTER */}
        <div className="form-box register">
          <h2 className="animation" style={{ '--i': 0 }}>Regístrate</h2>
          <form onSubmit={handleRegister}>
            <div className="input-box animation" style={{ '--i': 1 }}>
              <input type="text" name="username" value={registerData.username} onChange={handleRegisterChange} required />
              <label>Nombre de usuario</label>
              <i className='bx bxs-user'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 2 }}>
              <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} required />
              <label>Correo electrónico</label>
              <i className='bx bxs-envelope'></i>
            </div>
            <div className="input-box animation" style={{ '--i': 3 }}>
              <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} required />
              <label>Contraseña</label>
              <i className='bx bxs-lock'></i>
            </div>
            <button type="submit" className="btn animation" style={{ '--i': 4 }}>
              Registrarse
            </button>
            <div className="logreg-link animation" style={{ '--i': 5 }}>
              <p>
                ¿Ya tienes una cuenta?{' '}
                <a href="#" className="login-link" onClick={e => { e.preventDefault(); setActive(false); }}>
                  Inicia sesión
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* INFO TEXT REGISTER */}
        <div className="info-text register">
          <h2 className="animation" style={{ '--i': 0 }}>Bienvenido</h2>
          <p className="animation" style={{ '--i': 1 }}>
            Para registrarte ingresa un nombre de usuario, tu correo electrónico y una contraseña.
          </p>
        </div>
      </div>
    </div>
  );
}
