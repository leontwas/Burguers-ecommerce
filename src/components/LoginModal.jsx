// src/components/LoginModal.jsx
import { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Login from './Login'; // Importamos Login
import Register from './Register'; // Necesitaremos un componente Register
import InfoTextLogin from './InfoTextLogin'; // Componente para info-text.login
import InfoTextRegister from './InfoTextRegister'; // Componente para info-text.register
import '../css/login.css'; // ✨ Importa tu CSS principal aquí, ¡todo el CSS en uno! ✨

export default function LoginModal({ onClose }) {
  const [isRegistering, setIsRegistering] = useState(false); // Estado para controlar el modo registro

  // Asegúrate de que el div 'modal-root' exista en el body para el Portal
  if (!document.getElementById('modal-root')) {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  // Clase dinámica para el wrapper, replicando la lógica de login.js
  const wrapperClass = `wrapper ${isRegistering ? 'active' : ''}`;

  return ReactDOM.createPortal(
    <>
      {/* Estos son los estilos del overlay del modal y el botón de cerrar */}
      <style>
        {`
          .login-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(8, 27, 41, 1); /* Tu color original */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            padding: 20px;
          }

          .cerrar-login {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 24px;
            color: white;
            background: transparent;
            border: none;
            cursor: pointer;
            z-index: 10000;
          }
        `}
      </style>
      
      <div className="login-overlay">
        <button className="cerrar-login" onClick={onClose}>✖</button>

        {/* Este es el 'wrapper' principal que tu CSS espera */}
        <div className={wrapperClass}>
          {/* Los span bg-animate son hermanos del form-box y info-text */}
          <span className="bg-animate"></span>
          <span className="bg-animate2"></span>

          {/* Componente para el formulario de Login */}
          <Login onToggleRegister={() => setIsRegistering(true)} onClose={onClose} />

          {/* Componente para el texto informativo de Login */}
          <InfoTextLogin />

          {/* Componente para el formulario de Registro */}
          <Register onToggleLogin={() => setIsRegistering(false)} onClose={onClose} />

          {/* Componente para el texto informativo de Registro */}
          <InfoTextRegister />
        </div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
}

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};