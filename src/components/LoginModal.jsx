// src/components/LoginModal.jsx
import { createPortal } from 'react-dom';
import Login from './Login'; 

export default function LoginModal({ onClose }) {
  return createPortal(
    <>
      <style>
        {`
          .login-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(8, 27, 41, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999; /* Asegura que el modal esté por encima de la mayoría de los elementos */
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
            z-index: 10000; /* Asegura que el botón de cerrar esté por encima del modal */
          }
        `}
      </style>
      <div className="login-modal">
        <button className="cerrar-login" onClick={onClose}>✖</button>
        {/* Pasa la función onClose al componente Login */}
        <Login onClose={onClose} />
      </div>
    </>,
    document.body
  );
}
