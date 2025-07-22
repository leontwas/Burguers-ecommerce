// src/components/Login.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthProvider';

export default function Login({ onToggleRegister, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
    } catch (error) {
      console.error("Error en el login:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: error.message,
      });
    }
  };

  return (
    <div className="form-box login">
      <h2 className="animation" style={{'--i': 0}}>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box animation" style={{'--i': 1}}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Correo electrónico</label>
          <i className='bx bxs-envelope'></i>
        </div>
        <div className="input-box animation" style={{'--i': 2}}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Contraseña</label>
          <i className='bx bxs-lock'></i>
        </div>
        <button type="submit" className="btn animation" style={{'--i': 3}}>Iniciar Sesión</button>
        <div className="logreg-link animation" style={{'--i': 4}}>
          <p>¿No tienes una cuenta? <a href="#" className="register-link" onClick={(e) => { e.preventDefault(); onToggleRegister(); }}>Regístrate</a></p>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  onToggleRegister: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};