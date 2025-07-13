// src/components/LoginModal.jsx
import { createPortal } from 'react-dom';
import LoginRegister from './LoginRegister';
import '../css/loginModal.css'; // ✅ Corrección aquí

export default function LoginModal({ onClose }) {
  return createPortal(
    <div className="login-modal">
      <button className="cerrar-login" onClick={onClose}>✖</button>
      <LoginRegister />
    </div>,
    document.body
  );
}
