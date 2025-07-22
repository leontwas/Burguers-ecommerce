// src/components/Register.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthProvider';

export default function Register({ onToggleLogin, onClose }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, username);
      onClose();
    } catch (error) {
      console.error("Error en el registro:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: error.message,
      });
    }
  };

  return (
    <div className="form-box register">
      <h2 className="animation" style={{'--i': 0}}>Regístrate</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box animation" style={{'--i': 1}}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <label>Nombre de usuario</label>
          <i className='bx bxs-user'></i>
        </div>
        <div className="input-box animation" style={{'--i': 2}}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Correo electrónico</label>
          <i className='bx bxs-envelope'></i>
        </div>
        <div className="input-box animation" style={{'--i': 3}}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Contraseña</label>
          <i className='bx bxs-lock'></i>
        </div>
        <button type="submit" className="btn animation" style={{'--i': 4}}>Registrarse</button>
        <div className="logreg-link animation" style={{'--i': 5}}>
          <p>¿Ya tienes una cuenta? <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); onToggleLogin(); }}>Inicia sesión</a></p>
        </div>
      </form>
    </div>
  );
}

Register.propTypes = {
  onToggleLogin: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};