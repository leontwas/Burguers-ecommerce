// src/components/LoginModal.jsx
import { createPortal } from 'react-dom';
import LoginRegister from './LoginRegister';

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
      <div className="login-modal">
        <button className="cerrar-login" onClick={onClose}>✖</button>
        <LoginRegister />
      </div>
    </>,
    document.body
  );
}
